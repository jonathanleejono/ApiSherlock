import axios, { AxiosRequestConfig } from "axios";
import { getToken } from "constants/token";
import { baseUrl } from "constants/urls";
// import { axiosToken } from "features/user/userSlice";
// import { getTokenFromLocalStorage } from "utils/localStorage";

const customFetch = axios.create({
  baseURL: baseUrl,
});

customFetch.interceptors.request.use(async (config: AxiosRequestConfig) => {
  if (!config || !config.headers) {
    return { error: "Axios error" };
  }

  const accessToken = await getToken();

  console.log("the token: ", accessToken);

  // const token = getTokenFromLocalStorage();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default customFetch;
