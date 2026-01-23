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
  const API_BASE = 'https://388dd6d89cf6.ngrok-free.app/api/v1/auth';

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
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const rawText = await response.text();
console.log('RAW LOGIN RESPONSE:', rawText);

let data;
try {
  data = JSON.parse(rawText);
} catch (e) {
  Alert.alert('Server Error', rawText);
  return;
}
    console.log('Login response:', response.status, data);

    if (!response.ok || data.success !== true) {
      Alert.alert('Error', data.message || 'Invalid email or password');
      return;
    }

    // ✅ Save tokens and set auth state
    await AsyncStorage.multiSet([
      ['accessToken', data.data.accessToken],
      ['refreshToken', data.data.refreshToken],
      ['loginTime', Date.now().toString()],
      ['verificationStatus', 'APPROVED'],
      ['userId', data.data.user.id],
       ['firstName', data.data.user.firstName],
       ['lastName', data.data.user.lastName],
    ]);

    setVerificationStatus('APPROVED');
    setIsLoggedIn(true);

    // ✅ Navigate
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });

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

      {/* ---------------- ADD LINKS ---------------- */}
      <View style={styles.linkContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Signup')}
        >
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
  linkContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText: {
    color: '#16a34a',
    fontWeight: '600',
  },
});
