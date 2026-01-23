# Complete Setup Guide - React Native Android App

## 🎯 Step-by-Step Installation Guide

### Step 1: Install Node.js

1. Go to https://nodejs.org/
2. Download the **LTS version** (Long Term Support)
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Expo CLI (Easiest Method)

```bash
npm install -g expo-cli
```

Verify installation:
```bash
expo --version
```

### Step 3: Set Up Android Environment

#### Option A: Using Android Studio (Recommended)

1. **Download Android Studio**
   - Visit: https://developer.android.com/studio
   - Download and install

2. **Install Android SDK**
   - Open Android Studio
   - Go to: Tools → SDK Manager
   - Install:
     - Android SDK Platform 33 or higher
     - Android SDK Build-Tools
     - Android Emulator

3. **Create Virtual Device (AVD)**
   - Open AVD Manager: Tools → Device Manager
   - Click "Create Device"
   - Select a device (e.g., Pixel 5)
   - Select System Image (Android 13 or higher)
   - Finish setup
   - Launch the emulator

4. **Set Environment Variables**
   
   **Windows:**
   ```bash
   # Add to System Environment Variables:
   ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\Sdk
   
   # Add to PATH:
   %ANDROID_HOME%\platform-tools
   %ANDROID_HOME%\tools
   ```

   **macOS/Linux:**
   ```bash
   # Add to ~/.bash_profile or ~/.zshrc:
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

#### Option B: Using Physical Android Device

1. **Enable Developer Options**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Developer options will be enabled

2. **Enable USB Debugging**
   - Settings → Developer Options
   - Turn on "USB Debugging"

3. **Install Expo Go App**
   - Open Google Play Store
   - Search for "Expo Go"
   - Install the app

### Step 4: Install Project Dependencies

1. **Navigate to project folder**
   ```bash
   cd react-native
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```

   This will install:
   - React & React Native
   - Expo framework
   - React Navigation
   - All other required packages

### Step 5: Start Development Server

```bash
npm start
```

Or:
```bash
expo start
```

You'll see a QR code and menu options.

### Step 6: Run on Android

#### Option A: Using Android Emulator

1. Make sure your Android Virtual Device is running
2. In the terminal, press `a`
   
   Or run:
   ```bash
   npm run android
   ```

#### Option B: Using Physical Device

1. Make sure your phone and computer are on the **same WiFi network**
2. Open "Expo Go" app on your Android device
3. Scan the QR code shown in terminal
4. App will load on your device

## 🔍 Verification Checklist

After installation, verify everything works:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Expo CLI installed (`expo --version`)
- [ ] Android Studio installed (if using emulator)
- [ ] Project dependencies installed (no errors in `npm install`)
- [ ] Development server starts without errors (`npm start`)
- [ ] App runs on Android device/emulator

## 📱 Testing the Application

Once the app loads, you should see:

1. **Home Screen**
   - Green header with "Deliver to Saket, New Delhi"
   - Profile icon in top-right
   - Categories (All, Fruits, Vegetables)
   - Popular Picks section
   - List of vendors with images

2. **Bottom Navigation**
   - Home icon (🏠)
   - Orders icon (📦)
   - Profile icon (👤)

### Test Flow:

1. **Browse Vendors**
   - Tap on any vendor card
   - View vendor details and products

2. **Place Order**
   - Tap "Place Order" button
   - Add products to cart
   - Review cart
   - Confirm order

3. **View Account**
   - Tap Profile icon in bottom nav
   - Check all 4 tabs: Orders, Support, Saved, Profile

4. **Create Support Ticket**
   - Go to Support tab
   - Tap "Create New Support Ticket"
   - Fill in details and submit

## 🐛 Common Issues & Solutions

### Issue 1: Metro Bundler Won't Start

**Solution:**
```bash
# Clear cache and restart
expo start -c
```

### Issue 2: "Unable to connect to development server"

**Solutions:**
- Make sure phone and computer are on same WiFi
- Disable firewall temporarily
- Try running: `expo start --tunnel`

### Issue 3: Android Emulator Not Detected

**Solutions:**
- Make sure emulator is running before starting expo
- Check ANDROID_HOME environment variable
- Restart Android Studio

### Issue 4: Dependencies Installation Errors

**Solution:**
```bash
# Remove and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Issue 5: TypeScript Errors

