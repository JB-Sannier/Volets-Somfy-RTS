import axios, { type InternalAxiosRequestConfig } from "axios";

async function axiosRequestInterceptor(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  if (config.url?.startsWith("/api") && config.url !== "/api/v1/auth/token") {
    config.headers.Authorization = localStorage.getItem("token");
  }
  return config;
}

axios.interceptors.request.use(axiosRequestInterceptor);
