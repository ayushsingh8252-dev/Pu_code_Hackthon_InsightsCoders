import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import VendorDetailsScreen from '../screens/VendorDetailsScreen';
import OrderFlowScreen from '../screens/OrderFlowScreen';
import UserAccountScreen from '../screens/UserAccountScreen';
import PopularDetailsScreen from '../screens/PopularDetailsScreen';

export type AppStackParamList = {
  Home: undefined;
  VendorDetails: { vendorId: number };
  OrderFlow: { vendorId: number; vendorName: string };
  UserAccount: undefined;
  PopularDetails: undefined;
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
    </Stack.Navigator>
  );
}
