import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity ,Dimensions} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartManager } from '../../../Helper/CartManager';

const BottomNav = ({ state, navigation }) => {
  const [cartCount, setCartCount] = useState(0);
if (!state) return null; 

  const activeIndex = state.index;
  const activeRouteName = state.routeNames[activeIndex];

  const updateCounts = async () => {
    const savedCart = await AsyncStorage.getItem('user_cart');
    
    if (savedCart) {
      setCartCount(Object.values(JSON.parse(savedCart)).reduce((a, b) => a + b, 0));
    }
  
  };

  useEffect(() => {
    updateCounts();
    const unsubCart = cartManager.subscribe(updateCounts);
    return () => { unsubCart();  };
  }, []);

  const navItems = [
    { name: 'Home', icon: 'home-outline', route: 'home' },
    { name: 'Cart', icon: 'cart-outline', route: 'cart', isCart: true },
 
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeRouteName === item.route;
        return (
          <TouchableOpacity 
            key={item.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View>
              <IonIcons 
                name={isActive ? item.icon.replace('-outline', '') : item.icon} 
                size={24} 
                color={isActive ? "#40AA54" : "#828282"} 
              />
              {(item.isCart && cartCount > 0) ? (
                <View style={[styles.badge, { backgroundColor:  '#40AA54' }]}>
                  <Text style={styles.badgeText}>{item.isCart && cartCount }</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.navLabel, isActive && styles.activeLabel]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    elevation: 20, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  navItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navLabel: { fontSize: 10, color: '#828282', marginTop: 4 },
  activeLabel: { color: '#40AA54', fontWeight: 'bold' },
  badge: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: '#40AA54',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' }
});

export default BottomNav;