import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Button, Divider } from 'react-native-elements';
import { auth } from '../firebaseConfig'; // Import auth from your firebaseConfig

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login'); // Navigate to your Login screen
    } catch (error) {
      console.error('Logout Error: ', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Display user profile information */}
        <Text style={styles.header}>Profile</Text>
        <Avatar
          size="xlarge"
          rounded
          title="Avatar"
          source={user ? { uri: user.photoURL } : null} // Use user's photo URL if available
          containerStyle={styles.avatar}
        />
        <Text style={styles.userName}>{user ? user.displayName : 'User Name'}</Text>
        <Text style={styles.email}>{user ? user.email : 'User Email'}</Text>
        <Divider style={styles.divider} />
        {/* Include user's name, email, photo, etc. */}
        <Button
          title="Logout"
          onPress={handleLogout}
          buttonStyle={styles.logoutButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatar: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  divider: {
    backgroundColor: 'gray',
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'crimson',
    width: 200,
    borderRadius: 5,
  },
});

export default ProfileScreen;
