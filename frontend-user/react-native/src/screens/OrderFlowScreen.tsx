import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'OrderFlow'>;
type OrderFlowRouteProp = RouteProp<RootStackParamList, 'OrderFlow'>;

interface Product {
  id: number;
  name: string;
  nameHindi: string;
  price: number;
  unit: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: 'Apples', nameHindi: 'सेब', price: 180, unit: 'per kg', image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=200&fit=crop' },
  { id: 2, name: 'Bananas', nameHindi: 'केला', price: 60, unit: 'per dozen', image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=300&h=200&fit=crop' },
  { id: 3, name: 'Oranges', nameHindi: 'संतरा', price: 120, unit: 'per kg', image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=300&h=200&fit=crop' },
  { id: 4, name: 'Grapes', nameHindi: 'अंगूर', price: 200, unit: 'per kg', image: 'https://images.unsplash.com/photo-1599819177131-f9e4891f5eb0?w=300&h=200&fit=crop' },
];

export default function OrderFlowScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<OrderFlowRouteProp>();
  const { vendorId, vendorName } = route.params;

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const deliveryFee = 40;
  const total = subtotal + gst + deliveryFee;

  const handlePlaceOrder = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.navigate('Home');
    }, 2000);
  };

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
        <Text style={styles.headerTitle}>Place Order</Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={styles.stepContainer}>
          <View style={[styles.step, currentStep >= 1 && styles.stepActive]}>
            <Text style={[styles.stepNumber, currentStep >= 1 && styles.stepNumberActive]}>1</Text>
          </View>
          <Text style={styles.stepLabel}>Select Items</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepContainer}>
          <View style={[styles.step, currentStep >= 2 && styles.stepActive]}>
            <Text style={[styles.stepNumber, currentStep >= 2 && styles.stepNumberActive]}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Review Cart</Text>
        </View>
        <View style={styles.stepLine} />
        <View style={styles.stepContainer}>
          <View style={[styles.step, currentStep >= 3 && styles.stepActive]}>
            <Text style={[styles.stepNumber, currentStep >= 3 && styles.stepNumberActive]}>3</Text>
          </View>
          <Text style={styles.stepLabel}>Confirm</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1: Select Products */}
        {currentStep === 1 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Products from {vendorName}</Text>
            {products.map((product) => {
              const cartItem = cart.find(item => item.id === product.id);
              return (
                <View key={product.id} style={styles.productCard}>
                  <Image source={{ uri: product.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {product.name} / {product.nameHindi}
                    </Text>
                    <Text style={styles.productPrice}>₹{product.price} {product.unit}</Text>
                  </View>
                  {cartItem ? (
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(product.id, -1)}
                      >
                        <Text style={styles.quantityButtonText}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateQuantity(product.id, 1)}
                      >
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => addToCart(product)}
                    >
                      <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Step 2: Review Cart */}
        {currentStep === 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Review Your Cart</Text>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName}>{item.name} / {item.nameHindi}</Text>
                  <Text style={styles.cartItemPrice}>
                    ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                  </Text>
                </View>
                <View style={styles.cartItemActions}>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity
                      style={styles.quantityButtonSmall}
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButtonSmall}
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFromCart(item.id)}
                  >
                    <Text style={styles.removeButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Step 3: Confirm Order */}
        {currentStep === 3 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            
            {/* Delivery Address */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>📍 Delivery Address</Text>
              <Text style={styles.infoCardText}>C-42, Saket, New Delhi - 110017</Text>
            </View>

            {/* Contact */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>📞 Contact</Text>
              <Text style={styles.infoCardText}>+91 98765 43210</Text>
            </View>

            {/* Payment Method */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>💳 Payment Method</Text>
              <Text style={styles.infoCardText}>Cash on Delivery</Text>
            </View>

            {/* Order Items */}
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>🛒 Order Items</Text>
              {cart.map((item) => (
                <View key={item.id} style={styles.summaryItem}>
                  <Text style={styles.summaryItemText}>
                    {item.name} × {item.quantity}
                  </Text>
                  <Text style={styles.summaryItemPrice}>₹{item.price * item.quantity}</Text>
                </View>
              ))}
            </View>

            {/* Price Breakdown */}
            <View style={styles.priceCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>₹{subtotal}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>GST (18%)</Text>
                <Text style={styles.priceValue}>₹{gst.toFixed(2)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Delivery Fee</Text>
                <Text style={styles.priceValue}>₹{deliveryFee}</Text>
              </View>
              <View style={[styles.priceRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          {cart.length > 0 && (
            <View style={styles.footerSummary}>
              <Text style={styles.footerItems}>{cart.length} items</Text>
              <Text style={styles.footerTotal}>₹{total.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.footerButtons}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.backStepButton}
                onPress={() => setCurrentStep(currentStep - 1)}
              >
                <Text style={styles.backStepButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.nextButton,
                cart.length === 0 && styles.nextButtonDisabled,
                currentStep > 1 && styles.nextButtonHalf,
              ]}
              onPress={() => {
                if (currentStep < 3) {
                  setCurrentStep(currentStep + 1);
                } else {
                  handlePlaceOrder();
                }
              }}
              disabled={cart.length === 0}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 3 ? 'Place Order' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successMessage}>Your order will be delivered soon</Text>
          </View>
        </View>
      </Modal>
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
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  stepActive: {
    backgroundColor: '#16a34a',
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  stepNumberActive: {
    color: 'white',
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  stepLine: {
    height: 2,
    backgroundColor: '#e2e8f0',
    flex: 0.3,
    marginHorizontal: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
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
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    minWidth: 24,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
  },
  cartItemActions: {
    gap: 8,
  },
  removeButton: {
    alignSelf: 'center',
    padding: 4,
  },
  removeButtonText: {
    fontSize: 18,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryItemText: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  priceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16a34a',
  },
  footer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  footerContent: {
    padding: 16,
  },
  footerSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  footerItems: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#16a34a',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backStepButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backStepButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonHalf: {
    flex: 1,
  },
  nextButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
});
