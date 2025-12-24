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
  IRefreshTokenRequest,
  IRefreshTokenResponse,
} from "../models/users-requests";
import {
  ErrorCodes,
  InternalServerError,
  UnauthorizedError,
  UserAlreadyExistsError,
  UserNotFoundError,
} from "../models/app-error";
import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import axios, { isAxiosError } from "axios";

export const userServiceKey = "UserService";

export interface IUserService {
  authenticate(request: IAuthenticateRequest): Promise<IAuthenticateResponse>;
  refreshToken(request: IRefreshTokenRequest): Promise<IRefreshTokenResponse>;
  addUser(request: IAddUserRequest, token: string): Promise<IAddUserResponse>;
  deleteUser(
    request: IDeleteUserRequest,
    token: string,
  ): Promise<IDeleteUserResponse>;
  modifyUser(
    request: IModifyUserRequest,
    token: string,
  ): Promise<IModifyUserResponse>;
  listUsers(token: string): Promise<IListUsersResponse>;
}

@provide(userServiceKey)
export class UserService implements IUserService {
  constructor(
    @inject(appConfigServiceKey) private readonly appConfig: IAppConfigService,
  ) {}

  async authenticate(
    request: IAuthenticateRequest,
  ): Promise<IAuthenticateResponse> {
    const baseUrl = this.appConfig.authenticationServiceURL();
    const path = "api/v1/auth/token";
    const fullUrl = `${baseUrl}/${path}`;
    try {
      const response = await axios.post<IAuthenticateResponse>(
        fullUrl,
        request,
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async refreshToken(
    request: IRefreshTokenRequest,
  ): Promise<IRefreshTokenResponse> {
    const baseUrl = this.appConfig.authenticationServiceURL();
    const path = "api/v1/auth/refreshToken";
    const fullUrl = `${baseUrl}/${path}`;
    try {
      const response = await axios.post<IAuthenticateResponse>(
        fullUrl,
        request,
      );
      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async addUser(
    request: IAddUserRequest,
    token: string,
  ): Promise<IAddUserResponse> {
    const fullPath = `${this.appConfig.authenticationServiceURL()}/api/v1/user`;
    try {
      const response = await axios.post(fullPath, request, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async deleteUser(
    user: IDeleteUserRequest,
    token: string,
  ): Promise<IDeleteUserResponse> {
    const fullPath = `${this.appConfig.authenticationServiceURL()}/api/v1/user/${user.email}`;
    try {
      const response = await axios.delete(fullPath, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async modifyUser(
    request: IModifyUserRequest,
    token: string,
  ): Promise<IModifyUserResponse> {
    const fullPath = `${this.appConfig.authenticationServiceURL()}/api/v1/user`;
    try {
      const response = await axios.put(fullPath, request, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async listUsers(token: string): Promise<IListUsersResponse> {
    const fullPath = `${this.appConfig.authenticationServiceURL()}/api/v1/user`;
    try {
      const response = await axios.get(fullPath, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  private handleError(error: unknown) {
    if (isAxiosError(error)) {
      console.error("Got axios error : ", {
        status: error.status,
        code: error.code,
        message: error.message,
        name: error.name,
      });
      if (
        error.response &&
        error.response.data &&
        error.response.data.errorCode &&
        error.response.data.description
      ) {
        if (error.response.data.errorCode === ErrorCodes.UserAlreadyExists) {
          throw new UserAlreadyExistsError(
            error.response.data.payload.email || "",
          );
        } else if (error.response.data.errorCode === ErrorCodes.UserNotFound) {
          throw new UserNotFoundError(error.response.data.payload.email);
        }
        throw new InternalServerError(error.response.data.payload);
      }
    } else {
      console.error("Got unhandled error : ", error);
    }
    throw new UnauthorizedError();
  }
}
