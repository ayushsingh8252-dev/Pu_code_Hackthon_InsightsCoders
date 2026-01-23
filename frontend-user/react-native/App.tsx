import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

function RootNavigator() {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AppStack /> : <AuthStack />;
}

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
