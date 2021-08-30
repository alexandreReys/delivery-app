import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import ShoppingList from "./pages/shopping-list/ShoppingList";
import SelectedItem from "./pages/selected-item/SelectedItem";
import ShoppingCart from "./pages/shopping-cart/ShoppingCart";
import Login from "./pages/login/Login";
import NewAccount from "./pages/new-account/NewAccount";
import Payment from "./pages/payment/Payment";
import Confirmed from "./pages/confirmed/Confirmed";
import Address from "./pages/address/Address";
import CustomerOrders from "./pages/customer-orders/CustomerOrders";
import CustomerOrder from "./pages/customer-order/CustomerOrder";
import SeeAll from "./pages/see-all/SeeAll";
import Search from "./pages/search/Search";
import Main from "./pages/main/Main";
import Comments from "./pages/comments/Comments";
import Carrousel from "./components/carrousel";

const Routes = createAppContainer(
  createStackNavigator(
    {
      ShoppingList: {
        screen: ShoppingList,
        navigationOptions: { headerShown: false },
      },
      SelectedItem: {
        screen: SelectedItem,
        navigationOptions: { headerShown: false },
      },
      ShoppingCart: {
        screen: ShoppingCart,
        navigationOptions: { headerShown: false },
      },
      Payment: {
        screen: Payment,
        navigationOptions: { headerShown: false },
      },
      Login: {
        screen: Login,
        navigationOptions: { headerShown: false },
      },
      NewAccount: {
        screen: NewAccount,
        navigationOptions: { headerShown: false },
      },
      Confirmed: {
        screen: Confirmed,
        navigationOptions: { headerShown: false },
      },
      Address: {
        screen: Address,
        navigationOptions: { headerShown: false },
      },
      CustomerOrders: {
        screen: CustomerOrders,
        navigationOptions: { headerShown: false },
      },
      CustomerOrder: {
        screen: CustomerOrder,
        navigationOptions: { headerShown: false },
      },
      SeeAll: {
        screen: SeeAll,
        navigationOptions: { headerShown: false },
      },
      Search: {
        screen: Search,
        navigationOptions: { headerShown: false },
      },
      Main: {
        screen: Main,
        navigationOptions: { headerShown: false },
      },
      Comments: {
        screen: Comments,
        navigationOptions: { headerShown: false },
      },
      Carrousel: {
        screen: Carrousel,
        navigationOptions: { headerShown: false },
      },
    },
  )
);

export default Routes;
