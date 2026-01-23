import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }: any) {
  const { setVerificationStatus, setIsLoggedIn } = useAuth();

  const [businessName, setBusinessName] = useState('');
  const [vendorType, setVendorType] = useState<'FIXED' | 'MOBILE'>('FIXED');
  const [addressLine, setAddressLine] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://388dd6d89cf6.ngrok-free.app/api/v1/vendor';

  // Registration handler
  const handleRegister = async () => {
    if (
      !businessName ||
      !addressLine ||
      !area ||
      !city ||
      !state ||
      !country ||
      !pincode ||
      !latitude ||
      !longitude
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Session expired', 'Please login again');
        setIsLoggedIn(false); // redirect to login
        return;
      }

      const payload = {
        businessName,
        vendorType,
        location: {
          addressLine,
          area,
          city,
          state,
          country,
          pincode,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      };

      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Error', data.message || 'Registration failed');
        return;
      }

      Alert.alert('Success', 'Registration submitted for approval');
      // Optionally, you can set verificationStatus here
      await AsyncStorage.setItem('verificationStatus', 'PENDING');
       setVerificationStatus('PENDING');
        navigation.reset({
  index: 0,
  routes: [{ name: 'WaitingApproval' }],
});

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Back button handler
  const handleBackToLogin = async () => {
    // Clear session
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('verificationStatus');

    // Reset auth context
    setVerificationStatus(null);
    setIsLoggedIn(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
        <Text style={styles.backButtonText}>← Back to Login</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Vendor Registration</Text>

      <TextInput
        placeholder="Business Name"
        value={businessName}
        onChangeText={setBusinessName}
        style={styles.input}
      />

      <View style={styles.vendorTypeRow}>
        <TouchableOpacity
          style={[
            styles.vendorTypeBtn,
            vendorType === 'FIXED' && styles.vendorTypeSelected,
          ]}
          onPress={() => setVendorType('FIXED')}
        >
          <Text style={styles.vendorTypeText}>FIXED</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.vendorTypeBtn,
            vendorType === 'MOBILE' && styles.vendorTypeSelected,
          ]}
          onPress={() => setVendorType('MOBILE')}
        >
          <Text style={styles.vendorTypeText}>MOBILE</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Address Line"
        value={addressLine}
        onChangeText={setAddressLine}
        style={styles.input}
      />
      <TextInput
        placeholder="Area / Locality"
        value={area}
        onChangeText={setArea}
        style={styles.input}
      />
      <TextInput
        placeholder="City"
        value={city}
        onChangeText={setCity}
        style={styles.input}
      />
      <TextInput
        placeholder="State"
        value={state}
        onChangeText={setState}
        style={styles.input}
      />
      <TextInput
        placeholder="Country"
        value={country}
        onChangeText={setCountry}
        style={styles.input}
      />
      <TextInput
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  backButton: { marginBottom: 20 },
  backButtonText: { color: '#16a34a', fontWeight: 'bold', fontSize: 16 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#16a34a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#16a34a',
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  vendorTypeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  vendorTypeBtn: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  vendorTypeSelected: { backgroundColor: '#16a34a' },
  vendorTypeText: { color: '#000', fontWeight: '600' },
});
