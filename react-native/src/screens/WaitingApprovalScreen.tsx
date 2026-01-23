import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = 'https://388dd6d89cf6.ngrok-free.app/api/v1/users';

export default function WaitingApprovalScreen({ navigation }: any) {
  useEffect(() => {
    const checkApproval = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const userId = await AsyncStorage.getItem('userId');

        if (!token || !userId) return;

        const res = await fetch(`${API_BASE}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const text = await res.text();
          console.log('Approval check error response:', text);
          return;
        }

        const userData = await res.json();

        // Check if user has vendor role or is enabled
        const roles = userData.roles?.map((r: any) => r.roleName) || [];
        const isApproved = roles.includes('ROLE_VENDOR') || userData.enabled;

        if (isApproved) {
          await AsyncStorage.setItem('verificationStatus', 'APPROVED');
        }
      } catch (err) {
        console.log('Approval check error', err);
      }
    };

    const interval = setInterval(checkApproval, 5000); // check every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Ionicons name="warning-outline" size={110} color="#facc15" />
      <Text style={styles.title}>Approval Pending</Text>
      <Text style={styles.subtitle}>
        Your account is under verification
      </Text>
      <Text style={styles.description}>
        Once admin approves, you will be redirected to login.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});
