import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorDetails'>;
type VendorDetailsRouteProp = RouteProp<RootStackParamList, 'VendorDetails'>;

interface Product {
  id: number;
  name: string;
  nameHindi: string;
  price: number;
  unit: string;
  image: string;
  inStock: boolean;
}

const vendorData = {
  1: {
    id: 1,
    name: 'Sharma Fresh Fruits',
    category: 'Fruits',
    rating: 4.8,
    distance: '2.5 km',
    address: 'Shop 12, Saket Market, New Delhi - 110017',
    phone: '+91 98765 43210',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop',
    isOpen: true,
    gst: 'GST: 07AABCS1234F1Z5',
    products: [
      { id: 1, name: 'Apples', nameHindi: 'सेब', price: 180, unit: 'per kg', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=200&fit=crop', inStock: true },
      { id: 2, name: 'Bananas', nameHindi: 'केला', price: 60, unit: 'per dozen', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=200&fit=crop', inStock: true },
      { id: 3, name: 'Oranges', nameHindi: 'संतरा', price: 120, unit: 'per kg', image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&h=200&fit=crop', inStock: true },
      { id: 4, name: 'Grapes', nameHindi: 'अंगूर', price: 200, unit: 'per kg', image: 'https://images.unsplash.com/photo-1599819177131-f9e4891f5eb0?w=300&h=200&fit=crop', inStock: false },
    ],
  },
  2: {
    id: 2,
    name: 'Patel Organic Vegetables',
    category: 'Vegetables',
    rating: 4.6,
    distance: '3.2 km',
    address: 'A-15, Lajpat Nagar, New Delhi - 110024',
    phone: '+91 98765 43211',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
    isOpen: true,
    gst: 'GST: 07BBCDE5678G2Z6',
    products: [
      { id: 5, name: 'Tomatoes', nameHindi: 'टमाटर', price: 60, unit: 'per kg', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=200&fit=crop', inStock: true },
      { id: 6, name: 'Potatoes', nameHindi: 'आलू', price: 40, unit: 'per kg', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&h=200&fit=crop', inStock: true },
      { id: 7, name: 'Onions', nameHindi: 'प्याज', price: 50, unit: 'per kg', image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&h=200&fit=crop', inStock: true },
      { id: 8, name: 'Carrots', nameHindi: 'गाजर', price: 70, unit: 'per kg', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=200&fit=crop', inStock: true },
    ],
  },
  3: {
    id: 3,
    name: 'Kumar Tropical Fruits',
    category: 'Fruits',
    rating: 4.9,
    distance: '1.8 km',
    address: 'C-22, Hauz Khas, New Delhi - 110016',
    phone: '+91 98765 43212',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=300&fit=crop',
    isOpen: false,
    gst: 'GST: 07CCFGH9012H3Z7',
    products: [
      { id: 9, name: 'Mangoes', nameHindi: 'आम', price: 220, unit: 'per kg', image: 'https://images.unsplash.com/photo-1605635900435-c3dc7a66f71f?w=300&h=200&fit=crop', inStock: true },
      { id: 10, name: 'Pineapples', nameHindi: 'अनानास', price: 80, unit: 'per piece', image: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=300&h=200&fit=crop', inStock: true },
      { id: 11, name: 'Watermelons', nameHindi: 'तरबूज', price: 40, unit: 'per kg', image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=300&h=200&fit=crop', inStock: true },
    ],
  },
  4: {
    id: 4,
    name: 'Singh Seasonal Vegetables',
    category: 'Vegetables',
    rating: 4.7,
    distance: '4.1 km',
    address: 'B-8, Nehru Place, New Delhi - 110019',
    phone: '+91 98765 43213',
    image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=300&fit=crop',
    isOpen: true,
    gst: 'GST: 07DDIJK3456I4Z8',
    products: [
      { id: 12, name: 'Spinach', nameHindi: 'पालक', price: 30, unit: 'per bunch', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop', inStock: true },
      { id: 13, name: 'Cauliflower', nameHindi: 'फूलगोभी', price: 50, unit: 'per piece', image: 'https://images.unsplash.com/photo-1568584711271-2f94b95ec5b8?w=300&h=200&fit=crop', inStock: true },
      { id: 14, name: 'Cabbage', nameHindi: 'पत्तागोभी', price: 35, unit: 'per piece', image: 'https://images.unsplash.com/photo-1594282486084-4f3d6b3a4c8d?w=300&h=200&fit=crop', inStock: true },
    ],
  },
};

export default function VendorDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VendorDetailsRouteProp>();
  const { vendorId } = route.params;

  const vendor = vendorData[vendorId as keyof typeof vendorData];

  if (!vendor) {
    return (
      <View style={styles.container}>
        <Text>Vendor not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vendor Details</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Vendor Info Card */}
        <View style={styles.vendorCard}>
          <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
          <View style={styles.vendorInfo}>
            <View style={styles.vendorHeader}>
              <Text style={styles.vendorName}>{vendor.name}</Text>
              <View style={[styles.statusBadge, vendor.isOpen ? styles.statusOpen : styles.statusClosed]}>
                <View style={[styles.statusDot, vendor.isOpen ? styles.statusDotOpen : styles.statusDotClosed]} />
                <Text style={styles.statusText}>{vendor.isOpen ? 'Open Now' : 'Closed'}</Text>
              </View>
            </View>
            <View style={styles.vendorMeta}>
              <Text style={styles.vendorRating}>⭐ {vendor.rating} Rating</Text>
              <Text style={styles.vendorDistance}>📍 {vendor.distance}</Text>
            </View>
            <View style={styles.vendorDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📍</Text>
                <Text style={styles.detailText}>{vendor.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📞</Text>
                <Text style={styles.detailText}>{vendor.phone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailIcon}>📄</Text>
                <Text style={styles.detailText}>{vendor.gst}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Products Section */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Available Products</Text>
          {vendor.products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image source={{ uri: product.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {product.name} / {product.nameHindi}
                </Text>
                <Text style={styles.productPrice}>
                  ₹{product.price} {product.unit}
                </Text>
                {!product.inStock && (
                  <View style={styles.outOfStockBadge}>
                    <Text style={styles.outOfStockText}>Out of Stock</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.orderButton, !vendor.isOpen && styles.orderButtonDisabled]}
          onPress={() => {
            if (vendor.isOpen) {
              navigation.navigate('OrderFlow', { vendorId: vendor.id, vendorName: vendor.name });
            }
          }}
          disabled={!vendor.isOpen}
        >
          <Text style={styles.orderButtonText}>
            {vendor.isOpen ? 'Place Order' : 'Currently Closed'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#16a34a',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: {
    fontSize: 28,
    color: 'white',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#270000',
  },
  content: {
    flex: 1,
  },
  vendorCard: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  vendorImage: {
    width: '100%',
    height: 200,
  },
  vendorInfo: {
    padding: 16,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusOpen: {
    backgroundColor: '#dcfce7',
  },
  statusClosed: {
    backgroundColor: '#fee2e2',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusDotOpen: {
    backgroundColor: '#16a34a',
  },
  statusDotClosed: {
    backgroundColor: '#dc2626',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  vendorMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  vendorRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  vendorDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  vendorDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  productsSection: {
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
  outOfStockBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  outOfStockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },
  footer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderButton: {
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  orderButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});
