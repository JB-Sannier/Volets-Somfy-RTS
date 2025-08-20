import type {
  IAuthenticateRequest,
  IAuthenticateResponse,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
  ITokenInformations,
} from "./authentication-service.types";
import axios from "axios";

export const useAuthenticationApis = () => {
  async function authenticate(
    request: IAuthenticateRequest,
  ): Promise<IAuthenticateResponse> {
    const url = "/api/v1/auth/token";
    try {
      const response = await axios.post<IAuthenticateResponse>(url, request);
      return response.data;
    } catch (error: unknown) {
      console.error("Got error when trying to : authenticate : ", error);
      throw error;
    }
  }

  async function getTokenInfos(): Promise<ITokenInformations> {
    const url = "/api/v1/auth/tokenInfos";
    try {
      const response = await axios.get<ITokenInformations>(url);
      return response.data;
    } catch (error: unknown) {
      console.error("Got error when tyring to : getTokenInfos :", error);
      throw error;
    }
  }

  async function refreshToken(
    request: IRefreshTokenRequest,
  ): Promise<IRefreshTokenResponse> {
    const url = "api/v1/auth/refreshToken";
    try {
      const response = await axios.post<IRefreshTokenResponse>(url, request);
      return response.data;
    } catch (error: unknown) {
      console.error("Got error while calling /refreshToken : ", error);
      throw error;
    }
  }

  return { authenticate, getTokenInfos, refreshToken };
};
