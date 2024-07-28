import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Image, FlatList, Modal, Button, ScrollView } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../UserContext'; // Import the useUser hook
import AsyncStorage from '@react-native-async-storage/async-storage'; // Correctly import AsyncStorage

const PrivacyPolicyModal = ({ visible, onAccept }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
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
          <Button title="Accept" onPress={onAccept} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const LandingScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
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

  useEffect(() => {
    fetchSuggestions();
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    if (searchQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const q = query(
        collection(db, 'jobs'),
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const suggestionsList = querySnapshot.docs.map(doc => doc.data().title);
      setSuggestions(suggestionsList);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Navigate to job listings screen with the search query
      navigation.navigate('JobListings', { query: searchQuery });
    }
  };

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
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Jobs Daily</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for jobs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
      </View>
      {searchQuery ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Pressable style={styles.suggestion} onPress={() => handleSuggestionPress(item)}>
              <Text>{item}</Text>
            </Pressable>
          )}
        />
      ) : null}
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
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  searchButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
  },
});

export default LandingScreen;
