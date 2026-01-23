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

export default function ResetPassword({ route, navigation }: any) {
  const { email } = route.params; // passed from ForgetPassScreen

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://2a6717c6fa2a.ngrok-free.app/api/v1/auth';

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Error', 'Please enter OTP and new password');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

     const text = await response.text();

if (response.ok) {
  Alert.alert('Success', 'Password reset successfully', [
    { text: 'Login', onPress: () => navigation.replace('Login') },
  ]);
} else {
  Alert.alert('Error', text || 'Failed to reset password');
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
      <Text style={styles.title}>Reset Password</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={email}
        editable={false} // email is readonly
        style={[styles.input, { backgroundColor: '#f0f0f0' }]}
      />

      <Text style={styles.label}>OTP</Text>
      <TextInput
        placeholder="Enter OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        style={styles.input}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        placeholder="Enter new password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  appTitle: { fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginBottom: 5, color: '#16a34a' },
  title: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  label: { marginBottom: 5, fontWeight: '500' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
