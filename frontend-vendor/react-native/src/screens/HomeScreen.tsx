import React, { useState, useEffect, useCallback } from 'react';
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
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Constants
const API_BASE_URL = 'https://2a6717c6fa2a.ngrok-free.app/api/v1';
const CATEGORIES_ENDPOINT = `${API_BASE_URL}/vendor/categories`;
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/vendor/products`;

export default function HomeScreen() {
  const navigation = useNavigation();

  // UI State
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  
  // Data State
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Form State
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // TODO: Replace with actual API call
        const firstName = await AsyncStorage.getItem('userFirstName') || 'Kirtan';
        const lastName = await AsyncStorage.getItem('userLastName') || 'Vyas';
        setUser({ firstName, lastName });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  const initials = ((user?.firstName?.[0] || '') + (user?.lastName?.[0] || '')).toUpperCase();

  // Fetch categories with product counts
  const fetchCategories = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in. Please log in again.');
        return;
      }

      // Fetch categories
      const categoriesResponse = await fetch(
        `${CATEGORIES_ENDPOINT}?page=0&size=100`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories');
      }

      const categoriesData = await categoriesResponse.json();

      if (!Array.isArray(categoriesData.content)) {
        setCategories([]);
        return;
      }

      // Fetch product counts for each category in parallel
      const categoriesWithCounts = await Promise.all(
        categoriesData.content.map(async (category) => {
          try {
            const productsResponse = await fetch(
              `${PRODUCTS_ENDPOINT}?categoryId=${category.categoryId}&page=0&size=1`,
              {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (productsResponse.ok) {
              const productsData = await productsResponse.json();
              return {
                id: category.categoryId,
                name: category.name,
                description: category.description,
                count: productsData.totalElements || 0,
                icon: getCategoryIcon(category.name),
                bg: getCategoryColor(category.name),
              };
            }

            // If products fetch fails, default to 0
            return {
              id: category.categoryId,
              name: category.name,
              description: category.description,
              count: 0,
              icon: getCategoryIcon(category.name),
              bg: getCategoryColor(category.name),
            };
          } catch (error) {
            console.error(`Error fetching products for category ${category.categoryId}:`, error);
            return {
              id: category.categoryId,
              name: category.name,
              description: category.description,
              count: 0,
              icon: getCategoryIcon(category.name),
              bg: getCategoryColor(category.name),
            };
          }
        })
      );

      setCategories(categoriesWithCounts);
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Load categories on mount and when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCategories();
    }, [fetchCategories])
  );

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    fetchCategories(true);
  }, [fetchCategories]);

  // Save new category
  const saveCategory = async () => {
    const trimmedName = categoryName.trim();
    const trimmedDescription = categoryDescription.trim();

    if (!trimmedName || !trimmedDescription) {
      Alert.alert('Validation Error', 'Please fill in both name and description');
      return;
    }

    setIsSaving(true);

    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        Alert.alert('Error', 'You are not logged in. Please log in again.');
        return;
      }

      const response = await fetch(CATEGORIES_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: trimmedName,
          description: trimmedDescription,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Category created successfully!');
        
        // Reset form
        setCategoryName('');
        setCategoryDescription('');
        setShowCreateCategory(false);

        // Refresh categories list
        fetchCategories();
      } else {
        Alert.alert('Error', data.message || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Close modal
  const closeModal = () => {
    if (!isSaving) {
      setCategoryName('');
      setCategoryDescription('');
      setShowCreateCategory(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={theme.icon}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <View style={styles.profileRow}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => navigation.navigate('UserAccount')}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }}>
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
                onPress={() => setIsDarkMode(prev => !prev)}
                style={{ marginRight: 14 }}
              >
                <Ionicons
                  name={isDarkMode ? 'sunny-outline' : 'moon-outline'}
                  size={22}
                  color={theme.icon}
                />
              </TouchableOpacity>

              {/* Notification Bell */}
              <TouchableOpacity 
                style={styles.bellBtn}
                onPress={() => navigation.navigate('Notifications')}
              >
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

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Your Categories
          </Text>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#22c55e" />
              <Text style={[styles.loadingText, { color: theme.subText }]}>
                Loading categories...
              </Text>
            </View>
          ) : categories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={[styles.emptyTitle, { color: theme.text }]}>
                No Categories Yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: theme.subText }]}>
                Create your first category to get started
              </Text>
            </View>
          ) : (
            categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, { backgroundColor: theme.card }]}
                onPress={() =>
                  navigation.navigate('CategoryProducts', {
                    categoryId: cat.id,
                    categoryName: cat.name,
                  })
                }
                activeOpacity={0.7}
              >
                <View style={[styles.iconBox, { backgroundColor: cat.bg }]}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={[styles.categoryName, { color: theme.text }]}>
                    {cat.name}
                  </Text>
                  <Text style={{ color: theme.subText, fontSize: 12 }}>
                    {cat.count} {cat.count === 1 ? 'Product' : 'Products'}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Create Category Button */}
      <TouchableOpacity
        style={styles.createCategoryBtn}
        onPress={() => setShowCreateCategory(true)}
        activeOpacity={0.9}
      >
        <Ionicons name="add" size={22} color="#fff" />
        <Text style={styles.createCategoryText}>Create New Category</Text>
      </TouchableOpacity>

      {/* Create Category Modal */}
      <Modal
        transparent
        animationType="slide"
        visible={showCreateCategory}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, justifyContent: 'flex-end' }}
          >
            <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
              <View style={styles.dragBar} />

              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>
                  Create New Category
                </Text>
                <TouchableOpacity 
                  onPress={closeModal}
                  disabled={isSaving}
                >
                  <Ionicons 
                    name="close" 
                    size={22} 
                    color={isSaving ? '#94a3b8' : theme.icon} 
                  />
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: theme.text }]}>
                Category Name
              </Text>
              <TextInput
                placeholder="e.g. Fresh Vegetables"
                placeholderTextColor="#94a3b8"
                style={[styles.input, { 
                  backgroundColor: theme.inputBg,
                  color: theme.text 
                }]}
                value={categoryName}
                onChangeText={setCategoryName}
                editable={!isSaving}
                maxLength={50}
              />

              <Text style={[styles.label, { color: theme.text }]}>
                Category Description
              </Text>
              <TextInput
                placeholder="Briefly describe the types of items in this category..."
                placeholderTextColor="#94a3b8"
                style={[styles.input, styles.textArea, { 
                  backgroundColor: theme.inputBg,
                  color: theme.text 
                }]}
                multiline
                value={categoryDescription}
                onChangeText={setCategoryDescription}
                editable={!isSaving}
                maxLength={200}
              />

              <TouchableOpacity 
                style={[
                  styles.saveBtn,
                  isSaving && styles.saveBtnDisabled
                ]} 
                onPress={saveCategory}
                disabled={isSaving}
                activeOpacity={0.8}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveText}>Save Category ✓</Text>
                )}
              </TouchableOpacity>

              <Text style={[styles.helperText, { color: theme.subText }]}>
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

// Helper Functions
function getCategoryIcon(categoryName) {
  const name = categoryName.toLowerCase();
  if (name.includes('burger') || name.includes('food')) return '🍔';
  if (name.includes('beverage') || name.includes('drink')) return '🥤';
  if (name.includes('dessert') || name.includes('sweet')) return '🍰';
  if (name.includes('vegan') || name.includes('vegetable') || name.includes('salad')) return '🥗';
  if (name.includes('pizza')) return '🍕';
  if (name.includes('fruit')) return '🍎';
  return '📦';
}

function getCategoryColor(categoryName) {
  const name = categoryName.toLowerCase();
  if (name.includes('burger') || name.includes('food')) return '#fff7ed';
  if (name.includes('beverage') || name.includes('drink')) return '#eff6ff';
  if (name.includes('dessert') || name.includes('sweet')) return '#fdf2f8';
  if (name.includes('vegan') || name.includes('vegetable')) return '#ecfdf5';
  return '#f0f0f0';
}

// Themes
const lightTheme = {
  bg: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  subText: '#64748b',
  icon: '#0f172a',
  inputBg: '#f8fafc',
};

const darkTheme = {
  bg: '#0f172a',
  card: '#1e293b',
  text: '#f8fafc',
  subText: '#94a3b8',
  icon: '#f8fafc',
  inputBg: '#0f172a',
};

// Styles
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
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  vendorName: { fontSize: 16, fontWeight: '700' },
  iconGroup: { flexDirection: 'row', alignItems: 'center' },
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: { marginTop: 12, fontSize: 14 },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  categoryName: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
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
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createCategoryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
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
  modalTitle: { fontSize: 18, fontWeight: '700' },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    marginBottom: 6, 
    marginTop: 12 
  },
  input: { 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: { 
    height: 90,
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 48,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  helperText: {
    marginTop: 12,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});