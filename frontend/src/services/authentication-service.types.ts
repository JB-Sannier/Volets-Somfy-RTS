import type { UserRole } from "./users-service.types";

export interface IAuthenticateRequest {
  email: string;
  password: string;
}

export interface IAuthenticateResponse {
  token: string;
  refreshToken: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export type IRefreshTokenResponse = IAuthenticateResponse;

export interface ITokenInformations {
  email: string;
  roles: UserRole[];
}
