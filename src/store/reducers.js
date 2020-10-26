import { combineReducers } from "redux";

import defaultReducer from "./reducers/defaultReducer";
import loginReducer from "./reducers/loginReducer";
import orderReducer from "./reducers/orderReducer";
import productReducer from "./reducers/vinhoReducer";
import cartReducer from "./reducers/cartReducer";
import addressReducer from "./reducers/addressReducer";


export default combineReducers({
  defaultState: defaultReducer,
  loginState: loginReducer,
  orderState: orderReducer,
  productState: productReducer,
  cartState: cartReducer,
  addressState: addressReducer,
});
