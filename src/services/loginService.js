import { api } from "../services/api";
import * as utils from "../utils";
import { actionLogin } from "../store/actions";
import store from "../store";

export const login = async (user, password, navigation) => {
  try {
    var { data } = await api.post( "/auth", {
      user,
      pwd: password
    });
  } catch (err) {
    console.log("Login Error: ", err.message);
    utils.showAlert(
      "Atenção", 
      "Erro ao tentar autenticar usuário !!"
    );
  };

  if (data.auth) {
    store.dispatch(actionLogin(data.username));
    utils.checkAndSend(navigation);
  } else {
    if (data.message) {
      utils.showAlert(
        "Acesso Negado", 
        data.message
      );
    } else {
      utils.showAlert(
        "Acesso Negado", 
        "Usuário e/ou Senha não encontrado"
      );
    };
  };
};
