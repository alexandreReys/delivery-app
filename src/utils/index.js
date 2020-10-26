import { Alert } from "react-native";
import { requestPermissionsAsync, getCurrentPositionAsync } from "expo-location";
import * as orderService from "../services/orderService";

import store from "../store";
import { actionSetOrders, actionSetOrder } from "../store/actions";
import logo from "../../assets/logo.png";

export const showAlert = (title, message) => {
  Alert.alert(
    title,
    message,
    [{ text: "OK" }],
    { cancelable: true }
  )
};

export const fieldInvalidMessage = message => {
  Alert.alert("Campo Invalido", message)
};

export const checkAndSend = async (navigation) => {
  var orders = [];

  orders = await orderService.getDeliveryManOrders("A caminho");
  if (orders.length > 0) {
    store.dispatch(actionSetOrder(orders[0]));
    navigation.navigate("OrderOnTheWay");
    return;
  };

  orders = await orderService.getDeliveryManOrders("Saiu para entregar");
  if (orders.length > 0) {
    store.dispatch(actionSetOrders(orders));
    navigation.navigate("OrderToDeliver");
    return;
  };

  store.dispatch(actionSetOrders([]));
  navigation.navigate("OrderSelect");
};

export const orderPrevision = (date, time) => {
  const d = new Date(`${date}T${time}`);
  const date30minutes = dateAdd(d, 'minute', +30);
  const response = leftPad(date30minutes.getUTCHours(), 2) + ":" + leftPad(date30minutes.getMinutes(), 2);
  return response;
};

function leftPad(value, totalWidth, paddingChar) {
  var length = totalWidth - value.toString().length + 1;
  return Array(length).join(paddingChar || '0') + value;
};

export const dateAdd = (date, interval, units) => {
  //  d = new Date('2020-08-28 12:00:00');
  //  log('+1 year:    ' + dateAdd(d, 'YEAR', 1));
  //  log('-1 year:    ' + dateAdd(d, 'YEAR', -1));
  //  log('+1 quarter: ' + dateAdd(d, 'QUARTER', 1));
  //  log('+1 month:   ' + dateAdd(d, 'MONTH', 1));
  //  log('+1 week:    ' + dateAdd(d, 'week', 1));
  //  log('+1 day:     ' + dateAdd(d, 'day', 1));
  //  log('+1 hour:    ' + dateAdd(d, 'hour', 1));
  //  log('+1 minute:  ' + dateAdd(d, 'minute', 1));
  //  log('+1 second:  ' + dateAdd(d, 'second', 1));

  if (!(date instanceof Date)) return undefined;

  var ret = new Date(date); //don't change original date

  var checkRollover = function () { if (ret.getDate() != date.getDate()) ret.setDate(0); };

  switch (String(interval).toLowerCase()) {
    case 'year': ret.setFullYear(ret.getFullYear() + units); checkRollover(); break;
    case 'quarter': ret.setMonth(ret.getMonth() + 3 * units); checkRollover(); break;
    case 'month': ret.setMonth(ret.getMonth() + units); checkRollover(); break;
    case 'week': ret.setDate(ret.getDate() + 7 * units); break;
    case 'day': ret.setDate(ret.getDate() + units); break;
    case 'hour': ret.setTime(ret.getTime() + units * 3600000); break;
    case 'minute': ret.setTime(ret.getTime() + units * 60000); break;
    case 'second': ret.setTime(ret.getTime() + units * 1000); break;
    default: ret = undefined; break;
  }
  return ret;
}

export const filterDesc25 = (desc) => {
  if (!desc.trim()) return "Clique para digitar endereço";
  if (desc.length < 25) return desc;
  return `${desc.substring(0, 22)}...`
};

export const getImage = (uri) => {
  if (uri) return { uri };
  return logo;
};

export async function loadInitialPosition() {
  const { granted } = await requestPermissionsAsync();

  if (granted) {
    const { coords } = await getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    const { latitude, longitude } = coords;

    return {
      latitude,
      longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };
  };
};

export const getShortAddress = (addr) => {
  let address = "";

  address += !addr.street ? "" : addr.street;
  address += !addr.number ? "" : ", " + addr.number;
  address += !addr.neighborhood ? "" : " " + addr.neighborhood;
  address += !addr.city ? "" : " " + addr.city;
  address += !addr.state ? "" : " " + addr.state;
  address += !addr.postalCode ? "" : " " + addr.postalCode;

  return address;
};
