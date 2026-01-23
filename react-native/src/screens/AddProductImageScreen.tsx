import React, { useState,useEffect  } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddProductImageScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { categoryId, categoryName, productId } = route.params;
  
  useEffect(() => {
  console.log('Route params:', route.params);
  console.log('Product ID:', productId);
}, []);
// ✅ productId from first screen

  const [image, setImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Pick image from gallery
  const pickImage = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  // Upload image API
  const submitProduct = async () => {
    if (!image) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) throw new Error('User not authenticated');

      const formData = new FormData();
      formData.append('file', {
  uri: image.uri,
  name: 'product.jpg',
  type: 'image/jpeg',
} as any);


      const res = await fetch(
        `https://388dd6d89cf6.ngrok-free.app/api/v1/vendor/products/${productId}/images`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ DO NOT set Content-Type manually for FormData
          },
          body: formData,
        }
      );

      const text = await res.text();
console.log('Server response:', text);

      if (!res.ok) {
        throw new Error(text || 'Image upload failed');
      }

      Alert.alert('Success', 'Product added successfully');

      // Navigate back to CategoryProducts screen
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'CategoryProducts',
            params: { categoryId, categoryName },
          },
        ],
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Product Image</Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image.uri }} style={styles.image} />
        ) : (
          <>
            <Ionicons name="camera-outline" size={26} />
            <Text>Tap to upload image</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={submitProduct}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Add New Product</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
    justifyContent: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 30,
  },

  imageBox: {
    height: 220,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },

  saveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
