import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function BottomNavigation() {
  const navigation = useNavigation<NavigationProp>();

  const routeName =
    useNavigationState(state => state.routes[state.index]?.name) || 'Home';

  const navItems = [
    { route: 'Home', icon: '🏠', label: 'Home' },
    { route: 'Orders', icon: '📂', label: 'Orders' },
    { route: 'Insights', icon: '❤️', label: 'Insights' },
    { route: 'UserAccount', icon: '⚙️', label: 'Settings' }, // 👈 Settings → UserAccount
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {navItems.map(item => {
          const isActive = routeName === item.route;

          return (
            <TouchableOpacity
              key={item.route}
              style={styles.navItem}
              onPress={() => navigation.navigate(item.route as any)}
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
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#f8fafc',
    paddingBottom: 10,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#94a3b8',
    fontWeight: '600',
  },
  labelActive: {
    color: '#2563eb',
  },
});
