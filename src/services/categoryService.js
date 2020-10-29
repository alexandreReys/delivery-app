import { api } from "./api";
import store from "../store";
import { actionGetCategories } from "../store/actions";

export const get = async () => {
  const resp = await api.get("/category");
  let categories = resp.data;
  categories.unshift({ IdCategory: 0, DescriptionCategory: "Promoção" });
  store.dispatch(actionGetCategories(categories));
  return categories;
};
