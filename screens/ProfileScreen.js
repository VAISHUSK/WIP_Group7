import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Avatar, Button, Divider, Icon } from 'react-native-elements';
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
        <Text style={styles.header}>Profile</Text>
        <Avatar
          size="xlarge"
          rounded
          source={user ? { uri: user.photoURL } : null} // Use user's photo URL if available
          containerStyle={styles.avatar}
        >
          <Avatar.Accessory size={30} />
        </Avatar>
        <Text style={styles.userName}>{user ? user.displayName : 'User Name'}</Text>
        <Text style={styles.email}>{user ? user.email : 'User Email'}</Text>
        <Divider style={styles.divider} />

        <View style={styles.infoContainer}>
          <Icon name="phone" type="font-awesome" color="gray" style={styles.icon} />
          <Text style={styles.infoText}>+123 456 7890</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="map-marker" type="font-awesome" color="gray" style={styles.icon} />
          <Text style={styles.infoText}>123 Job Street, Employment City, Jobland</Text>
        </View>
        <View style={styles.infoContainer}>
          <Icon name="briefcase" type="font-awesome" color="gray" style={styles.icon} />
          <Text style={styles.infoText}>Software Developer at TechCorp</Text>
        </View>

        <Text style={styles.bioHeader}>Bio</Text>
        <Text style={styles.bioText}>
          Experienced software developer with a passion for building innovative solutions. Skilled in React Native, JavaScript, and Firebase.
        </Text>
        <Divider style={styles.divider} />

        <Button
          title="Edit Profile"
          onPress={() => navigation.navigate('EditProfile')}
          buttonStyle={styles.editButton}
        />
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
    shadowRadius: 2,
    elevation: 2,
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
  editButton: {
    backgroundColor: 'dodgerblue',
    width: 200,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: 'crimson',
    width: 200,
    borderRadius: 5,
  },
});

export default ProfileScreen;
