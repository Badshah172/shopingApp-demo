import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
  FlatList,
} from 'react-native';
import HeaderComp from '../../components/Header';
import IonIcons from 'react-native-vector-icons/Ionicons';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../../../Helper/StorageService';
import { cartManager } from '../../../Helper/CartManager';
import { getUserFromDB } from '../../../Helper/db';
const { width } = Dimensions.get('window');
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
const ALL_PRODUCTS = [
  { id: 'h1', type: 'What\'s new', title: 'Malta', price: '12.50', weight: '4 Pic', rating: '4.5', img: require('../../assets/orange.png') },
  { id: 'h2', type: 'What\'s new', title: 'Garlic', price: '17.00', weight: '1 Kg', rating: '4.8', img: require('../../assets/garlic.png') },
  { id: 'h3', type: 'Popular pack', title: 'Lays Chips', price: '50.00', weight: 'Pack', rating: '4.2', img: require('../../assets/lays.png') },
  { id: 'h4', type: 'Top item', title: 'Oreo Biscuits', price: '30.00', weight: '1 Pic', rating: '4.9', img: require('../../assets/oreo.png') },
];

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("What's new");
  const [quantities, setQuantities] = useState({});
  const [activeCounterId, setActiveCounterId] = useState(null);
const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromDB();
      setUserData(user);
    };
    fetchUser();
  }, []);
  // --- Load Data ---
  const loadData = async () => {
    const savedCart = await AsyncStorage.getItem('user_cart');
    if (savedCart) setQuantities(JSON.parse(savedCart));
  };

  useEffect(() => {
    loadData();
    const unsub = cartManager.subscribe(loadData);
    return () => { unsub();  };
  }, []);

  // --- Handlers ---

  const handleAdd = async (id) => {
    await StorageService.updateCart(id, 1);
    setActiveCounterId(id);
  };

  const handleRemove = async (id) => {
    await StorageService.updateCart(id, -1);
    setActiveCounterId(id);
  };
  const handleLogout = async () => {
    // 1. AsyncStorage se login flag remove ya false set karo
    await AsyncStorage.setItem('USER_LOGIN', 'false');
    // 2. Navigation ko reset karo taki back press se wapas na aaye
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  // Filtered List based on Tab
  const displayProducts = ALL_PRODUCTS.filter(p => p.type === activeTab);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#40AA54" />
       {/* Responsive Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.userName}>{userData?.name || 'Guest'}</Text>
        </View>
        <Image 
          source={{ uri: userData?.profile || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
          style={styles.profileImg} 
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
       

        {/* Tabs Section */}
        <View style={styles.tabsContainer}>
          {["Popular pack", "Top item", "What's new"].map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)}>
              <Text style={activeTab === tab ? styles.tabActive : styles.tabFont}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Popular Products Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{activeTab}</Text>
        </View>

        <View style={styles.productGrid}>
          {displayProducts.map((item) => (
            <ProductCard 
              key={item.id}
              item={item}
              qty={quantities[item.id] || 0}
              isExpanded={activeCounterId === item.id}
              onAdd={() => handleAdd(item.id)}
              onRemove={() => handleRemove(item.id)}
              onExpand={() => setActiveCounterId(item.id)}
            />
          ))}
        </View>
        <View style={styles.bottomSpace}>
          <TouchableOpacity onPress={handleLogout}>
            <View style={{flexDirection: 'row',justifyContent: 'center', gap: 10, alignItems: 'center',marginTop: 20}}>
                 <SimpleLineIcons name="logout" color="#000" size={15} />
              <Text style={styles.userName}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ProductCard = ({ item, qty, isExpanded, onAdd, onRemove, onExpand, onPress }) => (
  <TouchableOpacity style={styles.productCard} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.cardHeader}>
    
    </View>
    
    <Image source={item.img} style={styles.productImg} resizeMode="contain" />
    
    <View style={styles.cardBody}>
      <View style={styles.titleRow}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <View style={styles.ratingBox}>
          <AntIcon name="star" color="#FFC107" size={12} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>
      <Text style={styles.weightText}>{item.weight}</Text>
      
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>Rs.{item.price}</Text>
        
        {/* Expandable Counter Design */}
          <View style={styles.expandedCounter}>
            <TouchableOpacity onPress={onAdd}>
              <Text style={styles.qtyText}>{`${qty<=0 ? "Add" : qty}`}</Text>
            </TouchableOpacity>
          </View>
      
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#FBFBFB' },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, alignItems: 'center', marginTop: 15 },
  searchBarContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 12, height: 50, marginRight: 10, elevation: 3 },
  input: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: '#16162E' },
  filterBtn: { backgroundColor: '#40AA54', width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 25, marginBottom: 10 },
  sectionTitle: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  seeAllText: { color: '#F33A63', fontSize: 14, fontWeight: '600' },
  categoryBox: { width: 75, height: 85, backgroundColor: 'white', borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2, borderWidth: 1, borderColor: '#F0F0F0' },
  categoryImg: { width: 35, height: 35, marginBottom: 5 },
  categoryText: { fontSize: 11, color: '#000', fontWeight: '500' },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 25 },
  tabFont: { fontSize: 14, color: '#828282' },
  tabActive: { fontSize: 14, color: '#40AA54', fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#40AA54', paddingBottom: 2 },
  salesList: { paddingLeft: 20 },
  salesCard: { width: 110, height: 110, backgroundColor: 'white', borderRadius: 15, marginRight: 15, padding: 10, borderWidth: 1, borderColor: '#EFEFEF', alignItems: 'center', justifyContent: 'center' },
  discountLabel: { position: 'absolute', top: 0, left: 10, backgroundColor: '#FF4646', paddingHorizontal: 8, borderBottomLeftRadius: 6, borderBottomRightRadius: 6 },
  discountText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  salesImg: { width: '80%', height: '80%' },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 20 },
  productCard: { backgroundColor: 'white', width: (width - 55) / 2, borderRadius: 20, padding: 12, marginBottom: 15, elevation: 4 },
  cardHeader: { alignItems: 'flex-end' },
  productImg: { width: '100%', height: 100, marginVertical: 5 },
  productTitle: { fontSize: 14, fontWeight: 'bold', color: '#16162E', flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingBox: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 11, color: '#16162E', marginLeft: 3 },
  weightText: { fontSize: 12, color: '#A0A0A0', marginTop: 2 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  priceText: { fontSize: 15, fontWeight: 'bold', color: '#16162E' },
  addBtn: { backgroundColor: '#40AA54', padding: 8, borderRadius: 10 },
  activeQtyBtn: { backgroundColor: '#16162E', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  activeQtyText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  expandedCounter: { 
    flexDirection: 'row', 
    backgroundColor: '#40AA54', 
    borderRadius: 20, 
    paddingHorizontal: 8, 
    paddingVertical: 5, 
    alignItems: 'center', 
    position: 'absolute', 
    right: -5, 
    bottom: -5, 
    elevation: 5,
    zIndex: 99
  },
  qtyText: { color: 'white', fontWeight: 'bold', marginHorizontal: 8, fontSize: 14 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#FFF' 
  },
  welcomeText: { fontSize: 14, color: '#888' },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A' },
  profileImg: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, borderColor: '#40AA54' },
  sectionTitle: { fontSize: 18, fontWeight: '800', margin: 20 }
});

export default HomeScreen;