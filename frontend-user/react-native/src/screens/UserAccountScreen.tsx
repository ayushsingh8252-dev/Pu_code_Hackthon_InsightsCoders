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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import BottomNavigation from '../components/BottomNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface Order {
  id: string;
  vendor: string;
  product: string;
  amount: number;
  date: string;
  status: string;
  address?: string;
  phone?: string;
  paymentMethod?: string;
}

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdDate: string;
  lastUpdate: string;
  progress: number;
}

const initialOrderHistory: Order[] = [
  { 
    id: '#ORD-1234', 
    vendor: 'Sharma Fresh Fruits', 
    product: 'Fresh Apples (2kg)', 
    amount: 360, 
    date: 'Dec 26, 2025', 
    status: 'Delivered',
    address: 'C-42, Saket, New Delhi - 110017',
    phone: '+91 98765 43210',
    paymentMethod: 'Card ending in 3456'
  },
  { 
    id: '#ORD-1235', 
    vendor: 'Patel Organic Vegetables', 
    product: 'Mixed Vegetables', 
    amount: 450, 
    date: 'Dec 20, 2025', 
    status: 'In Transit',
    address: 'C-42, Saket, New Delhi - 110017',
    phone: '+91 98765 43210',
    paymentMethod: 'Card ending in 3456'
  },
  { 
    id: '#ORD-1236', 
    vendor: 'Kumar Tropical Fruits', 
    product: 'Mango (5kg)', 
    amount: 550, 
    date: 'Dec 15, 2025', 
    status: 'Delivered',
    address: 'C-42, Saket, New Delhi - 110017',
    phone: '+91 98765 43210',
    paymentMethod: 'Card ending in 3456'
  },
];

