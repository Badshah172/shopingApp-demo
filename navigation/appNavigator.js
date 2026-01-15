import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../src/screens/home';
import BottomNav from '../src/screens/BottomNavigation/BottomNav'; // File path sahi rakhein
import CartScreen from '../src/screens/Cart';
import Login from '../src/screens/Login';
import OrderDetailScreen from '../src/screens/OrderDetailScreen';

const Tab = createBottomTabNavigator();


const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNav {...props} />} // Aapka custom bottom bar yahan fix ho gaya
      screenOptions={{ headerShown: false }}
    >
      {/* <Tab.Screen name="Login" component={Login} /> */}
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="cart" component={CartScreen} />
      <Tab.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;