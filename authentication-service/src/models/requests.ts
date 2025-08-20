import { IUserResponse, UserRole } from "./models";

export interface IAddUserRequest {
  email: string;
  password: string;
  roles: UserRole[];
}

export interface IAddUserResponse {
  ok: boolean;
}

export interface IDeleteUserRequest {
  email: string;
}

export interface IDeleteUserResponse {
  email: string;
}

export interface IModifyUserRequest {
  email: string;
  password?: string;
  roles?: UserRole[];
  isActive?: boolean;
}

export interface IModifyUserResponse {
  email: string;
  roles: UserRole[];
}

export interface IAuthenticateRequest {
  email: string;
  password: string;
}

export interface IAuthenticateResponse {
  token: string;
  refreshToken: string;
}

export type IListUsersResponse = IUserResponse[];

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export type IRefreshTokenResponse = IAuthenticateResponse;
