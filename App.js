
import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './src/screens/home';
import Login from './src/screens/Login';
import CartScreen from './src/screens/Cart';
import SplashScreen from './src/screens/splashScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import { enableScreens } from 'react-native-screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

enableScreens(true);
const Tab = createBottomTabNavigator();

import MainTabs from './navigation/appNavigator';
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null means loading
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    const checkLogin = async () => {
      const status = await AsyncStorage.getItem('USER_LOGIN');
      setIsLoggedIn(status === 'true');
    };
    checkLogin();
  }, []);

  if (isLoggedIn === null) return <SplashScreen />; // Jab tak check ho raha hai

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName={isLoggedIn ? "MainTabs" : "Login"} 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="OrderDetailScreen" component={OrderDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
