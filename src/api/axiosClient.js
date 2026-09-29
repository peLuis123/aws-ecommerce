import axios from "axios";
import { config } from "../config/env";
import { demoMode } from "../data/demo";
import { demoAdapter } from "../data/demoAdapter";

const debug = (...args) => {
  if (import.meta.env.DEV) {
    console.log("[api]", ...args);
  }
};

export const axiosClient = axios.create({
  baseURL: config.apiBaseUrl,
  withCredentials: true,
  ...(demoMode ? { adapter: demoAdapter } : {}),
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((request) => {
  debug("request", request.method?.toUpperCase(), request.url);
  return request;
});

axiosClient.interceptors.response.use(
  (response) => {
    debug("response", response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      !demoMode &&
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.startsWith("/auth/")
    ) {
      originalRequest._retry = true;

      try {
        await axiosClient.post("/auth/refresh");
        return axiosClient(originalRequest);
      } catch (refreshError) {
        debug("session expired", refreshError.response?.status);
        window.dispatchEvent(new CustomEvent("auth:expired"));
      }
    }

    debug("error", error.response?.status, error.config?.url);
    return Promise.reject(error);
  },
);
