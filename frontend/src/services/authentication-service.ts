import type {
  IAuthenticateRequest,
  IAuthenticateResponse,
  ITokenInformations,
} from "./authentication-service.types";
import axios from "axios";

export async function authenticate(
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

export async function getTokenInfos(): Promise<ITokenInformations> {
  const url = "/api/v1/auth/tokenInfos";
  try {
    const response = await axios.get<ITokenInformations>(url);
    return response.data;
  } catch (error: unknown) {
    console.error("Got error when tyring to : getTokenInfos :", error);
    throw error;
  }
}
