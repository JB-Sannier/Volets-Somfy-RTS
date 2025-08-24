import type {
  IAuthenticateRequest,
  IAuthenticateResponse,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
  ITokenInformations,
} from "./authentication-service.types";
import axios from "axios";

declare const BACKEND_URL: string;

export const useAuthenticationApis = () => {
  async function authenticate(
    request: IAuthenticateRequest,
  ): Promise<IAuthenticateResponse> {
    const url = `${BACKEND_URL}/api/v1/auth/token`;
    try {
      console.log("Authenticate url : ", url);
      const response = await axios.post<IAuthenticateResponse>(url, request);
      return response.data;
    } catch (error: unknown) {
      console.error("Got error when trying to : authenticate : ", error);
      throw error;
    }
  }

  async function getTokenInfos(): Promise<ITokenInformations> {
    const url = `${BACKEND_URL}/api/v1/auth/tokenInfos`;
    try {
      const response = await axios.get<ITokenInformations>(url);
      console.log("Authenticate: got response : ", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Got error when tyring to : getTokenInfos :", error);
      throw error;
    }
  }

  async function refreshToken(
    request: IRefreshTokenRequest,
  ): Promise<IRefreshTokenResponse> {
    const url = `${BACKEND_URL}/api/v1/auth/refreshToken`;
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
