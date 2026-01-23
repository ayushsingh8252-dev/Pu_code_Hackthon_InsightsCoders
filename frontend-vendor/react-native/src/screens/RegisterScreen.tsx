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
  PermissionsAndroid,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location'
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
  const [locationLoading, setLocationLoading] = useState(false);

  const API_BASE = 'https://2a6717c6fa2a.ngrok-free.app/api/v1/vendor';

  // 🔐 Location Permission
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.log('Permission error:', err);
      return false;
    }
  };

const fetchMyLocation = async () => {
  try {
    setLocationLoading(true);

    // Request permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required');
      setLocationLoading(false);
      return;
    }

    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    const { latitude, longitude } = location.coords;
    setLatitude(latitude.toString());
    setLongitude(longitude.toString());

    // Reverse geocoding
     const reverse = await Location.reverseGeocodeAsync({ latitude, longitude });

if (reverse.length > 0) {
  const addr = reverse[0];

  // 🏠 Address Line
  const streetAddress = `${addr.streetNumber || ''} ${addr.street || ''}`.trim();
  setAddressLine(streetAddress);

  // 📍 Area / Locality (FILTER PLUS CODES)
  let resolvedArea = '';

  if (addr.district && !addr.district.includes('+')) {
    resolvedArea = addr.district;
  } else if (addr.subregion && !addr.subregion.includes('+')) {
    resolvedArea = addr.subregion;
  } else if (addr.name && !addr.name.includes('+')) {
    resolvedArea = addr.name;
  }

  setArea(resolvedArea);

  // 🏙 City
  setCity(addr.city || addr.subregion || '');

  // 🗺 State
  setState(addr.region || '');

  // 🌍 Country
  setCountry(addr.country || '');

  // 📮 Pincode
  setPincode(addr.postalCode || '');
}

  } catch (err: any) {
    console.log('Fetch location error:', err);
    Alert.alert('Error', 'Failed to fetch location');
  } finally {
    setLocationLoading(false);
  }
};

  // 📝 Register
  const handleRegister = async () => {
    if (!businessName || !addressLine || !area || !city || !state || !country || !pincode || !latitude || !longitude) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Session expired', 'Please login again');
        setIsLoggedIn(false);
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
      await AsyncStorage.setItem('verificationStatus', 'PENDING');
      setVerificationStatus('PENDING');

      navigation.reset({
        index: 0,
        routes: [{ name: 'WaitingApproval' }],
      });
    } catch (err) {
      console.log('Register error:', err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = async () => {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('verificationStatus');
    setVerificationStatus(null);
    setIsLoggedIn(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
        <Text style={styles.backButtonText}>← Back to Login</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Vendor Registration</Text>

      <TextInput placeholder="Business Name" value={businessName} onChangeText={setBusinessName} style={styles.input} />

      <View style={styles.vendorTypeRow}>
        {['FIXED', 'MOBILE'].map(type => (
          <TouchableOpacity
            key={type}
            style={[styles.vendorTypeBtn, vendorType === type && styles.vendorTypeSelected]}
            onPress={() => setVendorType(type as any)}
          >
            <Text style={styles.vendorTypeText}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2563eb' }]}
        onPress={fetchMyLocation}
        disabled={locationLoading}
      >
        {locationLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>📍 Fetch My Location</Text>}
      </TouchableOpacity>

      <TextInput placeholder="Address Line" value={addressLine} onChangeText={setAddressLine} style={styles.input} />
      <TextInput placeholder="Area / Locality" value={area} onChangeText={setArea} style={styles.input} />
      <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
      <TextInput placeholder="State" value={state} onChangeText={setState} style={styles.input} />
      <TextInput placeholder="Country" value={country} onChangeText={setCountry} style={styles.input} />
      <TextInput placeholder="Pincode" value={pincode} onChangeText={setPincode} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Latitude" value={latitude} editable={false} style={styles.input} />
      <TextInput placeholder="Longitude" value={longitude} editable={false} style={styles.input} />

      <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Submit</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  backButton: { marginBottom: 20 },
  backButtonText: { color: '#16a34a', fontWeight: 'bold', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#16a34a' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#16a34a', padding: 14, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  vendorTypeRow: { flexDirection: 'row', marginBottom: 12 },
  vendorTypeBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginHorizontal: 5, alignItems: 'center' },
  vendorTypeSelected: { backgroundColor: '#16a34a' },
  vendorTypeText: { fontWeight: '600' },
});
