import axios, { AxiosRequestConfig } from "axios";
import { baseUrl } from "constants/urls";
import { getTokenFromLocalStorage } from "utils/localStorage";

const customFetch = axios.create({
  baseURL: baseUrl,
});

customFetch.interceptors.request.use((config: AxiosRequestConfig) => {
  if (!config || !config.headers) {
    return { error: "Axios error" };
  }

  const token = getTokenFromLocalStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default customFetch;
