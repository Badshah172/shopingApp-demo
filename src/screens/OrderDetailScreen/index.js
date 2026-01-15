import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const { width, height } = Dimensions.get('window');
const GOOGLE_MAPS_APIKEY = 'AIzaSyCsHJpv3t9YKFEsE1GwFgg0IXWaY4npxU4';

const OrderDetailScreen = ({ route }) => {
  const { orderId , total = 1200 } = route.params || {};
  const mapRef = useRef(null);

  // User / delivery destination
  const userLocation = { latitude: 33.6938, longitude: 73.0652 };

  // Courier live location
  const [courierLocation, setCourierLocation] = useState({ latitude: 33.6844, longitude: 73.0479 });

  // Simulate courier moving
  useEffect(() => {
    const interval = setInterval(() => {
      setCourierLocation(prev => {
        const newLoc = {
          latitude: prev.latitude + (Math.random() - 0.5) * 0.0007,
          longitude: prev.longitude + (Math.random() - 0.5) * 0.0007,
        };

        // Animate map camera
        mapRef.current?.animateCamera({
          center: newLoc,
          zoom: 15,
        }, { duration: 1000 });

        return newLoc;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {/* Floating Status Card */}
      <View style={styles.statusCard}>
        <Text style={styles.orderIdText}>Order ID: #{orderId}</Text>
        <Text style={styles.statusText}>
          Status: <Text style={{ color: '#40AA54', fontWeight: 'bold' }}>On the way</Text>
        </Text>
        <Text style={styles.totalText}>Total Amount: Rs. {total}</Text>
        
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: 33.6880,
          longitude: 73.0560,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        {/* MapViewDirections for road route */}
        <MapViewDirections
          origin={courierLocation}
          destination={userLocation}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="#40AA54"
          optimizeWaypoints={true}
          onReady={result => {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: { top: 22, right: 50, bottom: 50, left: 50 },
            });
          }}
        />

        {/* Destination Marker */}
        <Marker coordinate={userLocation} title="Deliver Here" pinColor="blue" />

        {/* Courier Marker */}
        <Marker
          coordinate={courierLocation}
          tracksViewChanges={true} // Android ke liye zaroori
        >
          <View style={styles.courierMarker}>
            <Text style={styles.courierEmoji}>🚴</Text>
            <Text style={styles.courierText}>Courier</Text>
          </View>
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width, height },
  statusCard: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 10,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  orderIdText: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  statusText: { fontSize: 16, marginTop: 5, color: '#000' },
  totalText: { fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#000' },

  courierMarker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#40AA54',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
  },
  courierEmoji: { fontSize: 24 },
  courierText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});

export default OrderDetailScreen;
