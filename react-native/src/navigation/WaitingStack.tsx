import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WaitingApprovalScreen from '../screens/WaitingApprovalScreen';

const Stack = createNativeStackNavigator();

export default function WaitingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="WaitingApproval"
        component={WaitingApprovalScreen}
      />
    </Stack.Navigator>
  );
}
