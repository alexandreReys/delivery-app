import { api } from "./api";
import store from "../store";
import { actionGetSettings } from "../store/actions";

export const get = async () => {
  const resp = await api.get("/delivery-settings");
  const settings = resp.data[0];
  store.dispatch(actionGetSettings(settings));
  return settings;
};
