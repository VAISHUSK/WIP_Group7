import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Image, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { auth, db, storage } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'Users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
          setEmail(userData.email);
          setBio(userData.bio);
          setPhoneNumber(userData.phoneNumber);
          setProfilePhoto(userData.profilePhotoURL);
        }
      }
    };
    fetchUserData();
  }, []);

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

  const handleSave = async () => {
    if (!username || !email || !bio || !phoneNumber) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }

    setLoading(true);
    try {
      let profilePhotoURL = profilePhoto;
      const user = auth.currentUser;

      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      if (profilePhoto && !profilePhoto.startsWith('http')) {
        const response = await fetch(profilePhoto);
        const blob = await response.blob();
        const photoRef = ref(storage, `profilePhotos/${user.uid}`);
        await uploadBytes(photoRef, blob);
        profilePhotoURL = await getDownloadURL(photoRef);
      }

      const updatedData = {
        username,
        email,
        bio,
        phoneNumber,
      };

      if (profilePhotoURL) {
        updatedData.profilePhotoURL = profilePhotoURL;
      }

      await updateDoc(doc(db, 'Users', user.uid), updatedData);

      if (user.updateProfile) {
        await user.updateProfile({
          displayName: username,
          photoURL: profilePhotoURL || user.photoURL,
        });
      }

      // Navigate back to the ProfileScreen
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TouchableOpacity onPress={handlePickImage} style={styles.photoButton}>
        <Text style={styles.photoButtonText}>Change Profile Photo</Text>
      </TouchableOpacity>
      {profilePhoto && <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />}
      <Button title="Save" onPress={handleSave} color="black" disabled={loading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
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
});

export default EditProfileScreen;
