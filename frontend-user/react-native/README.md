# Vendor Digital Presence Platform - React Native (Android)

A complete B2B/B2C Vendor Digital Presence Platform built with React Native for Android mobile devices. This application allows customers to discover vendors, view products, place orders, and manage their account with customer support ticketing system.

## 📱 Features

### User Portal (Customer App)
- **Home Screen**
  - Category-based navigation (Fruits & Vegetables)
  - Vendor sorting by distance and rating
  - Popular picks recommendations
  - Live vendor status (Open/Closed)
  - Location-based delivery information

- **Vendor Details Screen**
  - Comprehensive vendor information
  - Product catalog with Hindi/English names
  - GST details and contact information
  - Real-time availability status
  - Place order functionality

- **Order Flow Screen**
  - Multi-step order placement (3 steps)
  - Multi-product selection with quantity controls
  - Shopping cart management
  - Price breakdown (Subtotal, GST 18%, Delivery Fee)
  - Order confirmation
  - Success notifications

- **User Account Screen**
  - **Orders Tab**: View order history with status tracking, view details, cancel orders
  - **Support Tab**: Create and track support tickets with live progress bars
  - **Saved Tab**: Manage favorite vendors
  - **Profile Tab**: Edit personal information

- **Customer Support System**
  - Create support tickets
  - Live progress tracking (0-100%)
  - Priority levels (Low, Medium, High)
  - Status tracking (Open, In Progress, Resolved, Closed)
  - Visual progress indicators

## 🎨 Design System

