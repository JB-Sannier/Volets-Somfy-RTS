import { string, object, ObjectSchema, mixed, array, boolean } from "yup";
import {
  IAddUserRequest,
  IAuthenticateRequest,
  IDeleteUserRequest,
  IModifyUserRequest,
  IRefreshTokenRequest,
} from "./requests";
import { UserRole } from "./models";

export const userRoleShape = mixed<UserRole>()
  .oneOf(Object.values(UserRole))
  .defined();
export const userRolesShape = array().of(userRoleShape).default([]);

export const addUserValidator: ObjectSchema<IAddUserRequest> = object({
  email: string().required().email(),
  password: string().required().min(8),
  roles: userRolesShape,
  isActive: boolean().optional().default(true),
});

export const deleteUserValidator: ObjectSchema<IDeleteUserRequest> = object({
  email: string().defined().email(),
});

export const modifyUserValidator: ObjectSchema<IModifyUserRequest> = object({
  email: string().required().email(),
  password: string().optional().default(undefined),
  roles: userRolesShape.optional().default(undefined),
  isActive: boolean().optional().default(undefined),
});

export const authenticateValidator: ObjectSchema<IAuthenticateRequest> = object(
  {
    email: string().required().email(),
    password: string().required(),
  },
);

export const refreshTokenValidator: ObjectSchema<IRefreshTokenRequest> = object(
  {
    refreshToken: string().required(),
  },
);
