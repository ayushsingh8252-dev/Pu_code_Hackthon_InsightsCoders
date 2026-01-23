import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { setIsLoggedIn, setVerificationStatus } = useAuth();
  const API_BASE = 'https://2a6717c6fa2a.ngrok-free.app/api/v1/auth';

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: email.trim().toLowerCase(),
        password,
      };

      console.log('Sending login request:', payload);

      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Login response:', response.status, data);

      if (!response.ok) {
        // 401 or other errors
        Alert.alert('Error', data.message || 'Invalid email or password');
        return;
      }

      // ✅ Determine vendor verification status
      let verificationStatus: 'APPROVED' | 'PENDING' | null = null;
      if (data.data.vendor) {
        verificationStatus = data.data.vendor.verificationStatus; // APPROVED or PENDING
      }

      // ✅ Save tokens and user info
      await AsyncStorage.multiSet([
        ['accessToken', data.data.accessToken],
        ['refreshToken', data.data.refreshToken],
        ['loginTime', Date.now().toString()],
        ['verificationStatus', verificationStatus || 'PENDING'],
        ['userId', data.data.user.id],
        ['firstName', data.data.user.firstName],
        ['lastName', data.data.user.lastName],
      ]);

      setVerificationStatus(verificationStatus);
      setIsLoggedIn(true);

      // ✅ Navigate based on verification
      if (verificationStatus === 'APPROVED') {
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'Register' }] });
      }

    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Vendor Delivery Partner</Text>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.linkText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  appTitle: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: '#16a34a' },
  title: { fontSize: 22, textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  linkContainer: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' },
  linkText: { color: '#16a34a', fontWeight: '600' },
});
