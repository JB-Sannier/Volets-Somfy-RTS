import axios from "axios";

export interface IHttpEndpoint {
  url: string;
  method: "get" | "post" | "put" | "delete";
  needsAuth: boolean;
}

export function getAccessToken(): string | null {
  return localStorage.getItem("token");
}

export async function processRequest<IRequest, IResponse>(
  httpEndpoint: IHttpEndpoint,
  bodyContent?: IRequest,
  queryParameters?: string,
): Promise<IResponse> {
  const token = getAccessToken();
  if (httpEndpoint.needsAuth) {
    if (!token) {
      throw new Error("Unauthorized : You need to login first.");
    }
  }
  console.log(
    ` Will process ${httpEndpoint.method} on ${httpEndpoint.url} + ${queryParameters}`,
  );
  const response = await axios.request<IResponse>({
    url: httpEndpoint.url + (queryParameters || ""),
    method: httpEndpoint.method,
    headers: httpEndpoint.needsAuth
      ? { Authorization: `Bearer ${token || ""}` }
      : undefined,
    data: bodyContent,
  });
  return response.data;
}
