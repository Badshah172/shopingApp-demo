import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { saveUserToDB, initDB, db } from '../../../Helper/db';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Login = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    initDB();
    GoogleSignin.configure({
      webClientId:
        '989587562858-ma34s9jf7bihs39go9rqc96ufesndlfd.apps.googleusercontent.com',
    });
  }, []);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    // Thread/Memory Optimized Options
    const options = {
      mediaType: 'photo',
      quality: 0.2, // Mazeed kam kar di memory bachane ke liye
      maxWidth: 400, // Size mazeed chota karein
      maxHeight: 400,
      saveToPhotos: false,
      includeExtra: false,
    };

    launchCamera(options, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Camera Error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  // Google Login Method (Wapis Add kar diya)
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Google se aane wala data SQLite mein save karein
      await saveUserToDB(
        userInfo.user.name,
        userInfo.user.email,
        '', // Phone empty for Google
        userInfo.user.photo, // Profile photo from Google
      );
      await AsyncStorage.setItem('USER_LOGIN', 'true');

      navigation.replace('MainTabs');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Cancelled');
      } else {
        Alert.alert('Google Error', error.message||error.toString()||error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualSignup = async () => {
    if (!name || !phone || !imageUri) {
      Alert.alert('Missing Fields', 'Please complete your profile and photo.');
      return;
    }

    setLoading(true);
    try {
      // 4 arguments: name, email, phone, profile
      const result = await saveUserToDB(
        name,
        email || 'No Email',
        phone,
        imageUri,
      );
      console.log('User saved successfully ID:', result.insertId);
      await AsyncStorage.setItem('USER_LOGIN', 'true');
      navigation.replace('MainTabs');
    } catch (e) {
      console.log('Actual SQL Error:', e); // Ab yahan error dikhayega
      Alert.alert(
        'DB Error',
        'Table issue. Please Clear App Data and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png',
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Join our community</Text>
        </View>

        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.imagePicker} onPress={openCamera}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.capturedImage} />
            ) : (
              <View style={styles.placeholder}>
                <Icon name="camera" size={30} color="#3B82F6" />
                <Text style={styles.pickerText}>Take Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="user" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>
          <View style={styles.inputWrapper}>
            <Icon
              name="phone"
              size={20}
              color="#666"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.mainBtn}
          onPress={handleManualSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.mainBtnText}>Create Profile</Text>
              <Icon name="arrow-right" size={20} color="#FFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/300/300221.png',
            }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleText}>Sign in with Google</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: { alignItems: 'center', marginTop: 50, marginBottom: 20 },
  logo: { width: 80, height: 80, marginBottom: 15 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#777', marginTop: 5 },

  imageSection: { position: 'relative', marginBottom: 30 },
  imagePicker: {
    height: 120,
    width: 120,
    borderRadius: 60,
    backgroundColor: '#F0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  capturedImage: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  pickerText: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginTop: 5,
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
  },

  inputContainer: { width: width * 0.85 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FB',
    borderRadius: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 55, color: '#333', fontSize: 16 },

  mainBtn: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    width: width * 0.85,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  mainBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
    width: width * 0.8,
  },
  line: { flex: 1, height: 1, backgroundColor: '#EEE' },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 12,
    fontWeight: 'bold',
  },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    width: width * 0.85,
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    elevation: 1,
  },
  googleIcon: { width: 20, height: 20, marginRight: 12 },
  googleText: { fontSize: 16, fontWeight: '600', color: '#555' },
});

export default Login;
