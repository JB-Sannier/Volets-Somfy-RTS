import axios, { type InternalAxiosRequestConfig } from "axios";

const UNPROTECTED_URLS = ["/api/v1/auth/token", "/api/v1/auth/refreshToken"];

async function axiosRequestInterceptor(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  if (
    config.url?.startsWith("/api") &&
    UNPROTECTED_URLS.filter((uu) => !config.url?.startsWith(uu)).length > 0
  ) {
    config.headers.Authorization = localStorage.getItem("token");
  }
  return config;
}

axios.interceptors.request.use(axiosRequestInterceptor);
