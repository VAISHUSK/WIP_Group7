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

      // Cleanup the listener on component unmount
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
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1 }} />;
  }

  // Use default parameters for destructuring userData
  const {
    photoURL = require('../assets/default-avatar.png'), // Default image path
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
          source={typeof photoURL === 'string' ? { uri: photoURL } : photoURL} // Conditional source
          containerStyle={styles.avatar}
        />
        <Text style={styles.userName}>{fullName}</Text>
        <Text style={styles.email}>{email}</Text>
        <Divider style={styles.divider} />

        <View style={styles.infoContainer}>
          <Icon name="phone" type="font-awesome" color="gray" style={styles.icon} />
          <Text style={styles.infoText}>{phoneNumber}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="map-marker" type="font-awesome" color="gray" style={styles.icon} />
          <Text style={styles.infoText}>{address}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="briefcase" type="font-awesome" color="gray" style={styles.icon} />
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
    backgroundColor: '#f8f8f8',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  avatar: {
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  divider: {
    backgroundColor: '#ddd',
    height: 1,
    width: '100%',
    marginVertical: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 18,
    color: '#555',
  },
  bioHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    color: '#333',
  },
  bioText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'left',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: 'dodgerblue',
    borderRadius: 5,
  },
  logoutButton: {
    backgroundColor: 'crimson',
    borderRadius: 5,
  },
});

export default ProfileScreen;
