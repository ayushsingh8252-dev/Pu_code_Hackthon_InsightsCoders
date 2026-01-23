import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface BottomNavigationProps {
  currentRoute?: string;
}

export default function BottomNavigation({ currentRoute }: BottomNavigationProps) {
  const navigation = useNavigation<NavigationProp>();
  const routeName = useNavigationState(state => 
    state?.routes[state.index]?.name
  ) || currentRoute || 'Home';

  const navItems = [
    { route: 'Home', icon: '🏠', label: 'Home' },
    { route: 'Orders', icon: '📦', label: 'Orders' },
    { route: 'UserAccount', icon: '👤', label: 'Profile' },
  ];

  const handlePress = (route: string) => {
    if (route === 'Orders') {
      // Navigate to UserAccount and set tab to orders
      navigation.navigate('UserAccount');
    } else if (route === 'UserAccount' || route === 'Home') {
      navigation.navigate(route as 'Home' | 'UserAccount');
    }
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = routeName === item.route || 
          (item.route === 'Orders' && routeName === 'UserAccount');
        
        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() => handlePress(item.route)}
          >
            <Text style={[styles.icon, isActive && styles.iconActive]}>
              {item.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 10,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  labelActive: {
    color: '#16a34a',
  },
});
