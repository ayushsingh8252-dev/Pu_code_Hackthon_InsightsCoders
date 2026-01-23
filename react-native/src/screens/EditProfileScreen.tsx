import React from 'react';
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
  const navigation = useNavigation();
  const { setIsLoggedIn, setVerificationStatus } = useAuth();

  const handleLogout = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');

    // 🔹 Call backend logout API (optional but good practice)
    if (token) {
      await fetch(
        'https://388dd6d89cf6.ngrok-free.app/api/v1/auth/logout',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    // 🔹 Clear local storage
    await AsyncStorage.clear();

    // 🔹 Reset auth state
    setIsLoggedIn(false);
    setVerificationStatus(null);

    // 🔹 HARD RESET navigation → Login
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

          <Text style={styles.userId}>User ID : 36548-4771-4969-ae4c-3e9f9e5f4ad6</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input label="FIRST NAME" value="John" />
          <Input label="LAST NAME" value="Doe" />
          <Input label="EMAIL ADDRESS" value="johndoe@gmail.com" />
          <Input label="PHONE" value="+1 (555) 000-000" />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            <Text style={styles.logoutText} onPress={handleLogout}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* Reusable Input */
const Input = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      value={value}
      style={styles.input}
      placeholderTextColor="#94a3b8"
    />
  </View>
);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

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

  profileSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
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
  userId: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 10,
  },

  form: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
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
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },

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
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
  },
});
