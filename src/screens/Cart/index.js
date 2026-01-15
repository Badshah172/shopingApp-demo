import React, { useState, useEffect } from 'react';
import { 
  Image, StyleSheet, Text, TouchableOpacity, View, 
  FlatList, SafeAreaView, Dimensions, Platform
} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../../../Helper/StorageService';
import { cartManager } from '../../../Helper/CartManager';
import { placeOrderDB } from '../../../Helper/db';
const { width } = Dimensions.get('window');

// Data IDs must match HomeScreen (h1, h2, etc.) and CategoriesScreen (1, 2, etc.)
const ALL_PRODUCTS = [
  { id: '1', name: 'National Biryani 39g Single Pack', price: '122', img: require('../../assets/lays.png') },
  { id: '2', name: 'Bazaar Select Red Chilli Powder 50g', price: '50', img: require('../../assets/garlic.png') },
  { id: '3', name: 'Premium Mix Spices 100g', price: '48', img: require('../../assets/oreo.png') },
  { id: '4', name: 'Vim Dishwash Liquid 500ml', price: '250', img: require('../../assets/tropi.png') },
  { id: '5', name: 'Dalda Cooking Oil 1Ltr', price: '550', img: require('../../assets/canyy.png') },
  { id: '6', name: 'Bazaar Select Ajwain 50g', price: '59', img: require('../../assets/oreo.png') },
  { id: 'h1', name: 'Malta', price: '12.50', img: require('../../assets/orange.png') },
  { id: 'h2', name: 'Garlic', price: '17.00', img: require('../../assets/garlic.png') },
  { id: 'h3', name: 'Lays Chips', price: '50.00', img: require('../../assets/lays.png') },
  { id: 'h4', name: 'Oreo Biscuits', price: '30.00', img: require('../../assets/oreo.png') },
];

const Cart = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});

  // 1. Data Load Function
  const loadCartData = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('user_cart');
      if (savedCart) {
        const parsedQty = JSON.parse(savedCart);
        setCartQuantities(parsedQty);

        // Filter products that have quantity > 0
        const itemsInCart = ALL_PRODUCTS.filter(p => parsedQty[p.id] > 0);
        setCartItems(itemsInCart);
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.log("Load Error:", e);
    }
  };

  // 2. Initial Load & Subscription
  useEffect(() => {
    loadCartData();
    const unsub = cartManager.subscribe(() => loadCartData());
    return () => unsub();
  }, []);

  // 3. Increment / Decrement
  const handleUpdate = async (id, delta) => {
    await StorageService.updateCart(id, delta);
    loadCartData(); // Reload UI
  };

  // 4. Remove Item (Zero quantity)
  const removeItem = async (id) => {
    const currentQty = cartQuantities[id] || 0;
    await StorageService.updateCart(id, -currentQty);
    loadCartData();
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const qty = cartQuantities[item.id] || 0;
      return total + (parseFloat(item.price) * qty);
    }, 0).toFixed(2);
  };
const handlePlaceOrder = async () => {
    try {
      const total = calculateTotal();
      const lat = 24.8607; 
      const lng = 67.0011;

      const orderId = await placeOrderDB(total, lat, lng);
      console.log("Order Placed ID:", orderId);

      // Navigate command
      navigation.navigate('OrderDetailScreen', { 
        orderId: cartItems.id, 
        total: total 
      });
    } catch (error) {
      console.log("Navigation Error:", error);
    }
  };
  const renderItem = ({ item }) => (
    <View style={styles.cartCard}>
      <View style={styles.imgBadge}>
        <Image source={item.img} style={styles.productImage} resizeMode="contain" />
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.topRow}>
          <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <View style={styles.closeCircle}><AntIcon name="close" size={14} color="#000" /></View>
          </TouchableOpacity>
        </View>
        <Text style={styles.weightText}>Standard Pack</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>Rs. {item.price}</Text>
          <View style={styles.counterWrapper}>
            <TouchableOpacity onPress={() => handleUpdate(item.id, -1)} style={styles.stepBtn}>
              <AntIcon name="minus" size={14} color="black" />
            </TouchableOpacity>
            <Text style={styles.qtyLabel}>{cartQuantities[item.id]}</Text>
            <TouchableOpacity onPress={() => handleUpdate(item.id, 1)} style={styles.stepBtn}>
              <AntIcon name="plus" size={14} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <IonIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Review Cart</Text>
          <Text style={styles.headerSub}>{cartItems.length} Items</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listPadding}
          />
          <View style={styles.footerCard}>
             <View style={styles.summaryRow}>
                <Text style={styles.grandLabel}>Grand Total</Text>
                <Text style={styles.grandPrice}>Rs. {calculateTotal()}</Text>
              </View>
            <TouchableOpacity style={styles.mainBtn} 
            onPress={handlePlaceOrder}
            activeOpacity={0.9}>
              <View style={styles.btnContent}>
                <Text style={styles.btnText}>Place Order</Text>
                <IonIcons name="chevron-forward" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Your bag is empty!</Text>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.shopNow}>
             <Text style={{color: 'white', fontWeight: 'bold'}}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

// Styles remain the same as your previous code...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: 'white' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  headerSub: { fontSize: 12, color: '#888' },
  backBtn: { padding: 8, backgroundColor: '#F5F5F5', borderRadius: 12 },
  listPadding: { padding: 16 },
  cartCard: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 20, padding: 12, marginBottom: 16, elevation: 3 },
  imgBadge: { width: 90, height: 90, backgroundColor: '#F9FAFB', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  productImage: { width: '80%', height: '80%' },
  detailsContainer: { flex: 1, marginLeft: 16, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  productName: { fontSize: 14, fontWeight: '700', flex: 1 },
  closeCircle: { backgroundColor: '#FFF0F0', padding: 5, borderRadius: 20 },
  weightText: { fontSize: 11, color: '#999' },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontSize: 16, fontWeight: '800' },
 
  counterWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', borderRadius: 10, padding: 4 },
  stepBtn: { backgroundColor: 'white', padding: 5, borderRadius: 5 },
  qtyLabel: { marginHorizontal: 10, fontWeight: 'bold' },
footerCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    // Bottom navigation ke liye margin/padding adjust karein
    paddingBottom: Platform.OS === 'ios' ? 80 : 80, 
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  grandLabel: { fontSize: 18, fontWeight: 'bold' },
  grandPrice: { fontSize: 18, fontWeight: 'bold', color: '#40AA54' },
  mainBtn: { backgroundColor: '#1A1A1A', borderRadius: 15, padding: 15 },
  btnContent: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 10 },
  emptyBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#888' },
  shopNow: { backgroundColor: '#40AA54', padding: 15, borderRadius: 10, marginTop: 20 }
});

export default Cart;