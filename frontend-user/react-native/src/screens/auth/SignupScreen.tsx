import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function SignupScreen({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [image, setImage] = useState(''); // STRING as backend expects

  const handleSignup = async () => {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !phoneNumber ||
      !image
    ) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    try {
      const response = await fetch(
        'https://2a6717c6fa2a.ngrok-free.app/api/v1/auth/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            phoneNumber,
            image, // STRING (URL / filename / base64)
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Signup Failed', data.message || 'Something went wrong');
        return;
      }

      Alert.alert('Success', 'OTP sent to your email');
      navigation.navigate('Otp', { email });
    } catch (error) {
      Alert.alert('Error', 'Unable to signup. Try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>VendorHub</Text>
      <Text style={styles.subtitle}>Create Account</Text>

      <TextInput
        placeholder="First Name *"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />

      <TextInput
        placeholder="Last Name *"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email Address *"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password *"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        placeholder="Phone Number *"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        style={styles.input}
        keyboardType="phone-pad"
        maxLength={10}
      />

      {/* IMAGE AS STRING */}
      <TextInput
        placeholder="Image URL / Image String *"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Register & Send OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Already have an account?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#16a34a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 15,
    color: '#16a34a',
  },
});
