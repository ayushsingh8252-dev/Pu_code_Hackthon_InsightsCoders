import React,{ useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from 'react-native/Libraries/Alert/Alert';
import { useAuth } from '../context/AuthContext';


export default function UserAccountScreen() {
  const navigation = useNavigation<any>();
  const [vendor, setVendor] = useState<any>(null);
const [loading, setLoading] = useState(true);
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


useEffect(() => {
  const fetchVendor = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      const res = await fetch(
        'https://388dd6d89cf6.ngrok-free.app/api/v1/vendor/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.log('Vendor API error:', text);
        return;
      }

      const data = await res.json();
      setVendor(data);
    } catch (err) {
      console.error('Fetch vendor error:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchVendor();
}, []);

  const SettingItem = ({
    icon,
    label,
    onPress,
  }: {
    icon: string;
    label: string;
    onPress?: () => void;
  }) => {
    return (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={styles.itemLeft}>
          <Ionicons name={icon} size={20} color="#22c55e" />
          <Text style={styles.itemText}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Ionicons name="pencil" size={20} color="#22c55e" />
        </TouchableOpacity>
      </View>

      {/* Profile */}
      {/* Profile */}
<View style={styles.profile}>
  <TouchableOpacity
    style={styles.avatarWrapper}
    onPress={() => navigation.navigate('EditProfile')}
    activeOpacity={0.8}
  >
    <Image
      source={{
        uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=200',
      }}
      style={styles.avatar}
    />

    {/* Pencil Icon */}
    <View style={styles.editIcon}>
      <Ionicons name="pencil" size={14} color="#fff" />
    </View>
  </TouchableOpacity>

  <Text style={styles.name}>
  {vendor?.firstName} {vendor?.lastName}
</Text>

<Text style={styles.status}>
  {vendor?.role || 'Vendor'}
</Text>


  <View style={styles.onlineRow}>
    <View style={styles.onlineDot} />
    <Text style={styles.onlineText}>Online</Text>
  </View>
</View>


      {/* Settings */}
      <View style={styles.list}>
        <SettingItem
          icon="location-outline"
          label="Saved Locations"
          onPress={() => navigation.navigate('SavedLocations')}
        />
        <SettingItem
          icon="notifications-outline"
          label="Notification Preferences"
        />
        <SettingItem
          icon="receipt-outline"
          label="Order History"
        />
        <SettingItem
          icon="help-circle-outline"
          label="Help & Support"
        />
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

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

  profile: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  status: {
    fontSize: 13,
    color: '#22c55e',
    marginTop: 2,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 12,
    color: '#64748b',
  },

  list: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },

  logout: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ef4444',
  },
  avatarWrapper: {
  position: 'relative',
},

editIcon: {
  position: 'absolute',
  bottom: 2,
  right: 2,
  backgroundColor: '#22c55e',
  width: 26,
  height: 26,
  borderRadius: 13,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderColor: '#fff',
},
});
