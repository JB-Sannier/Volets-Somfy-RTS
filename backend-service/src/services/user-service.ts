import { provide } from "inversify-binding-decorators";
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
} from "../models/users-requests";
import { AppError, UnauthorizedError } from "../models/app-error";
import { appConfigServiceKey, IAppConfigService } from "./app-config-service";
import axios, { isAxiosError } from "axios";

export const userServiceKey = "UserService";

export interface IUserService {
  authenticate(request: IAuthenticateRequest): Promise<IAuthenticateResponse>;
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
      console.log(fullUrl);
      console.log(request);
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
      await this.handleError(error);
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
      await this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async modifyUser(
    request: IModifyUserRequest,
    token: string,
  ): Promise<IModifyUserResponse> {
    const fullPath = `${this.appConfig.authenticationServiceURL()}/api/v1/user`;
    try {
      console.log("URL : ", fullPath);
      const response = await axios.put(fullPath, request, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      await this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  async listUsers(token: string): Promise<IListUsersResponse> {
    const fullPath = `${this.appConfig.authenticationServiceURL()}/api/v1/user`;
    try {
      console.log("URL : ", fullPath);
      const response = await axios.get(fullPath, {
        headers: { Authorization: token },
      });
      return response.data;
    } catch (error) {
      await this.handleError(error);
      throw new UnauthorizedError();
    }
  }

  private async handleError(error: unknown) {
    if (isAxiosError(error)) {
      console.log("Got axios error : ", {
        status: error.status,
        code: error.code,
        message: error.message,
        name: error.name,
      });
      if (
        error.response &&
        error.response.data.errorCode &&
        error.response.data.errorDescription &&
        error.response.data.payload
      ) {
        throw new AppError(
          error.response.data.errorCode,
          error.response.data.errorDescription,
          error.response.data.payload,
        );
      }
    } else {
      console.log("Got unhandled error : ", error);
    }
    throw new UnauthorizedError();
  }
}
