import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddProductScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const { categoryId, categoryName } = route.params;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Updated goNext to call backend API
  const goNext = async () => {
    if (!name || !price || !stock) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('User not authenticated');

      const res = await fetch(
        'https://2a6717c6fa2a.ngrok-free.app/api/v1/vendor/products',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            categoryId,
            name,
            description,
            price: Number(price),
            stock: Number(stock),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Product creation failed');
      }

      const productId = data.productId; // ✅ productId from backend

      // Navigate to image screen with productId
      navigation.navigate('AddProductImage', {
        productId,
        categoryId,
        categoryName,
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView>
        {/* CATEGORY */}
        <View style={styles.categoryBox}>
          <Ionicons name="grid-outline" size={18} color="#22c55e" />
          <View>
            <Text style={styles.categoryLabel}>SELECTED CATEGORY</Text>
            <Text style={styles.categoryName}>{categoryName}</Text>
          </View>
        </View>

        <Text style={styles.label}>Product Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 90 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <View style={{ width: 12 }} />

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={stock}
              onChangeText={setStock}
            />
          </View>
        </View>

        {/* NEXT */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={goNext}
          disabled={loading}
        >
          <Text style={styles.saveText}>
            {loading ? 'Creating...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  categoryBox: {
    margin: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#ecfdf5',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  categoryLabel: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '600',
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '700',
  },

  label: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  input: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },

  saveBtn: {
    margin: 16,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
