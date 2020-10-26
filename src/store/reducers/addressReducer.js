import AsyncStorage from '@react-native-community/async-storage';

const INITIAL_STATE = {
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
    case "ACTION_GET_DELIVERY_ADDRESS":
      return getDeliveryAddress(state, action);
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
  
const getDeliveryAddress = (state, { address }) => {
  return {
    ...state,
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

  AsyncStorage.setItem("customer-name", address.name? address.name: " ");
  AsyncStorage.setItem("customer-document", address.document? address.document: " ");
  AsyncStorage.setItem("customer-phoneNumber", address.phoneNumber? address.phoneNumber: " ");
  AsyncStorage.setItem("deliveryAddress-addressType", address.addressType? address.addressType: " ");
  AsyncStorage.setItem("deliveryAddress-postalCode", address.postalCode);
  AsyncStorage.setItem("deliveryAddress-street", address.street);
  AsyncStorage.setItem("deliveryAddress-number", address.number);
  AsyncStorage.setItem("deliveryAddress-complement", address.complement);
  AsyncStorage.setItem("deliveryAddress-info", address.info);
  AsyncStorage.setItem("deliveryAddress-neighborhood", address.neighborhood);
  AsyncStorage.setItem("deliveryAddress-city", address.city);
  AsyncStorage.setItem("deliveryAddress-state", address.state);

  return {
    ...state,
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
  };
};

const setCustomerInfo = (state, { customerInfo }) => {

  AsyncStorage.setItem("customer-name", customerInfo.name? customerInfo.name: " ");
  AsyncStorage.setItem("customer-document", customerInfo.document? customerInfo.document: " ");
  AsyncStorage.setItem("customer-phoneNumber", customerInfo.phoneNumber? customerInfo.phoneNumber: " ");

  return {
    ...state,
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
