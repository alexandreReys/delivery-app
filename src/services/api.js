import axios from "axios";
import { BASE_URL_DEV, BASE_URL_PROD } from "../../.env.json";
import store from "../store";

const mysqlBaseUrl = process.env.NODE_ENV == "development" ? BASE_URL_DEV : BASE_URL_PROD;

console.log('deliveryShop' + " / " + process.env.NODE_ENV + " / " + mysqlBaseUrl);

export const api = axios.create({
  baseURL: mysqlBaseUrl,
});

api.interceptors.request.use(async (config) => {
  const token = store.getState().loginState.token;
  if (token) {
      config.headers.authorization = `${token}`;
  }
  return config;
});
