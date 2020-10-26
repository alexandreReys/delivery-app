import AsyncStorage from '@react-native-community/async-storage';
import { api } from "../services/api";
import store from "../store";
import { actionSetOrder, actionGetDeliveryAddress } from "../store/actions";


export const getOrders = async (status) => {
  var response;
  if (!status) { 
    response = await api.get("/delivery-order"); 
  } else {
    response = await api.get(`/delivery-order/status/${status}`); 
  }
  if (response.data.length == 0) return [];
  return response.data;
};

export const getDeliveryManOrders = async (status) => {
  const deliveryMan = store.getState().loginState.loggedUser;
  const queryParams = { params: { deliveryMan, status } };
  const response = await api.get("/delivery-order/deliveryman-status", queryParams); 
  if (response.data.length == 0) return [];
  return response.data;
};

export const getOrder = async (orderId) => {
  const response = await api.get(`/delivery-order/${orderId}`);
  if (response.data.length == 0) return null;
  return response.data[0];
};

export const getOrderItems = async (orderId) => {
  const response = await api.get(`/delivery-order/items/${orderId}`);
  if (response.data.length == 0) return null;
  return response.data;
};

export const storeOrdersToDeliver = async (orders) => {
  const response = await api.post("/delivery-order/leaving", orders);
  return response.data;
};

export const startDelivery = async (orderId) => {
  const response = await api.put(`/delivery-order/start-delivery/${orderId}`);
  return response.data;
};

export const endDelivery = async (orderId) => {
  const response = await api.put(`/delivery-order/end-delivery/${orderId}`);
  return response.data;
};

export const postOrder = async () => {
  let shoppingCart = store.getState().cartState;
  let deliveryAddress = store.getState().addressState;
  let shortAddress = getAddress(deliveryAddress);

  let order = {
    quantityItemsOrder: shoppingCart.quantityOfItems,
    totalProductsOrder: shoppingCart.subtotal,
    shippingAmountOrder: shoppingCart.shipping,
    totalOrder: shoppingCart.total,
    changeValueOrder: shoppingCart.changeValue,
    paymantTypeOrder: shoppingCart.paymentType,
    customerNameOrder: deliveryAddress.name,
    customerDocumentOrder: deliveryAddress.document,
    customerPhoneNumberOrder: deliveryAddress.phoneNumber,
    customerAddressTypeOrder: deliveryAddress.addressType,
    customerAddressOrder: shortAddress,
    customerStreetOrder: deliveryAddress.street,
    customerNumberOrder: deliveryAddress.number,
    customerComplementOrder: deliveryAddress.complement,
    customerInfoOrder: deliveryAddress.info,
    customerNeighborhoodOrder: deliveryAddress.neighborhood,
    customerCityOrder: deliveryAddress.city,
    customerStateOrder: deliveryAddress.state,
    customerPostalCodeOrder: deliveryAddress.postalCode,
    deliveryManOrder: "",
    evaluationOrder: 0,
    evaluationReasonOrder: "",
    commentsOrder: "",
    statusOrder: "Pendente",

    orderItems: shoppingCart.addedItems,
  };

  let resp;
  try {
    resp = await api.post("/delivery-order", order);
  } catch (error) {
    console.error("ErrorMessage: ", error);
    return null;
  }

  order = { ...order, orderId: resp.data.insertId };

  store.dispatch(actionSetOrder(order));

  return resp.data;
};

export const getAddressStorage = async () => {

  const address = await AsyncStorage.multiGet([
    "customer-name",
    "customer-document",
    "customer-phoneNumber",
    "deliveryAddress-addressType",
    "deliveryAddress-postalCode",
    "deliveryAddress-street",
    "deliveryAddress-number",
    "deliveryAddress-complement",
    "deliveryAddress-info",
    "deliveryAddress-neighborhood",
    "deliveryAddress-city",
    "deliveryAddress-state",
  ]).then(response => {
    return {
      name: response[0][1],
      document: response[1][1],
      phoneNumber: response[2][1],
      addressType: response[3][1],
      postalCode: response[4][1],
      street: response[5][1],
      number: response[6][1],
      complement: response[7][1],
      info: response[8][1],
      neighborhood: response[9][1],
      city: response[10][1],
      state: response[11][1]
    }
  });
  store.dispatch(actionGetDeliveryAddress(address));
  return address;
};

export const getAddress = (addr) => {
  let address = !addr.street ? "" : addr.street;

  address += !addr.number ? "" : ", " + addr.number;
  address += !addr.complement ? "" : ", " + addr.complement;
  address += !addr.neighborhood ? "" : ", Bairro: " + addr.neighborhood;
  address += !addr.city ? "" : ", " + addr.city;
  address += !addr.state ? "" : ", " + addr.state;
  address += !addr.info ? "" : ", " + addr.info;

  return address;
};

export const getCep = async (postalCode) => {
  let address = [];
  try {
    address = await api.get(`/delivery-order/postal-code/${postalCode}`);
  } catch (error) {
    console.error("OrderService.getCep: API.get.erro : ", error);
    return null;
  }

  return address.data;
};