**Solution:**
```bash
# Install TypeScript types
npm install --save-dev @types/react @types/react-native
```

## 🔧 Development Tools

### Recommended VS Code Extensions

1. **React Native Tools** - Microsoft
2. **ES7+ React/Redux/React-Native snippets**
3. **Prettier - Code formatter**
4. **ESLint**

### Debugging

1. **In-App Developer Menu**
   - Android Emulator: Ctrl + M (Windows) or Cmd + M (Mac)
   - Physical Device: Shake the device

2. **Chrome DevTools**
   - In Developer Menu, select "Debug Remote JS"
   - Opens Chrome with console and debugger

3. **React Native Debugger**
   - Download: https://github.com/jhen0409/react-native-debugger
   - Standalone debugging tool with Redux DevTools

## 📦 Building Production APK

### Method 1: Using Expo Build Service

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure Build**
   ```bash
   eas build:configure
   ```

4. **Build APK**
   ```bash
   eas build -p android --profile preview
   ```

5. **Download APK**
   - APK will be available in your Expo account
   - You'll receive a download link

### Method 2: Local Build (Advanced)

1. **Eject from Expo**
   ```bash
   expo eject
   ```

2. **Build with Gradle**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Find APK**
   - Location: `android/app/build/outputs/apk/release/app-release.apk`

## 🌐 Deploying to Google Play Store

1. **Create Developer Account**
   - Visit: https://play.google.com/console
   - Pay one-time $25 fee

2. **Generate Signed APK/AAB**
   ```bash
   eas build -p android --profile production
   ```

3. **Create App Listing**
   - Fill in app details
   - Add screenshots
   - Upload APK/AAB

4. **Submit for Review**

## 📝 Project Customization

### Changing App Name

1. **Edit app.json**
   ```json
   {
     "expo": {
       "name": "Your App Name",
       "slug": "your-app-slug"
     }
   }
   ```

### Changing App Icon

1. Create 1024x1024px PNG image
2. Save as `assets/icon.png`
3. Run:
   ```bash
   expo build:android
   ```

### Changing Package Name

**Edit app.json:**
```json
{
  "android": {
    "package": "com.yourcompany.yourapp"
  }
}
```

## 🎨 Styling Customization

### Change Primary Color

Find and replace `#16a34a` (green) with your color:

**Example locations:**
- `src/screens/HomeScreen.tsx` - Header background
- `src/screens/OrderFlowScreen.tsx` - Buttons
- `src/components/BottomNavigation.tsx` - Active state

### Change Font

React Native uses system fonts by default. To add custom fonts:

1. **Install expo-font**
   ```bash
   expo install expo-font
   ```

2. **Add font files** to `assets/fonts/`

3. **Load fonts in App.tsx**
   ```typescript
   import * as Font from 'expo-font';
   
   await Font.loadAsync({
     'PlayfairDisplay': require('./assets/fonts/PlayfairDisplay.ttf'),
   });
   ```

## 💡 Tips for Development

1. **Fast Refresh**
   - Enabled by default
   - Saves time during development
   - Preserves component state

2. **Hot Reloading**
   - Changes reflect immediately
   - No need to rebuild entire app

3. **Console Logs**
   - Use `console.log()` for debugging
   - View in terminal or Chrome DevTools

4. **Performance**
   - Use `React.memo()` for expensive components
   - Avoid inline functions in render
   - Use FlatList for long lists

## 📚 Learning Resources

### Official Documentation
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/

### Video Tutorials
- React Native Tutorial for Beginners (YouTube)
- Expo Crash Course (YouTube)

### Communities
- React Native Discord
- Stack Overflow (tag: react-native)
- Reddit: r/reactnative

## ✅ Next Steps

After successful setup:

1. ✅ Explore the app features
2. ✅ Review the code structure
3. ✅ Customize colors and branding
4. ✅ Add your own vendor data
5. ✅ Test on multiple Android devices
6. ✅ Build production APK
7. ✅ Deploy to Play Store

---

**Congratulations!** 🎉 Your React Native Android app is ready for development!

For any issues, refer to the troubleshooting section above or check the official React Native documentation.
