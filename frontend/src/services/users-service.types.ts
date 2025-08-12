export enum UserRole {
  UserManager = "user_manager",
  ShuttersProgrammer = "shutters_programmer",
}

export interface IUser {
  email: string;
  password: string;
  isActive: boolean;
  roles: UserRole[];
}

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

export interface IUserResponse {
  email: string;
  roles: UserRole[];
  isActive: boolean;
}

export type IListUsersResponse = IUserResponse[];