- **Color Scheme**: Accessible light green theme (#16a34a / green-600)
- **Typography**: 
  - Playfair Display for text content (implied in design)
  - San-serif for numeric values
- **UI Framework**: Material Design 3 principles
- **Platform**: Android-only mobile application

## 🏗️ Project Structure

```
react-native/
├── App.tsx                          # Main app entry with navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Main landing page with vendors
│   │   ├── VendorDetailsScreen.tsx  # Vendor information and products
│   │   ├── OrderFlowScreen.tsx      # Multi-step order placement
│   │   └── UserAccountScreen.tsx    # Account management with tabs
│   └── components/
│       └── BottomNavigation.tsx     # Bottom navigation bar
├── package.json                     # Dependencies and scripts
├── app.json                         # Expo configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

## 🚀 Setup Instructions

### Prerequisites

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/

2. **npm** or **yarn** package manager
   - Comes with Node.js installation

3. **Expo CLI** (recommended for easier setup)
   ```bash
   npm install -g expo-cli
   ```

4. **Android Studio** (for Android emulator)
   - Download from: https://developer.android.com/studio
   - Install Android SDK and create a virtual device (AVD)

5. **Physical Android Device** (alternative to emulator)
   - Install "Expo Go" app from Google Play Store
   - Enable USB debugging in developer options

### Installation Steps

1. **Navigate to the project directory**
   ```bash
   cd react-native
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on Android**

   **Option A: Using Android Emulator**
   - Make sure Android Studio emulator is running
   - Press `a` in the terminal or click "Run on Android device/emulator"
   ```bash
   npm run android
   ```

   **Option B: Using Physical Device**
   - Open "Expo Go" app on your Android device
   - Scan the QR code shown in terminal
   - Make sure both devices are on the same WiFi network

## 📦 Dependencies

### Core Dependencies
- **React** (18.2.0) - UI library
- **React Native** (0.74.5) - Mobile framework
- **Expo** (~51.0.28) - Development framework

### Navigation
- **@react-navigation/native** (^6.1.18) - Navigation library
- **@react-navigation/native-stack** (^6.10.1) - Stack navigator
- **react-native-screens** (~3.31.1) - Native screen components
- **react-native-safe-area-context** (4.10.5) - Safe area handling

### Development
- **TypeScript** (^5.1.3) - Type safety
- **@types/react** (~18.2.45) - React type definitions

## 📊 Data Structure

### Vendor Information
```typescript
interface Vendor {
  id: number;
  name: string;                  // e.g., "Sharma Fresh Fruits"
  category: string;              // "Fruits" or "Vegetables"
  rating: number;                // 1-5 stars
  distance: string;              // e.g., "2.5 km"
  address: string;               // Full Delhi address
  phone: string;                 // +91 format
  image: string;                 // Image URL
  isOpen: boolean;               // Business hours status
  gst: string;                   // GST number
  popularProducts: string[];
}
```

### Product Information
```typescript
interface Product {
  id: number;
  name: string;                  // English name
  nameHindi: string;             // Hindi name
  price: number;                 // In rupees (₹)
  unit: string;                  // "per kg", "per dozen", etc.
  image: string;                 // Image URL
  inStock: boolean;              // Availability
}
```

### Order Information
```typescript
interface Order {
  id: string;                    // e.g., "#ORD-1234"
  vendor: string;
  product: string;
  amount: number;                // In rupees (₹)
  date: string;
  status: string;                // "Delivered", "In Transit", "Cancelled"
  address?: string;
  phone?: string;
  paymentMethod?: string;
}
```

### Support Ticket Information
```typescript
interface SupportTicket {
  id: string;                    // e.g., "#TKT-5001"
  subject: string;
  description: string;
  category: string;              // "Order Issue", "Payment", "Refund"
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High';
  createdDate: string;
  lastUpdate: string;
  progress: number;              // 0-100
}
```

## 🎯 Key Features Explained

### 1. Multi-Step Order Flow
- **Step 1**: Select products and quantities
- **Step 2**: Review shopping cart
- **Step 3**: Confirm order with delivery details

### 2. Live Progress Tracking
- Visual progress bars showing ticket resolution status
- Color-coded based on progress percentage:
  - 🟠 Orange (0-49%): Just started
  - 🔵 Blue (50-99%): In progress
  - 🟢 Green (100%): Completed

### 3. Order Management
- View order history
- Track order status
- Cancel orders (if not delivered)
- View detailed order information

### 4. Support System
- Create support tickets
- Track multiple tickets
- Priority-based categorization
- Real-time status updates

## 🔧 Customization

### Changing Colors
Edit the color values in each screen's `StyleSheet`:
```typescript
// Example: Changing primary green color
backgroundColor: '#16a34a'  // Replace with your color
```

### Adding New Categories
Update the `categories` array in `HomeScreen.tsx`:
```typescript
const categories = [
  { id: 1, name: 'Fruits', icon: '🍎' },
  { id: 2, name: 'Vegetables', icon: '🥬' },
  { id: 3, name: 'Your Category', icon: '🛒' },
];
```

### Adding New Vendors
Update the `vendors` array in `HomeScreen.tsx` and `vendorData` in `VendorDetailsScreen.tsx`.

## 📱 Building for Production

### Android APK Build

1. **Configure app.json**
   - Update `name`, `slug`, and `package` identifiers

2. **Build APK using Expo**
   ```bash
   expo build:android -t apk
   ```

3. **Build AAB (for Play Store)**
   ```bash
   expo build:android -t app-bundle
   ```

4. **Using EAS Build (Recommended)**
   ```bash
   npm install -g eas-cli
   eas build -p android
   ```

## 🌐 Indian Localization

This app is fully localized for Indian market:
- ✅ Currency in Rupees (₹)
- ✅ Phone numbers in +91 format
- ✅ Delhi-based addresses
- ✅ GST instead of Tax
- ✅ Hindi/English product names
- ✅ Authentic Indian vendor names

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
# Clear cache
expo start -c
# or
npx react-native start --reset-cache
```

### Android Build Errors
```bash
# Clean build
cd android
./gradlew clean
cd ..
```

### Dependency Issues
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install
```

## 📞 Support

For issues or questions about this implementation:
- Check the code comments in each file
- Review the TypeScript interfaces for data structures
- Ensure all dependencies are properly installed

## 📄 License

This is a proprietary application for a multinational technology company.

## 🔄 Version History

- **v1.0.0** (January 2026)
  - Initial release
  - Complete vendor discovery platform
  - Multi-product order flow
  - Customer support ticketing system
  - Android-optimized UI with Material Design 3

---

**Note**: This application is designed exclusively for Android devices and follows Material Design 3 principles with a modern, minimal, professional B2B aesthetic.
