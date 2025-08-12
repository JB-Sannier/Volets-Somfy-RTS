import type { UserRole } from "./users-service.types";

export interface IAuthenticateRequest {
  email: string;
  password: string;
}

export interface IAuthenticateResponse {
  token: string;
}

export interface ITokenInformations {
  email: string;
  roles: UserRole[];
}
