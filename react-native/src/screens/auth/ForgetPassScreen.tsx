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

export default function ForgetPassScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://388dd6d89cf6.ngrok-free.app/api/v1/auth';

  const handleSendOtp = async () => {
  if (!email) {
    Alert.alert('Error', 'Please enter your email');
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(`${API_BASE}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const text = await response.text();

    if (response.ok) {
      Alert.alert('Success','OTP sent successfully');
      navigation.navigate('ResetPassword', { email });
    } else {
      Alert.alert('Error', text || 'Failed to send OTP');
    }
  } catch (error) {
    console.log(error);
    Alert.alert('Error', 'Something went wrong. Try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>VendorHub</Text>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>Enter your registered email to receive OTP</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSendOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  appTitle: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#16a34a' },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', marginBottom: 20, color: 'gray' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
