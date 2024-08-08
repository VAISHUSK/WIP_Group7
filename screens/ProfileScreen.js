import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Avatar, Button, Divider, Icon } from 'react-native-elements';
import { auth, db } from '../firebaseConfig'; // Import auth and db from your firebaseConfig
import { doc, onSnapshot } from 'firebase/firestore'; // Import necessary Firestore methods

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;
  
  useEffect(() => {
    if (user) {
      const userDoc = doc(db, 'Users', user.uid);

      const unsubscribe = onSnapshot(userDoc, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUserData(docSnapshot.data());
        }
        setLoading(false);
      }, (error) => {
        console.error('Error fetching user data: ', error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login'); // Navigate to your Login screen
    } catch (error) {
      console.error('Logout Error: ', error);
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
  }

  const {
    photoURL = require('../assets/default-avatar.png'),
    fullName = 'Full Name',
    email = 'User Email',
    phoneNumber = 'Phone Number',
    address = 'Address',
    jobTitle = 'Job Title',
    bio = 'Bio',
  } = userData || {};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Avatar
          size="xlarge"
          rounded
          source={typeof photoURL === 'string' ? { uri: photoURL } : photoURL}
          containerStyle={styles.avatar}
        />
        <Text style={styles.userName}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>
        <Divider style={styles.divider} />

        <View style={styles.infoContainer}>
          <Icon name="phone" type="font-awesome" color="#2D9CDB" style={styles.icon} />
          <Text style={styles.infoText}>{phoneNumber}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="map-marker" type="font-awesome" color="#2D9CDB" style={styles.icon} />
          <Text style={styles.infoText}>{address}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="briefcase" type="font-awesome" color="#2D9CDB" style={styles.icon} />
          <Text style={styles.infoText}>{jobTitle}</Text>
        </View>

        <Text style={styles.bioHeader}>Bio</Text>
        <Text style={styles.bioText}>{bio}</Text>
        <Divider style={styles.divider} />

        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          buttonStyle={styles.editButton}
          containerStyle={styles.buttonContainer}
        />
        <Button
          title="Logout"
          onPress={handleLogout}
          buttonStyle={styles.logoutButton}
          containerStyle={styles.buttonContainer}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#E0F7FA', // Sky blue background
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0277BD', // Darker blue for text
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#0277BD', // Darker blue for email
    marginBottom: 20,
  },
  divider: {
    backgroundColor: '#B3E5FC', // Light blue for divider
    height: 1,
    width: '100%',
    marginVertical: 15,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#FFFFFF', // White background for info containers
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
  },
  bioHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0277BD', // Darker blue for bio header
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  bioText: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 20,
    textAlign: 'left',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#0288D1', // Bright blue for edit button
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: '#D32F2F', // Red for logout button
    borderRadius: 5,
  },
});

export default ProfileScreen;
