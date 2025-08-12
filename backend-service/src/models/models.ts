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
