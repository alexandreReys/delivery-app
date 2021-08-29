import { api } from "../services/api";
import * as utils from "../utils";
import { actionLogin, actionSetCustomerInfo } from "../store/actions";
import store from "../store";

export const login = async (user, password) => {
    try {
        var { data } = await api.post("/customer-authentication", {user,password});
    } catch (err) {
        console.log("Login Error: ", err.message);
        utils.showAlert(
            "Atenção",
            "Erro ao tentar autenticar usuário !!"
        );
        return null;
    };

    if (!data.auth) {
        if (data.message) {
            return utils.showAlert(
                "Acesso Negado",
                data.message
            );
        } else {
            utils.showAlert(
                "Acesso Negado",
                "Usuário e/ou Senha não encontrado"
            );
        };

        return null;
    };

    const authData = { 
        userName: data.userData.NameCustomer, 
        token: data.token,
    };
    store.dispatch(actionLogin(authData));
    
    const customerInfo = { 
        id: data.userData.IdCustomer, 
        name: data.userData.NameCustomer, 
        phoneNumber: data.userData.PhoneNumberCustomer, 
        document: data.userData.DocumentCustomer, 
    };
    store.dispatch(actionSetCustomerInfo(customerInfo));

    return { userData: data.userData };
};

export const newAccount = async (data) => {
    try {
        var response = await api.post('/customers', {
            EmailCustomer: data.email,
            PasswordCustomer: data.password,
            NameCustomer: data.name,
        });
    } catch (err) {
        console.log("Error: ", err.message);
        return null;
    };

    if (response.data.errorMessage) {
        utils.showAlert(
            "Ops, e-mail já cadastrado",
            "Utilize este e-mail para fazer o login !!"
        );
        return null;
    };

    return response.data.insertId;
};

export const passwordRecover = async (email) => {
    let response;
    try {
        response = await api.post('/customers/password-recover', { EmailCustomer: email });
    } catch (err) {
        console.log("Error: ", err.message);
        return null;
    };

    if (response.data.errorMessage) {
        utils.showAlert( 'Ops !!', response.data.errorMessage );
        return null;
    };

    return true;
};
