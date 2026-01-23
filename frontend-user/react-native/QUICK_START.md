# 🚀 Quick Start Guide

## Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js (v18+) installed
- [ ] npm or yarn package manager
- [ ] Android Studio with emulator OR
- [ ] Android device with Expo Go app

## Installation (3 Simple Steps)

### 1️⃣ Install Dependencies

```bash
cd react-native
npm install
```

### 2️⃣ Start Development Server

```bash
npm start
```

### 3️⃣ Run on Android

**Using Emulator:**
```bash
# Press 'a' in terminal
# OR
npm run android
```

**Using Physical Device:**
- Open Expo Go app
- Scan QR code

## 📱 App Overview

### Main Features

1. **Home Screen** - Browse vendors by category
2. **Vendor Details** - View products and information
3. **Order Flow** - 3-step order placement system
4. **User Account** - Orders, Support, Saved vendors, Profile

### Sample Data Included

✅ **4 Vendors**
- Sharma Fresh Fruits
- Patel Organic Vegetables
- Kumar Tropical Fruits
- Singh Seasonal Vegetables

✅ **Multiple Products** with Hindi/English names

✅ **Sample Orders** with different statuses

✅ **Support Tickets** with progress tracking

## 🎨 Key Screens

### 1. Home Screen (`src/screens/HomeScreen.tsx`)
- Categories navigation
- Popular picks
- Vendor list with sorting
- Bottom navigation

### 2. Vendor Details (`src/screens/VendorDetailsScreen.tsx`)
- Vendor information
- Product catalog
- Place order button

### 3. Order Flow (`src/screens/OrderFlowScreen.tsx`)
- Step 1: Select products
- Step 2: Review cart
- Step 3: Confirm order

### 4. User Account (`src/screens/UserAccountScreen.tsx`)
- Orders tab with cancellation
- Support tab with ticket creation
- Saved vendors tab
- Profile editing tab

## 🔧 Quick Customization

### Change Primary Color
Find and replace `#16a34a` with your color

### Add New Vendor
Edit `vendors` array in `HomeScreen.tsx`:

```typescript
{
  id: 5,
  name: 'Your Vendor Name',
  category: 'Fruits',
  rating: 4.8,
  distance: '2.0 km',
  address: 'Your Address, Delhi',
  phone: '+91 98765 43214',
  image: 'https://your-image-url.jpg',
  isOpen: true,
  gst: 'GST: 07XXXXX1234X1Z5',
  popularProducts: ['Product1', 'Product2']
}
```

### Add New Product
Edit `products` array in `VendorDetailsScreen.tsx` or `OrderFlowScreen.tsx`:

```typescript
{
  id: 15,
  name: 'Product Name',
  nameHindi: 'उत्पाद नाम',
  price: 150,
  unit: 'per kg',
  image: 'https://your-image-url.jpg',
  inStock: true
}
```

## 📦 Project Structure

```
react-native/
│
├── App.tsx                  # Main entry point
│
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx           # Main landing page
│   │   ├── VendorDetailsScreen.tsx  # Vendor info & products
│   │   ├── OrderFlowScreen.tsx      # Order placement
│   │   └── UserAccountScreen.tsx    # Account management
│   │
│   └── components/
│       └── BottomNavigation.tsx     # Bottom nav bar
│
├── package.json             # Dependencies
├── app.json                 # Expo config
├── tsconfig.json            # TypeScript config
│
└── Documentation/
    ├── README.md            # Full documentation
    ├── SETUP_GUIDE.md       # Detailed setup
    └── QUICK_START.md       # This file
```

## 🐛 Troubleshooting

### App won't start?
```bash
expo start -c  # Clear cache
```

### Can't connect to server?
- Check same WiFi network
- Try: `expo start --tunnel`

### Build errors?
```bash
rm -rf node_modules
npm install
```

## 🎯 Testing Checklist

After installation, test these features:

- [ ] Browse vendors on home screen
- [ ] Filter by category (Fruits/Vegetables)
- [ ] Sort by distance/rating
- [ ] View vendor details
- [ ] Add products to cart
- [ ] Complete 3-step order flow
- [ ] View orders in account
- [ ] Create support ticket
- [ ] Cancel an order
- [ ] Edit profile information

## 📞 Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review `README.md` for complete documentation
3. Check React Native docs: https://reactnative.dev/
4. Check Expo docs: https://docs.expo.dev/

## 🔗 Important Files

| File | Purpose |
|------|---------|
| `App.tsx` | Navigation setup |
| `HomeScreen.tsx` | Vendor listing |
| `VendorDetailsScreen.tsx` | Product catalog |
| `OrderFlowScreen.tsx` | Shopping cart |
| `UserAccountScreen.tsx` | User management |
| `BottomNavigation.tsx` | Navigation bar |

## 📊 Data Management

All data is currently **hardcoded** for demonstration:
- Vendors list
- Products catalog
- Orders history
- Support tickets

**To connect to real API:**
1. Install axios: `npm install axios`
2. Replace hardcoded data with API calls
3. Add state management (Redux/Context API)

## 🚀 Ready to Deploy?

1. **Test thoroughly** on multiple devices
2. **Update app details** in `app.json`
3. **Build APK**: `eas build -p android`
4. **Test APK** on device
5. **Submit to Play Store**

---

## ⚡ Quick Commands Reference

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on Android
npm run android

# Clear cache
expo start -c

# Build APK
eas build -p android

# Check logs
npx react-native log-android
```

---

**That's it!** 🎉 You're ready to start developing!

The app is fully functional with all features working out of the box. Customize as needed for your use case.
