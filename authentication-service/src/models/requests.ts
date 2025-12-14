import { IUserResponse, UserRole } from "./models";
import * as express from "express";

// Express wrapper to put Token informations at Request Level
// when user is authentified
export interface ITokenInformations {
  email: string;
  roles: UserRole[];
}

export interface IAuthentifiedRequest extends express.Request {
  tokenInfos: ITokenInformations;
}

// Usual Requests/Responses models
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
