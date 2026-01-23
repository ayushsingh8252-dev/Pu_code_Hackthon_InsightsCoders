import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import ForgetPassScreen from '../screens/auth/ForgetPassScreen';
import ResetPassword from '../screens/auth/ResetPassword';

export type AuthStackParamList = {
  Login: undefined;
  Otp: { phoneOrEmail: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
       <Stack.Screen name="Signup" component={SignupScreen} />
       <Stack.Screen name="ForgotPassword" component={ForgetPassScreen}/>
       <Stack.Screen name="ResetPassword" component={ResetPassword}/>
      <Stack.Screen name="Otp" component={OtpScreen} />
    </Stack.Navigator>
  );
}
