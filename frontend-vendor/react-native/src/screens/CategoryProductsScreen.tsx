import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://2a6717c6fa2a.ngrok-free.app';

export default function CategoryProductsScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { categoryId, categoryName } = route.params;

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch image for a single product
const fetchProductImage = async (productId, token) => {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/vendor/products/${productId}/images`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    );

    if (!res.ok) return null;

    const images = await res.json();
    console.log('Product ID:', productId, 'Images:', images);

    if (!Array.isArray(images) || images.length === 0) return null;

    // Find primary image
    const primary = images.find(img => img.isPrimary) || images[0];

    // imageUrl is already full URL from Cloudinary
   return primary.imageUrl ? `${primary.imageUrl}?t=${Date.now()}` : null;


  } catch (err) {
    console.log('Image fetch error:', err.message);
    return null;
  }
};



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) throw new Error('No token found');

        const res = await fetch(
          `${BASE_URL}/api/v1/vendor/products?categoryId=${categoryId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          }
        );

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || 'Failed to fetch products');
        }

        const productList = result.content || [];

        // 🔥 Fetch images in parallel
        const mappedProducts = await Promise.all(
  productList.map(async (p) => ({
    id: p.productId, // <-- correct field
    name: p.name,
    size: p.unit || '',
    price: `₹${p.price}`,
    stock: p.stock > 0 ? `${p.stock} available` : 'Out of Stock',
    inStock: p.stock > 0,
    image: await fetchProductImage(p.productId, token), // <-- use productId
  }))
);

        setProducts(mappedProducts);
      } catch (error: any) {
        console.log('Fetch products error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate('Home'); // fallback screen
  }
}}>
  <Ionicons name="arrow-back" size={22} />
</TouchableOpacity>


        <View style={{ marginLeft: 10 }}>
          <Text style={styles.title}>{categoryName}</Text>
          <Text style={styles.subTitle}>
            Managing {products.length} Products
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Ionicons name="moon-outline" size={22} />
          <Ionicons name="search-outline" size={22} />
        </View>
      </View>

      {/* PRODUCTS */}
      <FlatList
        data={products}
        keyExtractor={(item, index) =>
          (item.id ?? index).toString()
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
  source={ item.image ? { uri: item.image } : require('../icons/background1.jpg') }
  style={styles.imageBox}
  resizeMode="cover"
/>


            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.size}>{item.size}</Text>

              <View style={styles.row}>
                <Text style={styles.price}>{item.price}</Text>
                <Text
                  style={[
                    styles.stock,
                    {
                      color: item.inStock
                        ? '#22c55e'
                        : '#ef4444',
                    },
                  ]}
                >
                  {item.stock}
                </Text>
              </View>
            </View>

            <Ionicons name="ellipsis-vertical" size={18} />
          </View>
        )}
      />

      {/* CREATE PRODUCT */}
      <TouchableOpacity
        style={styles.createBtn}
        onPress={() =>
          navigation.navigate('AddProduct', {
            categoryId,
            categoryName,
          })
        }
      >
        <Text style={styles.createText}>
          ＋ Create New Product
        </Text>
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
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  headerRight: {
    marginLeft: 'auto',
    flexDirection: 'row',
    gap: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  subTitle: {
    fontSize: 12,
    color: '#64748b',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  imageBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#e5e7eb',
  },

  name: {
    fontSize: 14,
    fontWeight: '700',
  },

  size: {
    fontSize: 11,
    color: '#64748b',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  price: {
    fontWeight: '700',
    color: '#22c55e',
  },

  stock: {
    fontSize: 11,
    fontWeight: '600',
  },

  createBtn: {
    margin: 16,
    backgroundColor: '#22c55e',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },

  createText: {
    color: 'white',
    fontWeight: '700',
  },
});
