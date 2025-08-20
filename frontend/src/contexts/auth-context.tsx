import { useState, type PropsWithChildren } from "react";
import React from "react";
import type {
  IRefreshTokenRequest,
  ITokenInformations,
} from "../services/authentication-service.types";
import { useAuthenticationApis } from "../services/authentication-service";
import { AuthContext } from "./auth-context.types";
import { decodeToken, isExpired } from "react-jwt";
import type { UserRole } from "../services/users-service.types";

const LS_TOKEN = "token";
const LS_TOKEN_INFOS = "tokenInformations";
const LS_REFRESH_TOKEN = "refreshToken";

export const AuthContextProvider: React.FC<PropsWithChildren> = (props) => {
  const authApi = useAuthenticationApis();
  const [token, setToken] = useState<string | null>(null);
  const [tokenInformations, setTokenInformations] =
    useState<ITokenInformations | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  const initialCall = async () => {
    let lsTokenFound = localStorage.getItem(LS_TOKEN);
    const lsStrTokenInfosFound = localStorage.getItem(LS_TOKEN_INFOS);
    let lsTokenInformationsFound = lsStrTokenInfosFound
      ? JSON.parse(lsStrTokenInfosFound)
      : null;

    if (lsTokenFound) {
      const payload = decodeToken(lsTokenFound);
      if (payload) {
        if (isExpired(lsTokenFound)) {
          lsTokenFound = null;
          lsTokenInformationsFound = null;
        }
      }
    }
    let lsRefreshTokenFound = localStorage.getItem("refreshToken");
    if (lsRefreshTokenFound) {
      const payload = decodeToken(lsRefreshTokenFound);
      if (payload) {
        if (isExpired(lsRefreshTokenFound)) {
          lsRefreshTokenFound = null;
        } else {
          if (!lsTokenFound) {
            const response = await authApi.refreshToken({
              refreshToken: lsRefreshTokenFound,
            });
            localStorage.setItem(LS_TOKEN, response.token);
            lsTokenFound = response.token;
            lsRefreshTokenFound = response.refreshToken;
          }
        }
      }
    }

    if (lsTokenFound && !lsTokenInformationsFound) {
      localStorage.setItem(LS_TOKEN, lsTokenFound);
      const response = await authApi.getTokenInfos();
      lsTokenInformationsFound = response;
    }

    if (lsTokenFound) {
      localStorage.setItem(LS_TOKEN, lsTokenFound);
    } else {
      localStorage.removeItem(LS_TOKEN);
    }
    if (lsRefreshTokenFound) {
      localStorage.setItem(LS_REFRESH_TOKEN, lsRefreshTokenFound);
    } else {
      localStorage.removeItem(LS_REFRESH_TOKEN);
    }
    if (lsTokenInformationsFound) {
      localStorage.setItem(
        LS_TOKEN_INFOS,
        JSON.stringify(lsTokenInformationsFound),
      );
    } else {
      localStorage.removeItem(LS_TOKEN_INFOS);
    }
    if (lsTokenFound !== token) {
      setToken(lsTokenFound);
    }
    if (refreshToken !== lsRefreshTokenFound) {
      setRefreshToken(lsRefreshTokenFound);
    }
    if (tokenInformations !== lsTokenInformationsFound) {
      setTokenInformations(lsTokenInformationsFound);
    }
  };

  if (!isReady) {
    initialCall();
    setIsReady(true);
  }

  const loginUser = async (email: string, password: string) => {
    try {
      const authenticateResponse = await authApi.authenticate({
        email,
        password,
      });
      localStorage.setItem(LS_TOKEN, authenticateResponse.token);
      localStorage.setItem(LS_REFRESH_TOKEN, authenticateResponse.refreshToken);
      setToken(authenticateResponse.token);
      setRefreshToken(authenticateResponse.refreshToken);
      const tokenInfosResponse = await authApi.getTokenInfos();
      localStorage.setItem(LS_TOKEN_INFOS, JSON.stringify(tokenInfosResponse));
      setTokenInformations(tokenInfosResponse);
    } catch (error) {
      console.error("AuthContext: Got error : ", error);
    }
  };

  const isLoggedIn = () => {
    return !!token;
  };

  const renewAccessToken = async (): Promise<void> => {
    if (!refreshToken) {
      return;
    }
    const request: IRefreshTokenRequest = {
      refreshToken,
    };
    try {
      const response = await authApi.refreshToken(request);
      setToken(response.token);
    } catch (error) {
      console.error(
        "AuthContext : while calling authApi.refreshToken, got the following error :",
        error,
      );
    }
  };

  const logout = () => {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_TOKEN_INFOS);
    localStorage.removeItem(LS_REFRESH_TOKEN);
    setTokenInformations(null);
    setToken("");
    setRefreshToken(null);
  };

  const hasRole = (userRole: UserRole): boolean => {
    if (!tokenInformations) {
      return false;
    }
    if (tokenInformations.roles && tokenInformations.roles.length > 0) {
      return tokenInformations.roles.find((r) => r === userRole) !== undefined;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        loginUser,
        tokenInformations,
        token,
        refreshToken,
        logout,
        renewAccessToken,
        isLoggedIn,
        hasRole,
      }}
    >
      {isReady ? props.children : null}
    </AuthContext.Provider>
  );
};
