import { api } from "../services/api";

export const postPushNotificationToken = async (token) => {
    let resp;
    try {
      resp = await api.post("/delivery-push-notification", {token});
    } catch (error) {
      console.error("ErrorMessage: ", error);
      return null;
    }
      return resp.data;
  };