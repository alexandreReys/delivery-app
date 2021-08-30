import { createStackNavigator } from '@react-navigation/stack';
import React from "react";
import Carrousel from "./components/carrousel";
import Address from "./pages/address/Address";
import Comments from "./pages/comments/Comments";
import Confirmed from "./pages/confirmed/Confirmed";
import CustomerOrder from "./pages/customer-order/CustomerOrder";
import CustomerOrders from "./pages/customer-orders/CustomerOrders";
import Login from "./pages/login/Login";
import Main from "./pages/main/Main";
import NewAccount from "./pages/new-account/NewAccount";
import Payment from "./pages/payment/Payment";
import Search from "./pages/search/Search";
import SeeAll from "./pages/see-all/SeeAll";
import SelectedItem from "./pages/selected-item/SelectedItem";
import ShoppingCart from "./pages/shopping-cart/ShoppingCart";
import ShoppingList from "./pages/shopping-list/ShoppingList";


const Stack = createStackNavigator();

function Routes() {
  return (
      <Stack.Navigator
          initialRouteName="ShoppingList"
          screenOptions={{ gestureEnabled: false }}
      >
          <Stack.Screen
              name="ShoppingList"
              component={ShoppingList}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="SelectedItem"
              component={SelectedItem}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="ShoppingCart"
              component={ShoppingCart}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Payment"
              component={Payment}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="NewAccount"
              component={NewAccount}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Confirmed"
              component={Confirmed}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Address"
              component={Address}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="CustomerOrders"
              component={CustomerOrders}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="CustomerOrder"
              component={CustomerOrder}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="SeeAll"
              component={SeeAll}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Search"
              component={Search}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Main"
              component={Main}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Comments"
              component={Comments}
              options={{ headerShown: false }}
          />
          <Stack.Screen
              name="Carrousel"
              component={Carrousel}
              options={{ headerShown: false }}
          />

      </Stack.Navigator>
  );
};

export default Routes;
