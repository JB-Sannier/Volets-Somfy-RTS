import axios, { type InternalAxiosRequestConfig } from "axios";

declare const BACKEND_URL: string;

const UNPROTECTED_URLS = [
  `${BACKEND_URL}/api/v1/auth/token`,
  `${BACKEND_URL}/api/v1/auth/refreshToken`,
];

async function axiosRequestInterceptor(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  if (
    config.url?.startsWith(`${BACKEND_URL}/api`) &&
    UNPROTECTED_URLS.filter((uu) => !config.url?.startsWith(uu)).length > 0
  ) {
    config.headers.Authorization = localStorage.getItem("token");
  }
  return config;
}

axios.interceptors.request.use(axiosRequestInterceptor);
