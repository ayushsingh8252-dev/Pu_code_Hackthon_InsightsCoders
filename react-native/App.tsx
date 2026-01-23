import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';

import AuthStack from './src/navigation/AuthStack';
import AppStack from './src/navigation/AppStack';
import RegisterStack from './src/navigation/RegisterStack';
import WaitingStack from './src/navigation/WaitingStack';

import { AuthProvider, useAuth } from './src/context/AuthContext';

function RootNavigator() {
  const { isLoggedIn, verificationStatus } = useAuth();

  if (!isLoggedIn) return <AuthStack />;

  if (verificationStatus === null) return <RegisterStack />;

  if (verificationStatus === 'PENDING') return <WaitingStack />;

  return <AppStack />; // APPROVED
}


export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
