import { processRequest, type IHttpEndpoint } from "./base-api-calls";
import type {
  IAuthenticateRequest,
  IAuthenticateResponse,
  IRefreshTokenRequest,
  IRefreshTokenResponse,
  ITokenInformations,
} from "./authentication-service.types";

declare const BACKEND_URL: string;

export const AUTH_ENDPOINT: IHttpEndpoint = {
  url: `${BACKEND_URL}/api/v1/auth/token`,
  method: 'post',
  needsAuth: false,
}

export const GET_TOKEN_INFOS: IHttpEndpoint = {
  url: `${BACKEND_URL}/api/v1/auth/tokenInfos`,
  method: 'get',
  needsAuth: true,
}

export const REFRESH_TOKEN: IHttpEndpoint = {
  url: `${BACKEND_URL}/api/v1/auth/refreshToken`,
  method: 'post',
  needsAuth: false,
}

export const useAuthenticationApis = () => {
  async function authenticate(
    request: IAuthenticateRequest,
  ): Promise<IAuthenticateResponse> {
    try {
      console.log("Authenticate url : ", AUTH_ENDPOINT);
      const response = await processRequest<IAuthenticateRequest, IAuthenticateResponse>(AUTH_ENDPOINT, request);
      return response;
    } catch (error: unknown) {
      console.error("Got error when trying to : authenticate : ", error);
      throw error;
    }
  }

  async function getTokenInfos(): Promise<ITokenInformations> {
    try {
      const response = await processRequest<void, ITokenInformations>(GET_TOKEN_INFOS);
      return response;
    } catch (error: unknown) {
      console.error("Got error when tyring to : getTokenInfos :", error);
      throw error;
    }
  }

  async function refreshToken(
    request: IRefreshTokenRequest,
  ): Promise<IRefreshTokenResponse> {
    try {
      const response = await processRequest<IRefreshTokenRequest, IRefreshTokenResponse>(REFRESH_TOKEN, request);
      return response;
    } catch (error: unknown) {
      console.error("Got error while calling /refreshToken : ", error);
      throw error;
    }
  }

  return { authenticate, getTokenInfos, refreshToken };
};