const savedVendors = [
  { id: 1, name: 'Sharma Fresh Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&h=100&fit=crop' },
  { id: 2, name: 'Patel Organic Vegetables', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=100&h=100&fit=crop' },
  { id: 3, name: 'Kumar Tropical Fruits', image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=100&h=100&fit=crop' },
];

const initialSupportTickets: SupportTicket[] = [
  {
    id: '#TKT-5001',
    subject: 'Wrong items delivered',
    description: 'I ordered apples but received oranges instead',
    category: 'Order Issue',
    status: 'In Progress',
    priority: 'High',
    createdDate: 'Dec 27, 2025',
    lastUpdate: 'Dec 28, 2025 10:30 AM',
    progress: 60
  },
  {
    id: '#TKT-5002',
    subject: 'Payment not reflected',
    description: 'Made payment but order shows pending',
    category: 'Payment',
    status: 'Open',
    priority: 'Medium',
    createdDate: 'Dec 26, 2025',
    lastUpdate: 'Dec 26, 2025 3:45 PM',
    progress: 25
  },
  {
    id: '#TKT-5003',
    subject: 'Refund request for cancelled order',
    description: 'Need refund for order #ORD-1230',
    category: 'Refund',
    status: 'Resolved',
    priority: 'Low',
    createdDate: 'Dec 20, 2025',
    lastUpdate: 'Dec 25, 2025 2:15 PM',
    progress: 100
  },
];

export default function UserAccountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedTab, setSelectedTab] = useState('orders');
  const [orderHistory, setOrderHistory] = useState(initialOrderHistory);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [supportTickets, setSupportTickets] = useState(initialSupportTickets);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    description: '',
    category: 'Order Issue',
    priority: 'Medium' as 'Low' | 'Medium' | 'High'
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCancelOrder = () => {
    if (!selectedOrder) return;

    setOrderHistory(orderHistory.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, status: 'Cancelled' }
        : order
    ));

    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  const handleCreateTicket = () => {
    const newTicket: SupportTicket = {
      id: `#TKT-${Math.floor(Math.random() * 10000)}`,
      subject: newTicketForm.subject,
      description: newTicketForm.description,
      category: newTicketForm.category,
      status: 'Open',
      priority: newTicketForm.priority,
      createdDate: new Date().toLocaleDateString(),
      lastUpdate: new Date().toLocaleDateString(),
      progress: 0
    };

    setSupportTickets([newTicket, ...supportTickets]);
    setShowNewTicketModal(false);
    setNewTicketForm({
      subject: '',
      description: '',
      category: 'Order Issue',
      priority: 'Medium'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return '#16a34a';
      case 'Cancelled':
        return '#dc2626';
      default:
        return '#2563eb';
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return '#16a34a';
      case 'Closed':
        return '#64748b';
      case 'In Progress':
        return '#2563eb';
      default:
        return '#f97316';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return { border: '#dc2626', bg: '#fee2e2', text: '#991b1b' };
      case 'Medium':
        return { border: '#f97316', bg: '#ffedd5', text: '#9a3412' };
      default:
        return { border: '#16a34a', bg: '#dcfce7', text: '#166534' };
    }
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
        <Text style={styles.headerTitle}>My Account</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1554733998-0ddd4f28f5d0?w=200&h=200&fit=crop' }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>Savita Bhabhi</Text>
          <Text style={styles.profileEmail}>savita.bhabhi@email.com</Text>
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>Premium Member</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'orders' && styles.tabActive]}
            onPress={() => setSelectedTab('orders')}
          >
            <Text style={styles.tabIcon}>📦</Text>
            <Text style={[styles.tabText, selectedTab === 'orders' && styles.tabTextActive]}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'support' && styles.tabActive]}
            onPress={() => setSelectedTab('support')}
          >
            <Text style={styles.tabIcon}>🎧</Text>
            <Text style={[styles.tabText, selectedTab === 'support' && styles.tabTextActive]}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'saved' && styles.tabActive]}
            onPress={() => setSelectedTab('saved')}
          >
            <Text style={styles.tabIcon}>❤️</Text>
            <Text style={[styles.tabText, selectedTab === 'saved' && styles.tabTextActive]}>Saved</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'profile' && styles.tabActive]}
            onPress={() => setSelectedTab('profile')}
          >
            <Text style={styles.tabIcon}>👤</Text>
            <Text style={[styles.tabText, selectedTab === 'profile' && styles.tabTextActive]}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Orders Tab */}
        {selectedTab === 'orders' && (
          <View style={styles.tabContent}>
            {orderHistory.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <View style={styles.orderIdRow}>
                      <Text style={styles.orderId}>{order.id}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                        <Text style={styles.statusText}>{order.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.orderVendor}>{order.vendor}</Text>
                    <Text style={styles.orderProduct}>{order.product}</Text>
                  </View>
                  <View style={styles.orderPrice}>
                    <Text style={styles.orderAmount}>₹{order.amount}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => handleViewDetails(order)}
                >
                  <Text style={styles.viewDetailsText}>View Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Support Tab */}
        {selectedTab === 'support' && (
          <View style={styles.tabContent}>
            <TouchableOpacity
              style={styles.createTicketButton}
              onPress={() => setShowNewTicketModal(true)}
            >
              <Text style={styles.createTicketIcon}>💬</Text>
              <Text style={styles.createTicketText}>Create New Support Ticket</Text>
            </TouchableOpacity>

            {supportTickets.map((ticket) => {
              const priorityColors = getPriorityColor(ticket.priority);
              return (
                <View key={ticket.id} style={styles.ticketCard}>
                  <View style={styles.ticketHeader}>
                    <Text style={styles.ticketId}>{ticket.id}</Text>
                    <View style={styles.ticketBadges}>
                      <View style={[styles.ticketStatusBadge, { backgroundColor: getTicketStatusColor(ticket.status) }]}>
                        <Text style={styles.ticketStatusText}>{ticket.status}</Text>
                      </View>
                      <View style={[styles.priorityBadge, { borderColor: priorityColors.border, backgroundColor: priorityColors.bg }]}>
                        <Text style={[styles.priorityText, { color: priorityColors.text }]}>{ticket.priority}</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                  <Text style={styles.ticketCategory}>{ticket.category}</Text>
                  <Text style={styles.ticketUpdate}>Last updated: {ticket.lastUpdate}</Text>
                  
                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Progress</Text>
                      <Text style={styles.progressPercentage}>{ticket.progress}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${ticket.progress}%`,
                            backgroundColor: ticket.progress === 100 ? '#16a34a' : ticket.progress >= 50 ? '#2563eb' : '#f97316'
                          }
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.ticketDescription}>
                    <Text style={styles.descriptionLabel}>Description:</Text>
                    <Text style={styles.descriptionText}>{ticket.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Saved Tab */}
        {selectedTab === 'saved' && (
          <View style={styles.tabContent}>
            {savedVendors.map((vendor) => (
              <TouchableOpacity
                key={vendor.id}
                style={styles.savedVendorCard}
                onPress={() => navigation.navigate('VendorDetails', { vendorId: vendor.id })}
              >
                <Image source={{ uri: vendor.image }} style={styles.savedVendorImage} />
                <View style={styles.savedVendorInfo}>
                  <Text style={styles.savedVendorName}>{vendor.name}</Text>
                  <Text style={styles.savedVendorRating}>⭐ 4.8</Text>
                </View>
                <Text style={styles.heartIcon}>❤️</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Profile Tab */}
        {selectedTab === 'profile' && (
          <View style={styles.tabContent}>
            <View style={styles.profileForm}>
              <View style={styles.formRow}>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>First Name</Text>
                  <TextInput style={styles.formInput} defaultValue="Savita" />
                </View>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Last Name</Text>
                  <TextInput style={styles.formInput} defaultValue="Bhabhi" />
                </View>
              </View>
              <View style={styles.formFieldFull}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput style={styles.formInput} defaultValue="savita.bhabhi@email.com" keyboardType="email-address" />
              </View>
              <View style={styles.formFieldFull}>
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput style={styles.formInput} defaultValue="+91 98765 43210" keyboardType="phone-pad" />
              </View>
              <View style={styles.formFieldFull}>
                <Text style={styles.formLabel}>Address</Text>
                <TextInput style={styles.formInput} defaultValue="C-42, Saket, New Delhi - 110017" />
              </View>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavigation currentRoute="UserAccount" />

      {/* Order Details Modal */}
      <Modal visible={showOrderModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Order Details</Text>
              <TouchableOpacity onPress={() => setShowOrderModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            {selectedOrder && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalBody}>
                  <View style={styles.orderIdRow}>
                    <Text style={styles.orderId}>{selectedOrder.id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(selectedOrder.status) }]}>
                      <Text style={styles.statusText}>{selectedOrder.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.orderVendor}>{selectedOrder.vendor}</Text>
                  <Text style={styles.orderProduct}>{selectedOrder.product}</Text>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📍</Text>
                    <Text style={styles.detailText}>{selectedOrder.address}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>📞</Text>
                    <Text style={styles.detailText}>{selectedOrder.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailIcon}>💳</Text>
                    <Text style={styles.detailText}>{selectedOrder.paymentMethod}</Text>
                  </View>
                  
                  <Text style={styles.orderAmount}>₹{selectedOrder.amount}</Text>
                  <Text style={styles.orderDate}>{selectedOrder.date}</Text>

                  {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancelOrder}
                    >
                      <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* New Ticket Modal */}
      <Modal visible={showNewTicketModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Support Ticket</Text>
              <TouchableOpacity onPress={() => setShowNewTicketModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalBody}>
                <View style={styles.formFieldFull}>
                  <Text style={styles.formLabel}>Subject</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newTicketForm.subject}
                    onChangeText={(text) => setNewTicketForm({ ...newTicketForm, subject: text })}
                    placeholder="Enter subject"
                  />
                </View>
                <View style={styles.formFieldFull}>
                  <Text style={styles.formLabel}>Description</Text>
                  <TextInput
                    style={[styles.formInput, styles.textArea]}
                    value={newTicketForm.description}
                    onChangeText={(text) => setNewTicketForm({ ...newTicketForm, description: text })}
                    placeholder="Describe your issue"
                    multiline
                    numberOfLines={4}
                  />
                </View>
                <View style={styles.formFieldFull}>
                  <Text style={styles.formLabel}>Category</Text>
                  <TextInput
                    style={styles.formInput}
                    value={newTicketForm.category}
                    onChangeText={(text) => setNewTicketForm({ ...newTicketForm, category: text })}
                  />
                </View>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateTicket}
                >
                  <Text style={styles.createButtonText}>Create Ticket</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  content: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  premiumBadge: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#070707',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    backgroundColor: '#dcfce7',
    borderBottomColor: '#16a34a',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#16a34a',
  },
  tabContent: {
    margin: 16,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },
  orderVendor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  orderProduct: {
    fontSize: 12,
    color: '#94a3b8',
  },
  orderPrice: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 11,
    color: '#94a3b8',
  },
  viewDetailsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  createTicketButton: {
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  createTicketIcon: {
    fontSize: 20,
  },
  createTicketText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  ticketCard: {
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
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ticketId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  ticketBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  ticketStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketStatusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  ticketSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  ticketCategory: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  ticketUpdate: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  ticketDescription: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  savedVendorCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  savedVendorImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  savedVendorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  savedVendorName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  savedVendorRating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  heartIcon: {
    fontSize: 24,
  },
  profileForm: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  formField: {
    flex: 1,
  },
  formFieldFull: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1e293b',
  },
  textArea: {
    height: 96,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalClose: {
    fontSize: 24,
    fontWeight: '700',
    color: '#64748b',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  detailIcon: {
    fontSize: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },
  createButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
