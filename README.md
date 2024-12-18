# Currency-convertor-react-native
# 💱 Currency Converter React Native App

## 🌟 Overview
A powerful, user-friendly mobile application for real-time currency conversion with advanced features like favorites, conversion history, and persistent data storage.

## ✨ Features
- **Real-time Currency Conversion**
  - Convert between 100+ global currencies
  - Up-to-date exchange rates
  - Supports numeric input with decimal precision

- **Favorite Currency Pairs**
  - Save frequently used currency conversion pairs
  - Quick access to preferred conversions
  - Long-press to remove favorites

- **Conversion History**
  - Track last 20 conversion attempts
  - Timestamps for each conversion
  - One-tap clear history option

- **User-Friendly Interface**
  - Intuitive design
  - Currency swap functionality
  - Responsive layout

## 🛠 Technology Stack
- React Native
- AsyncStorage for local data persistence
- Exchange Rate API for real-time rates

## 📦 Prerequisites
- Node.js (v14 or later)
- npm or Yarn
- React Native CLI
- Android Studio or Xcode
- Expo CLI (optional but recommended)

## 🚀 Installation Guide

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/currency-converter.git
cd currency-converter
```

### 2. Install Dependencies
```bash
# Install main dependencies
npm install

# Install additional required packages
npm install @react-native-async-storage/async-storage
npm install react-native-picker-select
```

### 3. Configure Exchange Rate API
1. Sign up at [Exchange Rate API](https://www.exchangerate-api.com/)
2. Get your API key
3. Replace `API_KEY` in the source code

### 4. Run the Application
```bash
# For Android
npx react-native run-android

# For iOS
npx react-native run-ios

# Using Expo
expo start
```

## 🔧 Troubleshooting
- **API Connection Issues**
  - Check internet connectivity
  - Verify API key validity
  - Ensure latest API endpoint is used

- **Installation Problems**
  - Update React Native CLI
  - Reinstall node_modules
  - Check compatibility of dependencies

## 📱 App Walkthrough
![Screenshot](picture/1.png)
![Screenshot](picture/2.png)
![Alt text](picture/3.webm)


### Main Screen
- Enter amount to convert
- Select source and destination currencies
- Press "Convert" to get real-time results

### Favorites Section
- Tap "★ Add Favorite" to save currency pairs
- Tap saved pair to quickly switch currencies
- Long-press to remove from favorites

### Conversion History
- View last 20 conversions
- Clear history with one tap
- Includes date and time of conversion

## 🔒 Permissions
- Internet access for fetching exchange rates
- Local storage access for saving preferences

## 🌐 Supported Currencies
- Over 100 global currencies
- Real-time exchange rates
- Sorted alphabetically for easy selection

## 🔮 Future Roadmap
- Offline mode with cached rates
- Additional currency conversion charts
- More sophisticated filtering options

## 📝 Notes
- Rates updated via API call
- Conversion accuracy depends on external API
- Recommended to have stable internet connection

## 💡 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit changes
4. Push to the branch
5. Create pull request

## 📃 License
MIT License

## 🙌 Acknowledgements
- Exchange Rate API
- React Native Community
- Open Source Contributors