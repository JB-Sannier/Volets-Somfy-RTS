import { useEffect, useState, type PropsWithChildren } from "react";
import React from "react";
import type { ITokenInformations } from "../services/authentication-service.types";
import {
  authenticate,
  getTokenInfos,
} from "../services/authentication-service";
import { AuthContext } from "./auth-context.types";
import { decodeToken, isExpired } from "react-jwt";
import type { UserRole } from "../services/users-service.types";

export const AuthContextProvider: React.FC<PropsWithChildren> = (props) => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInformations, setTokenInformations] =
    useState<ITokenInformations | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const tokenToAnalyze = localStorage.getItem("token");
    if (tokenToAnalyze) {
      const payload = decodeToken(tokenToAnalyze);
      if (payload) {
        if (isExpired(tokenToAnalyze)) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenInformations");
          setToken(null);
          setTokenInformations(null);
        } else {
          setToken(tokenToAnalyze);
          const tokenInfos = localStorage.getItem("tokenInfos");
          if (tokenInfos) {
            setTokenInformations(JSON.parse(tokenInfos));
          }
        }
      }
    }
    setIsReady(true);
  }, []);

  const loginUser = async (email: string, password: string) => {
    try {
      const authenticateResponse = await authenticate({ email, password });
      localStorage.setItem("token", authenticateResponse.token);
      setToken(authenticateResponse.token);

      const tokenInfosResponse = await getTokenInfos();
      localStorage.setItem("tokenInfos", JSON.stringify(tokenInfosResponse));
      setTokenInformations(tokenInfosResponse);
    } catch (error) {
      console.error("AuthContext: Got error : ", error);
    }
  };

  const isLoggedIn = () => {
    return !!token;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setTokenInformations(null);
    setToken("");
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
        logout,
        isLoggedIn,
        hasRole,
      }}
    >
      {isReady ? props.children : null}
    </AuthContext.Provider>
  );
};
