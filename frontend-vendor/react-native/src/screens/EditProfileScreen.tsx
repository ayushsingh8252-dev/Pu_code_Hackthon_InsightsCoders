import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import Alert from 'react-native/Libraries/Alert/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const { setIsLoggedIn, setVerificationStatus } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // ✅ Load user data from AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      try {
        const fName = await AsyncStorage.getItem('firstName');
        const lName = await AsyncStorage.getItem('lastName');
        const emailStored = await AsyncStorage.getItem('email');
        const phoneStored = await AsyncStorage.getItem('phone');

        setFirstName(fName || '');
        setLastName(lName || '');
        setEmail(emailStored || '');
        setPhone(phoneStored || '');
      } catch (err) {
        console.log('Load profile error:', err);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');

      if (token) {
        await fetch(
          'https://2a6717c6fa2a.ngrok-free.app/api/v1/auth/logout',
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      await AsyncStorage.clear();
      setIsLoggedIn(false);
      setVerificationStatus(null);

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Logout failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileSection}>
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="pencil" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input label="FIRST NAME" value={firstName} onChange={setFirstName} />
          <Input label="LAST NAME" value={lastName} onChange={setLastName} />
          <Input label="EMAIL ADDRESS" value={email} onChange={setEmail} />
          <Input label="PHONE" value={phone} onChange={setPhone} />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* Reusable Input */
const Input = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      style={styles.input}
      placeholder={label}
      placeholderTextColor="#94a3b8"
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  profileSection: { alignItems: 'center', marginVertical: 20 },
  imageWrapper: { position: 'relative' },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  editIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#22c55e',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  form: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  inputGroup: { marginBottom: 14 },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#111827',
  },

  saveButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: { fontSize: 15, fontWeight: '700', color: '#fff' },

  logoutButton: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
});
