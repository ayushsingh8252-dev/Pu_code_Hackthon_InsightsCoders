import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import BottomNavigation from '../components/BottomNavigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Vendor {
  id: number;
  name: string;
  category: string;
  rating: number;
  distance: string;
  address: string;
  phone: string;
  image: string;
  isOpen: boolean;
  gst: string;
  popularProducts: string[];
}

const categories = [
  { id: 1, name: 'Fruits', icon: '🍎' },
  { id: 2, name: 'Vegetables', icon: '🥬' },
];

const vendors: Vendor[] = [
  {
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
    popularProducts: ['Apples', 'Bananas', 'Oranges'],
  },
  {
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
    popularProducts: ['Tomatoes', 'Potatoes', 'Onions'],
  },
  {
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
    popularProducts: ['Mangoes', 'Pineapples', 'Watermelons'],
  },
  {
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
    popularProducts: ['Spinach', 'Cauliflower', 'Carrots'],
  },
];

const popularPicks = [
  {
    id: 1,
    name: 'Fresh Apples',
    vendor: 'Sharma Fresh Fruits',
    price: 180,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=200&fit=crop',
    unit: 'per kg',
  },
  {
    id: 2,
    name: 'Organic Tomatoes',
    vendor: 'Patel Organic Vegetables',
    price: 60,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&h=200&fit=crop',
    unit: 'per kg',
  },
  {
    id: 3,
    name: 'Fresh Mangoes',
    vendor: 'Kumar Tropical Fruits',
    price: 220,
    image: 'https://images.unsplash.com/photo-1605635900435-c3dc7a66f71f?w=300&h=200&fit=crop',
    unit: 'per kg',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  const filteredVendors = vendors
  .filter((vendor) => {
    const query = searchQuery.trim().toLowerCase();

    // category filter
    const categoryMatch =
      selectedCategory === 'All' || vendor.category === selectedCategory;

    // if search empty → only category filter
    if (query === '') return categoryMatch;

    // search matches
    const nameMatch = vendor.name.toLowerCase().includes(query);
    const categoryTextMatch = vendor.category.toLowerCase().includes(query);
    const productMatch = vendor.popularProducts.some(product =>
      product.toLowerCase().includes(query)
    );

    return categoryMatch && (nameMatch || categoryTextMatch || productMatch);
  })
  .sort((a, b) => {
    if (sortBy === 'distance') {
      return parseFloat(a.distance) - parseFloat(b.distance);
    }
    return b.rating - a.rating;
  });


  return (
    <View style={styles.container}>
      {/* Header */}
<View style={styles.header}>
  
  {/* App Logo */}
  <View style={styles.logoRow}>
  <Image
    source={require('../icons/VendorHub-logo.png')}
    style={styles.logo}
    resizeMode="contain"
  />
  <Text style={styles.headerSubtitle}>VendorHub</Text>
</View>


  {/* Search + Location */}
  <View style={styles.searchRow}>
    
    <View style={styles.searchBox}>
      <Ionicons name="search" size={18} color="#64748b" />
      <TextInput
  placeholder="Search fruits or vegetables"
  placeholderTextColor="#64748b"
  style={styles.searchInput}
  value={searchQuery}
  onChangeText={setSearchQuery}
/>

    </View>

    <TouchableOpacity style={styles.locationButton}>
      <Ionicons name="location-outline" size={22} color="#16a34a" />
    </TouchableOpacity>

  </View>
</View>


      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            <TouchableOpacity
              style={[styles.categoryCard, selectedCategory === 'All' && styles.categoryCardActive]}
              onPress={() => setSelectedCategory('All')}
            >
              <Text style={styles.categoryIcon}>📦</Text>
              <Text style={[styles.categoryText, selectedCategory === 'All' && styles.categoryTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, selectedCategory === category.name && styles.categoryCardActive]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryText, selectedCategory === category.name && styles.categoryTextActive]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>


        {/* Vendors Section */}
        <View style={styles.section}>
          <View style={styles.vendorsHeader}>
            <Text style={styles.sectionTitle}>Nearby Vendors</Text>
            <View style={styles.sortButtons}>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'distance' && styles.sortButtonActive]}
                onPress={() => setSortBy('distance')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'distance' && styles.sortButtonTextActive]}>
                  Distance
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortButton, sortBy === 'rating' && styles.sortButtonActive]}
                onPress={() => setSortBy('rating')}
              >
                <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.sortButtonTextActive]}>
                  Rating
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {filteredVendors.map((vendor) => (
            <TouchableOpacity
              key={vendor.id}
              style={styles.vendorCard}
              onPress={() => navigation.navigate('VendorDetails', { vendorId: vendor.id })}
            >
              <Image source={{ uri: vendor.image }} style={styles.vendorImage} />
              <View style={styles.vendorContent}>
                <View style={styles.vendorHeader}>
                  <Text style={styles.vendorName}>{vendor.name}</Text>
                  <View style={[styles.statusBadge, vendor.isOpen ? styles.statusOpen : styles.statusClosed]}>
                    <Text style={styles.statusText}>{vendor.isOpen ? 'Open' : 'Closed'}</Text>
                  </View>
                </View>
                <View style={styles.vendorMeta}>
                  <Text style={styles.vendorRating}>⭐ {vendor.rating}</Text>
                  <Text style={styles.vendorDistance}>📍 {vendor.distance}</Text>
                </View>
                <Text style={styles.vendorAddress}>{vendor.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Popular Picks */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Popular Picks</Text>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.popularContainer}
  >
    {popularPicks.map(item => (
      <TouchableOpacity
        key={item.id}
        style={styles.popularCircleWrapper}
        onPress={() =>
          navigation.navigate('PopularDetails', { item })
        }
      >
        <Image
          source={{ uri: item.image }}
          style={styles.popularCircleImage}
        />
        <Text style={styles.popularCircleText}>
          {item.name}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
</View>

      </ScrollView>

      <BottomNavigation currentRoute="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
 logoRow: {
  flexDirection: 'row',
  alignItems: 'left',
  paddingHorizontal: 1,   // 👈 pushes logo to left
  marginBottom: 6,
  alignSelf: 'flex-start', // 👈 ensures left alignment
},
logo: {
  width: 60,
  height: 36,
},
headerSubtitle: {              // space between logo & text
  fontSize: 25,
  fontWeight: '700',
  color: '#14532d',           // professional green
  letterSpacing: 0.5,
},
searchRow: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
},
searchBox: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'white',
  borderRadius: 12,
  paddingHorizontal: 12,
  height: 44,
  elevation: 2,
},

searchInput: {
  flex: 1,
  marginLeft: 8,
  fontSize: 14,
  color: '#1e293b',
},
popularCircleWrapper: {
  alignItems: 'center',
  marginRight: 16,
},

popularCircleImage: {
  width: 90,
  height: 90,
  borderRadius: 45, // perfect circle
  borderWidth: 2,
  borderColor: '#16a34a',
},

popularCircleText: {
  marginTop: 6,
  fontSize: 12,
  fontWeight: '600',
  color: '#1e293b',
  textAlign: 'center',
  width: 90,
},

locationButton: {
  marginLeft: 12,
  backgroundColor: 'white',
  borderRadius: 12,
  width: 44,
  height: 44,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 2,
},
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#e0f2fe',
    paddingTop: -6,
    paddingBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#270000',
    marginTop: 4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  categoriesContainer: {
    paddingLeft: 16,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 90,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryCardActive: {
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: '#16a34a',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#16a34a',
  },
  popularContainer: {
    paddingLeft: 16,
  },
  popularCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  popularImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  popularContent: {
    padding: 12,
  },
  popularName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  popularVendor: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  popularPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
  vendorsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sortButtonActive: {
    backgroundColor: '#16a34a',
    borderColor: '#16a34a',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  vendorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  vendorImage: {
    width: '100%',
    height: 160,
  },
  vendorContent: {
    padding: 16,
  },
  vendorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#dcfce7',
  },
  statusClosed: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  vendorMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
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
  vendorAddress: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
});
