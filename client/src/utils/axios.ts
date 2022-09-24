import axios, { AxiosRequestConfig } from "axios";
import { baseUrl } from "constants/apiUrls";
import { getToken } from "constants/token";

const customFetch = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

customFetch.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (!config || !config.headers || !config.url) {
    console.error("Fetching data error");
    throw Error("Fetching data error");
  }

  const accessToken = await getToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;

    return config;
  }

  return config;
});

export default customFetch;
