import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, storage } from '../firebaseConfig'; // Import storage
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage methods
import * as ImagePicker from 'expo-image-picker'; // Import image picker
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [userType, setUserType] = useState('employee');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    return passwordPattern.test(password);
  };

  const validateInput = () => {
    if (!username) {
      setError('Username is required');
      setModalVisible(true);
      return false;
    }
    if (!email) {
      setError('Email is required');
      setModalVisible(true);
      return false;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      setModalVisible(true);
      return false;
    }
    if (!password) {
      setError('Password is required');
      setModalVisible(true);
      return false;
    }
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long, include an uppercase letter and a symbol');
      setModalVisible(true);
      return false;
    }
    return true;
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePhoto(result.uri);
    }
  };

  const handleSignUp = async () => {
    if (!validateInput()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profilePhotoURL = '';
      if (profilePhoto) {
        const response = await fetch(profilePhoto);
        const blob = await response.blob();
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, blob);
        profilePhotoURL = await getDownloadURL(photoRef);
      }

      await setDoc(doc(db, 'Users', user.uid), {
        username,
        email,
        phoneNumber,
        address,
        jobTitle,
        bio,
        userType,
        profilePhotoURL,
      });

      if (profilePhotoURL) {
        await user.updateProfile({
          displayName: username,
          photoURL: profilePhotoURL,
        });
      } else {
        await user.updateProfile({
          displayName: username,
        });
      }

      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('The email address is already in use by another account.');
      } else {
        setError(error.message);
      }
      setModalVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Join Us</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Job Title"
          value={jobTitle}
          onChangeText={setJobTitle}
        />
        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
        />
        <Picker
          selectedValue={userType}
          style={styles.picker}
          onValueChange={(itemValue) => setUserType(itemValue)}
        >
          <Picker.Item label="Employee" value="employee" />
          <Picker.Item label="Employer" value="employer" />
        </Picker>
        <TouchableOpacity onPress={handlePickImage} style={styles.photoButton}>
          <Text style={styles.photoButtonText}>Pick a profile photo</Text>
        </TouchableOpacity>
        {profilePhoto && <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />}
        <Button title="Sign Up" onPress={handleSignUp} color="black" />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{error}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f8f8',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 12,
  },
  photoButtonText: {
    color: 'black',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    alignSelf: 'center',
  },
  loginText: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SignUpScreen;
