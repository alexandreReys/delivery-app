import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import ShoppingList from "./pages/shopping-list/ShoppingList";
import SelectedItem from "./pages/selected-item/SelectedItem";
import ShoppingCart from "./pages/shopping-cart/ShoppingCart";
import Payment from "./pages/payment/Payment";
import Confirmed from "./pages/confirmed/Confirmed";
import Address from "./pages/address/Address";
import Customer from "./pages/customer/Customer";
import SeeAll from "./pages/see-all/SeeAll";
import Search from "./pages/search/Search";
import Main from "./pages/main/Main";
import Comments from "./pages/comments/Comments";


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
      Confirmed: {
        screen: Confirmed,
        navigationOptions: { headerShown: false },
      },
      Address: {
        screen: Address,
        navigationOptions: { headerShown: false },
      },
      Customer: {
        screen: Customer,
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
    },
  )
);

export default Routes;
