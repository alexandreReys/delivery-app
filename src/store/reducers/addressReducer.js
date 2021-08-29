import AsyncStorage from '@react-native-community/async-storage';

const INITIAL_STATE = {
    id: "",
    name: "",
    document: "",
    phoneNumber: "",
    addressType: "",
    postalCode: "",
    street: "",
    number: "",
    complement: "",
    info: "",
    neighborhood: "",
    city: "",
    state: "",
    coords: null,
};

export default function deliveryAddressReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "ACTION_SET_DELIVERY_ADDRESS":
            return setDeliveryAddress(state, action);
        case "ACTION_DELIVERY_ADDRESS_SAVE":
            return deliveryAddressSave(state, action);
        case "ACTION_SET_CUSTOMER_INFO":
            return setCustomerInfo(state, action);
        case "ACTION_SET_COORDS":
            return setCoords(state, action);
        default:
            return state;
    };
};

//  RECEBE TODOS PARAMETROS DO STORAGE
const setDeliveryAddress = (state, { address }) => {
    return {
        ...state,
        id: address.id,
        name: address.name,
        document: address.document,
        phoneNumber: address.phoneNumber,
        addressType: address.addressType,
        postalCode: address.postalCode,
        street: address.street,
        number: address.number,
        complement: address.complement,
        info: address.info,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
    }
};

const deliveryAddressSave = (state, { address }) => {

    // AsyncStorage.setItem("customer-id", address.id ? address.id : " ");
    // AsyncStorage.setItem("customer-name", address.name ? address.name : " ");
    // AsyncStorage.setItem("customer-document", address.document ? address.document : " ");
    // AsyncStorage.setItem("customer-phoneNumber", address.phoneNumber ? address.phoneNumber : " ");

    AsyncStorage.setItem("deliveryAddress-addressType", address.addressType ? address.addressType : " ");
    AsyncStorage.setItem("deliveryAddress-postalCode", address.postalCode);
    AsyncStorage.setItem("deliveryAddress-street", address.street);
    AsyncStorage.setItem("deliveryAddress-number", address.number);
    AsyncStorage.setItem("deliveryAddress-complement", address.complement ? address.complement : " ");
    AsyncStorage.setItem("deliveryAddress-info", address.info ? address.info : " ");
    AsyncStorage.setItem("deliveryAddress-neighborhood", address.neighborhood);
    AsyncStorage.setItem("deliveryAddress-city", address.city);
    AsyncStorage.setItem("deliveryAddress-state", address.state);

    return {
        ...state,
        // id: address.id,
        // name: address.name,
        // document: address.document,
        // phoneNumber: address.phoneNumber,

        addressType: address.addressType,
        postalCode: address.postalCode,
        street: address.street,
        number: address.number,
        complement: address.complement,
        info: address.info,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
    };
};

const setCustomerInfo = (state, { customerInfo }) => {

    AsyncStorage.setItem("customer-id", customerInfo.id ? customerInfo.id.toString() : " ");
    AsyncStorage.setItem("customer-name", customerInfo.name ? customerInfo.name : " ");
    AsyncStorage.setItem("customer-document", customerInfo.document ? customerInfo.document : " ");
    AsyncStorage.setItem("customer-phoneNumber", customerInfo.phoneNumber ? customerInfo.phoneNumber : " ");

    return {
        ...state,
        id: customerInfo.id,
        name: customerInfo.name,
        document: customerInfo.document,
        phoneNumber: customerInfo.phoneNumber,
    };
};

const setCoords = (state, { coords }) => {
    return {
        ...state,
        coords,
    }
};
