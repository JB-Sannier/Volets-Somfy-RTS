import { createContext, type PropsWithChildren } from "react";
import type { ITokenInformations } from "../services/authentication-service.types";
import React from "react";
import type { UserRole } from "../services/users-service.types";

export interface IAuthContext extends PropsWithChildren {
  tokenInformations: ITokenInformations | null;
  token: string | null;
  refreshToken: string | null;
  loginUser: (username: string, password: string) => Promise<void>;
  logout: () => void;
  renewAccessToken: () => Promise<void>;
  isLoggedIn: () => boolean;
  hasRole: (userRole: UserRole) => boolean;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export const useAuthContext = () => React.useContext(AuthContext);
