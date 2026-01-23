import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigation } from '@react-navigation/native';

/* Initial Dummy Categories */
const initialCategories = [
  { id: 1, name: 'Burgers & Sides', count: 12, icon: '🍔', bg: '#fff7ed' },
  { id: 2, name: 'Beverages', count: 8, icon: '🥤', bg: '#eff6ff' },
  { id: 3, name: 'Desserts', count: 5, icon: '🍰', bg: '#fdf2f8' },
  { id: 4, name: 'Vegan Options', count: 14, icon: '🥗', bg: '#ecfdf5' },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState(initialCategories);

  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  /* Fetch user info */
  useEffect(() => {
    const fetchUser = async () => {
      const firstName = 'Kirtan';
      const lastName = 'Vyas';
      setUser({ firstName, lastName });
    };
    fetchUser();
  }, []);

  const initials =
    ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase();

  /* Save Category API */
  const saveCategory = async () => {
    if (!categoryName.trim() || !categoryDescription.trim()) {
      alert('Please fill both name and description');
      return;
    }

    setSaving(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        alert('You are not logged in!');
        return;
      }

      const response = await fetch(
        'https://db73420c7ac3.ngrok-free.app/api/v1/vendor/categories',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // ✅ include token
          },
          body: JSON.stringify({
            name: categoryName,
            description: categoryDescription,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Category created successfully!');
        setShowCreateCategory(false);
        setCategoryName('');
        setCategoryDescription('');

        // Update local categories list for immediate UI
        setCategories(prev => [
          ...prev,
          {
            id: Math.random(),
            name: categoryName,
            count: 0,
            icon: '📦',
            bg: '#f0f0f0',
          },
        ]);
      } else {
        alert(data.message || 'Failed to create category');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong!');
    } finally {
      setSaving(false);
    }
  };

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return;

      // 1️⃣ Fetch categories
      const catRes = await fetch(
        'https://388dd6d89cf6.ngrok-free.app/api/v1/vendor/categories?page=0&size=10',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const catData = await catRes.json();
      if (!catRes.ok || !Array.isArray(catData.content)) return;

      // 2️⃣ Fetch products for each category and count via .length
      const mappedCategories = await Promise.all(
        catData.content.map(async cat => {
          const prodRes = await fetch(
            `https://388dd6d89cf6.ngrok-free.app/api/v1/vendor/products?categoryId=${cat.categoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const prodData = await prodRes.json();

          return {
            id: cat.categoryId,
            name: cat.name,
            count: Array.isArray(prodData.content)
              ? prodData.content.length // ✅ COUNT USING .length
              : 0,
            icon: '📦',
            bg: '#f0f0f0',
          };
        })
      );

      setCategories(mappedCategories);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  fetchCategories();
}, []);


  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <View style={styles.profileRow}>
            <TouchableOpacity
  style={styles.avatar}
  onPress={() => navigation.navigate('UserAccount')}
>
  <Text style={styles.avatarText}>{initials}</Text>
</TouchableOpacity>


            <View>
              <Text style={[styles.vendorName, { color: theme.text }]}>
                {user?.firstName} {user?.lastName}
              </Text>
              <Text style={{ color: theme.subText, fontSize: 12 }}>
                Vendor Partner
              </Text>
            </View>

            <View style={styles.iconGroup}>
              {/* Dark Mode Toggle */}
              <TouchableOpacity
                onPress={() => setIsDarkMode(p => !p)}
                style={{ marginRight: 14 }}
              >
                <Ionicons
                  name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                  size={22}
                  color={theme.icon}
                />
              </TouchableOpacity>

              {/* Notification Bell */}
              <TouchableOpacity style={styles.bellBtn}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={theme.icon}
                />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Categories
          </Text>

          {categories.map(cat => (
            <TouchableOpacity
  key={cat.id}
  style={[styles.categoryCard, { backgroundColor: theme.card }]}
  onPress={() =>
    navigation.navigate('CategoryProducts', {
      categoryId: cat.id,
      categoryName: cat.name,
    })
  }
>
              <View style={[styles.iconBox, { backgroundColor: cat.bg }]}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={[styles.categoryName, { color: theme.text }]}>
                  {cat.name}
                </Text>
                <Text style={{ color: theme.subText, fontSize: 12 }}>
                  {cat.count} Products
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Create Category Button */}
      <TouchableOpacity
        style={styles.createCategoryBtn}
        onPress={() => setShowCreateCategory(true)}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.createCategoryText}>Create New Category</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showCreateCategory}
        onRequestClose={() => setShowCreateCategory(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.modalContainer}>
              <View style={styles.dragBar} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Category</Text>
                <TouchableOpacity onPress={() => setShowCreateCategory(false)}>
                  <Ionicons name="close" size={22} color="#64748b" />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Category Name</Text>
              <TextInput
                placeholder="e.g. Fresh Vegetables"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
              />

              <Text style={styles.label}>Category Description</Text>
              <TextInput
                placeholder="Briefly describe the types of items in this category..."
                placeholderTextColor="#94a3b8"
                style={[styles.input, { height: 90 }]}
                multiline
                value={categoryDescription}
                onChangeText={setCategoryDescription}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={saveCategory}>
                <Text style={styles.saveText}>
                  {saving ? 'Saving...' : 'Save Category ✓'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.helperText}>
                After saving, you can start adding products to this category immediately from the inventory.
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <BottomNavigation currentRoute="Home" />
    </View>
  );
}

/* Themes */
const lightTheme = {
  bg: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  subText: '#64748b',
  icon: '#0f172a',
};

const darkTheme = {
  bg: '#020617',
  card: '#020617',
  text: '#f8fafc',
  subText: '#94a3b8',
  icon: '#f8fafc',
};

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: { padding: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  avatarText: { color: '#fff', fontWeight: '700' },
  vendorName: { fontSize: 16, fontWeight: '700' },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    gap: 14,
  },

  bellBtn: { position: 'relative' },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },

  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },

  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  categoryIcon: { fontSize: 22 },
  categoryName: { fontSize: 15, fontWeight: '700' },

  createCategoryBtn: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },

  createCategoryText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },

  dragBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, fontSize: 14, color: '#0f172a' },

  saveBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  helperText: {
    marginTop: 12,
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
});
