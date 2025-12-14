import { provide } from "@inversifyjs/binding-decorators";
import { inject } from "inversify";
import {
  IAddUserRequest,
  IAddUserResponse,
  IAuthenticateRequest,
  IAuthenticateResponse,
  IDeleteUserRequest,
  IDeleteUserResponse,
  IListUsersResponse,
  IModifyUserRequest,
  IModifyUserResponse,
} from "../models/requests";
import {
  IUserRepository,
  userRepositoryKey,
} from "../repositories/user-repository";
import {
  CannotModifyUserError,
  UnauthorizedError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../models/app-error";
import * as bcrypt from "bcryptjs";
import { IUser, IUserResponse, UserRole } from "../models/models";
import generatePassword from "password-generator";
import { ITokenService, tokenServiceKey } from "./token-service";
import {
  IRefreshTokenService,
  refreshTokenServiceKey,
} from "./refresh-token-sevice";

export const userServiceKey = "UserService";

export interface IUserService {
  authenticate(request: IAuthenticateRequest): Promise<IAuthenticateResponse>;

  addUser(user: IAddUserRequest): Promise<IAddUserResponse>;
  deleteUser(user: IDeleteUserRequest): Promise<IDeleteUserResponse>;
  modifyUser(user: IModifyUserRequest): Promise<IModifyUserResponse>;
  setDefaultUserIfNeeded(): Promise<void>;
  getUser(email: string): Promise<IUserResponse>;
  listUsers(): Promise<IListUsersResponse>;
}

@provide(userServiceKey)
export class UserService implements IUserService {
  private defaultUser: IUser | undefined;

  constructor(
    @inject(userRepositoryKey) private readonly userRepository: IUserRepository,
    @inject(tokenServiceKey) private readonly tokenService: ITokenService,
    @inject(refreshTokenServiceKey)
    private readonly refreshTokenService: IRefreshTokenService,
  ) {
    this.defaultUser = undefined;
  }

  async authenticate(
    request: IAuthenticateRequest,
  ): Promise<IAuthenticateResponse> {
    if (
      this.defaultUser &&
      this.defaultUser.email === request.email &&
      this.defaultUser.password === request.password
    ) {
      const token = await this.tokenService.createToken(this.defaultUser);
      return {
        token,
        refreshToken: "",
      };
    }
    const userFound = await this.userRepository.getUserByEmail(request.email);
    if (!userFound) {
      throw new UserNotFoundError(request.email);
    }
    if (!userFound.isActive) {
      throw new UserNotFoundError(request.email);
    }
    const result = bcrypt.compareSync(request.password, userFound.password);
    if (!result) {
      throw new UnauthorizedError();
    }
    const token = await this.tokenService.createToken(userFound);
    const refreshToken = await this.refreshTokenService.createRefreshToken(
      userFound.email,
    );
    return {
      token,
      refreshToken: refreshToken.token,
    };
  }

  async addUser(user: IAddUserRequest): Promise<IAddUserResponse> {
    const userFound = await this.userRepository.getUserByEmail(user.email);
    if (userFound) {
      throw new UserAlreadyExistsError(user.email);
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    const userToAdd: IUser = {
      email: user.email,
      password: hashedPassword,
      roles: user.roles,
      isActive: true,
    };
    const result = await this.userRepository.addUser(userToAdd);
    if (result && userToAdd.roles.includes(UserRole.UserManager)) {
      this.defaultUser = undefined;
    }
    return {
      ok: result,
    };
  }

  async deleteUser(user: IDeleteUserRequest): Promise<IDeleteUserResponse> {
    const userFound = await this.userRepository.getUserByEmail(user.email);
    if (!userFound) {
      throw new UserNotFoundError(user.email);
    }
    await this.userRepository.deleteUser(user.email);
    return {
      email: user.email,
    };
  }

  async modifyUser(request: IModifyUserRequest): Promise<IModifyUserResponse> {
    const userFound = await this.userRepository.getUserByEmail(request.email);
    if (!userFound) {
      throw new UserNotFoundError(request.email);
    }
    if (request.isActive !== undefined) {
      userFound.isActive = request.isActive;
    }
    if (request.password) {
      const salt = await bcrypt.genSalt(10);
      userFound.password = await bcrypt.hash(request.password, salt);
    }
    if (request.roles) {
      userFound.roles = request.roles;
    }
    const response = await this.userRepository.modifyUser(userFound);
    if (!response) {
      throw new CannotModifyUserError(request.email);
    }
    return {
      email: userFound.email,
      roles: userFound.roles,
    };
  }

  async setDefaultUserIfNeeded(): Promise<void> {
    const adminUsersCount = await this.userRepository.getAdminUsersCount();
    if (adminUsersCount === 0) {
      const password = generatePassword(10, false);
      this.defaultUser = {
        email: "admin@localhost",
        password,
        roles: [UserRole.UserManager],
        isActive: true,
      };
      console.log(
        "Since there is no registered user, use the following credentials :",
        {
          email: this.defaultUser.email,
          password,
        },
      );
    }
  }

  async getUser(email: string): Promise<IUserResponse> {
    if (this.defaultUser && this.defaultUser.email === email) {
      return this.defaultUser;
    }
    const userFound = await this.userRepository.getUserByEmail(email);
    if (!userFound) {
      throw new UserNotFoundError(email);
    }
    return {
      email: userFound.email,
      roles: userFound.roles,
      isActive: userFound.isActive,
    };
  }

  async listUsers(): Promise<IListUsersResponse> {
    const response = await this.userRepository.listUsers();
    return response;
  }
}
