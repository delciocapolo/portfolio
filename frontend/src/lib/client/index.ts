import axios from "axios";
import { env } from "@src/env";
import { getToken } from "./utils";

const client = axios.create({
  baseURL: env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const AUTH_TOKEN = getToken();

    if (AUTH_TOKEN && AUTH_TOKEN !== null && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export { client };
