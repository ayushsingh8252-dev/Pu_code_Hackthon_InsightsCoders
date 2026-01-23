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

export default function OtpScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://388dd6d89cf6.ngrok-free.app/api/v1/auth';

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Enter valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'OTP verified successfully', [
          {
            text: 'Login',
            onPress: () => navigation.replace('Login'), // or update context if using AuthProvider
          },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Invalid or expired OTP');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      setLoading(true);

      // Call resend OTP API
      const response = await fetch(`${API_BASE}/resend-otp/${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `OTP resent to ${email}`);
      } else {
        Alert.alert('Error', data.message || 'Failed to resend OTP');
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
      <Text style={styles.appTitle}>Vendor Delivery Partner</Text>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>OTP sent to</Text>
      <Text style={styles.email}>{email}</Text>

      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otpCode}
        onChangeText={setOtpCode}
        maxLength={6}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, otpCode.length !== 6 && { opacity: 0.6 }]}
        disabled={otpCode.length !== 6 || loading}
        onPress={handleVerifyOtp}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResendOtp}>
        <Text style={styles.resend}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  appTitle: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#16a34a' },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 10 },
  subtitle: { textAlign: 'center', marginTop: 10, color: 'gray' },
  email: { textAlign: 'center', fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 14, textAlign: 'center', fontSize: 18, letterSpacing: 8, marginBottom: 15 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  resend: { textAlign: 'center', marginTop: 20, color: '#16a34a', fontWeight: 'bold' },
});
