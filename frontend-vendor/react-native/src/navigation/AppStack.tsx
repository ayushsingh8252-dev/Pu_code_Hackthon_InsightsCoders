import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import VendorDetailsScreen from '../screens/VendorDetailsScreen';
import OrderFlowScreen from '../screens/OrderFlowScreen';
import UserAccountScreen from '../screens/UserAccountScreen';
import PopularDetailsScreen from '../screens/PopularDetailsScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import AddProductScreen from '../screens/AddProductScreen';
import AddProductImageScreen from '../screens/AddProductImageScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import InsightsScreen from '../screens/InsightsScreen';
import OrdersScreen from '../screens/OrdersScreen';

export type AppStackParamList = {
  Home: undefined;
  VendorDetails: { vendorId: number };
  OrderFlow: { vendorId: number; vendorName: string };
  UserAccount: undefined;
  PopularDetails: undefined;

  CategoryProducts: {
    categoryId: number;
    categoryName: string;
  };
  AddProduct: {
  categoryId: number;
  categoryName: string;
};

};


const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />
      <Stack.Screen name="OrderFlow" component={OrderFlowScreen} />
      <Stack.Screen name="UserAccount" component={UserAccountScreen} />
      <Stack.Screen name="PopularDetails" component={PopularDetailsScreen} />
      <Stack.Screen
        name="CategoryProducts"
        component={CategoryProductsScreen}
      />
      <Stack.Screen
  name="AddProduct"
  component={AddProductScreen}
/>
      <Stack.Screen name="AddProductImage" component={AddProductImageScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Insights" component={InsightsScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
    </Stack.Navigator>
  );
}
