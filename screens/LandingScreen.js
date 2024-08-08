import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, FlatList, Modal, Button, ScrollView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../UserContext'; // Import the useUser hook
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correctly import AsyncStorage

const PrivacyPolicyModal = ({ visible, onAccept }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header}>Privacy Policy</Text>
          <Text style={styles.content}>
            Welcome to our Jobs Daily Application!

            {'\n\n'}

            Your privacy is important to us. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our app.

            {'\n\n'}

            1. **Information We Collect**: We collect information you provide to us directly, such as your name, email address, resume, and job application details. We also collect information about your interactions with the app, including job searches and applications.

            {'\n\n'}

            2. **How We Use Your Information**: We use your information to facilitate job searches, manage job applications, and provide you with job recommendations. Your information may also be used to communicate with you about job opportunities and updates.

            {'\n\n'}

            3. **Data Protection**: We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure.

            {'\n\n'}

            4. **Third-Party Services**: We may use third-party services to enhance your experience, such as analytics tools and job search engines. These services may have their own privacy policies.

            {'\n\n'}

            5. **Your Rights**: You have the right to access, correct, or delete your personal information. If you have any concerns about your data, please contact us at [Your Contact Email].

            {'\n\n'}

            By accepting this privacy policy, you acknowledge that you have read and understood our privacy practices.

            {'\n\n'}

            For more details, please refer to our full Privacy Policy on our website.
          </Text>
          <Button title="Accept" onPress={onAccept} color="black" />
        </ScrollView>
      </View>
    </Modal>
  );
};

const LandingScreen = ({ navigation }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser(); // Access user state from context

  useEffect(() => {
    const checkPrivacyPolicy = async () => {
      try {
        const accepted = await AsyncStorage.getItem('privacyPolicyAccepted');
        setPrivacyPolicyAccepted(accepted === 'true');
      } catch (error) {
        console.error('Failed to check privacy policy acceptance:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPrivacyPolicy();
  }, []);

  const handleSuggestionPress = (title) => {
    if (user) {
      // Navigate to job listings screen with the selected suggestion
      navigation.navigate('JobListings', { query: title });
    } else {
      // Redirect to login screen if not logged in
      navigation.navigate('Login');
    }
  };

  const handlePrivacyPolicyAccept = async () => {
    try {
      // Save the acceptance in AsyncStorage
      await AsyncStorage.setItem('privacyPolicyAccepted', 'true');
      setPrivacyPolicyAccepted(true); // Hide the modal
    } catch (error) {
      console.error('Failed to save privacy policy acceptance:', error);
    }
  };

  if (loading) {
    // Optionally display a loading spinner or message while loading
    return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>Jobs Daily</Text>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable style={styles.suggestion} onPress={() => handleSuggestionPress(item)}>
              <Text>{item}</Text>
            </Pressable>
          )}
        />
      )}
      <Pressable style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <PrivacyPolicyModal
        visible={!privacyPolicyAccepted}
        onAccept={handlePrivacyPolicyAccept}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#87CEEB', // Sky blue background color
    padding: 20,
  },
  imageContainer: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75, // Makes the image circular
    overflow: 'hidden', // Ensures image stays within the rounded container
    backgroundColor: '#87CEEB', // Background color to match the container
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75, // Matches the container's border radius
    opacity: 0.9, // Slightly transparent to blend with background
  },
  title: {
    fontSize: 36, // Increased font size
    fontWeight: 'bold', // Bold font weight
    color: 'white', // White color for better contrast
    marginBottom: 20,
    textShadowColor: '#000', // Black shadow for contrast
    textShadowOffset: { width: 2, height: 2 }, // Shadow offset
    textShadowRadius: 5, // Shadow blur radius
    fontFamily: 'Cochin', // Custom font family, replace with a custom font if available
  },
  suggestion: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
  button: {
    backgroundColor: 'black',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#87CEEB', // Sky blue background color
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
});

export default LandingScreen;
