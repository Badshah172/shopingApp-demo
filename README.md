📱 BMM App

A modern React Native mobile application bootstrapped using @react-native-community/cli, following a clean and scalable folder structure with reusable components, navigation stacks, and local data handling.

🚀 Tech Stack

React Native (CLI)

JavaScript

React Navigation

Metro Bundler

Android & iOS Support

📂 Project Structure
src/
 ├── navigation/
 │    ├── AuthStack.js        # Authentication flow
 │    ├── BottomTabs.js       # Bottom tab navigation
 │    └── AppStack.js         # Main app navigation
 │
 ├── screens/
 │    ├── LoginScreen.js      # User login screen
 │    ├── HomeScreen.js       # Home/dashboard screen
 │    ├── CartScreen.js       # Cart management
 │    └── OrderDetailScreen.js# Order details view
 │
 ├── database/
 │    └── db.js               # Local database logic
 │
 ├── storage/
 │    └── storage.js          # Async/local storage helpers
 │
 ├── data/
 │    └── products.js         # Static product data
 │
 └── components/
      └── ProductCard.js      # Reusable UI component

⚙️ Prerequisites

Make sure the following are installed before running the project:

Node.js

npm or Yarn

Android Studio (for Android)

Xcode (for iOS – macOS only)

React Native CLI environment setup
👉 https://reactnative.dev/docs/set-up-your-environment

▶️ Getting Started
1️⃣ Install Dependencies
npm install
# OR
yarn install

2️⃣ Start Metro Server
npm start
# OR
yarn start

3️⃣ Run the App
📱 Android
npm run android
# OR
yarn android

🍎 iOS

Install CocoaPods dependencies (first time only):

bundle install
bundle exec pod install


Then run:

npm run ios
# OR
yarn ios

🔁 Fast Refresh

Changes are reflected automatically using Fast Refresh.

Manual Reload:

Android: Press R twice or Ctrl + M

iOS: Press R in simulator

🛠️ Customization

Edit the main entry file:

App.tsx


Save changes and see them instantly in the app.

🧪 Troubleshooting

If you face any issues:

Clear cache:

npx react-native start --reset-cache


Rebuild project

Check environment setup
👉 https://reactnative.dev/docs/troubleshooting

📚 Learn More

React Native Docs: https://reactnative.dev

Navigation: https://reactnavigation.org

GitHub Repo: https://github.com/facebook/react-native

👨‍💻 Author

Syed Hassnain ALi Shah App
Developed with ❤️ using React Native
