import { UserEntity } from "../entities/user";

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

export function toUser(u: UserEntity): IUser {
  return {
    email: u.email,
    password: u.password,
    isActive: u.isActive,
    roles: u.roles,
  };
}
