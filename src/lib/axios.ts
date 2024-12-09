import axios from "axios";
import { getToken } from "./local-storage";
import { Ref } from "react";
import { RootStackParamList } from "./routes";
import {
  NavigationContainerRef,
  NavigationContainerRefWithCurrent,
} from "@react-navigation/native";

export const API_BASE_URL = "https://staging-api.positive-gym.com/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: "",
  },
});

api.interceptors.request.use(
  async config => {
    const token = await getToken();
    console.log(token, "token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const unauthorizedInterceptor = (
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>,
) => {
  api.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const status = error.response?.status;
      console.log(status, "status");
      if (status === 401 || status === "401") {
        console.log("unauthorized");
        navigationRef?.resetRoot({
          index: 0,
          routes: [{ name: "LoginPage" }],
        });
      }
      return Promise.reject(error);
    },
  );
};
