import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const { setIsLoggedIn, setVerificationStatus } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  /* ✅ Load user data */
  useEffect(() => {
    const loadUser = async () => {
      try {
        setFirstName((await AsyncStorage.getItem('firstName')) || '');
        setLastName((await AsyncStorage.getItem('lastName')) || '');
        setEmail((await AsyncStorage.getItem('email')) || '');
        setPhone((await AsyncStorage.getItem('phone')) || '');
      } catch (err) {
        console.log('Load profile error:', err);
      }
    };
    loadUser();
  }, []);

  /* ✅ UPDATE PROFILE */
  const handleSave = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('accessToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Error', 'Unauthorized');
        return;
      }

      // 🔥 BACKEND REQUIRED PAYLOAD
      const payload = {
        user: {
          id: userId, // ✅ REQUIRED (NOT vendor)
        },
        firstName,
        lastName,
        phoneNumber: phone,
      };

      console.log('📤 Updating profile:', payload);

      const res = await fetch(
        `https://2a6717c6fa2a.ngrok-free.app/api/v1/users/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log('✅ Update response:', data);

      if (!res.ok) {
        Alert.alert('Error', data.message || 'Update failed');
        return;
      }

      // ✅ Update local storage
      await AsyncStorage.multiSet([
        ['firstName', firstName],
        ['lastName', lastName],
        ['phone', phone],
      ]);

      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (err) {
      console.log('❌ Update profile error:', err);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* 🚪 Logout */
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
      Alert.alert('Error', 'Logout failed');
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
        {/* Avatar */}
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
          <Input
            label="EMAIL ADDRESS"
            value={email}
            onChange={setEmail}
            editable={false}
          />
          <Input label="PHONE" value={phone} onChange={setPhone} />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
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

/* 🔹 Input Component */
const Input = ({
  label,
  value,
  onChange,
  editable = true,
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  editable?: boolean;
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChange}
      editable={editable}
      style={[
        styles.input,
        !editable && { backgroundColor: '#e5e7eb', color: '#6b7280' },
      ]}
      placeholder={label}
      placeholderTextColor="#94a3b8"
    />
  </View>
);

/* 🎨 Styles */
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
