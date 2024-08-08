import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Modal, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Update path as needed
import { getAuth } from 'firebase/auth';

const CompanyDetailsScreen = ({ route, navigation }) => {
  const { title, company, location, province, city, type, salary, latitude, longitude, resetAddJobScreen } = route.params;

  const [companyDetails, setCompanyDetails] = useState({
    phone: '',
    website: '',
    email: '',
    description: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // Fetch current user's email on component mount
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      const email = user.email;
      setUserEmail(email);
      console.log('Logged-in user email:', email); // Log the user's email
    } else {
      console.log('No user is logged in');
    }
  }, []);

  const validateFields = () => {
    const { phone, website, email, description } = companyDetails;

    // Basic validation
    if (!phone || !website || !email || !description) {
      setErrorMessage('Please fill all required fields.');
      setModalVisible(true);
      return false;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setModalVisible(true);
      return false;
    }

    // Validate phone number format (basic validation)
    const phonePattern = /^[0-9]{10,15}$/;
    if (!phonePattern.test(phone)) {
      setErrorMessage('Please enter a valid phone number.');
      setModalVisible(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      try {
        await addDoc(collection(db, 'jobs'), {
          title,
          company,
          location,
          province,
          city,
          type,
          salary,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          companyDetails,
          createdBy: userEmail, // Save the logged-in user's email
        });

        // Clear fields and navigate back
        setCompanyDetails({
          phone: '',
          website: '',
          email: '',
          description: '',
        });

        if (resetAddJobScreen) {
          resetAddJobScreen(); // Reset fields in AddJobScreen
        }

        navigation.goBack();
      } catch (error) {
        console.error('Error adding job:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.section}>
          <Text style={styles.label}>Company Phone</Text>
          <TextInput
            style={styles.input}
            placeholder="Company Phone"
            value={companyDetails.phone}
            onChangeText={(text) => setCompanyDetails({ ...companyDetails, phone: text })}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Company Website</Text>
          <TextInput
            style={styles.input}
            placeholder="Company Website"
            value={companyDetails.website}
            onChangeText={(text) => setCompanyDetails({ ...companyDetails, website: text })}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Company Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Company Email"
            value={companyDetails.email}
            onChangeText={(text) => setCompanyDetails({ ...companyDetails, email: text })}
            keyboardType="email-address"
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Company Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Company Description"
            value={companyDetails.description}
            onChangeText={(text) => setCompanyDetails({ ...companyDetails, description: text })}
            multiline
          />
        </View>
        <View style={styles.section}>
          <Button title="Submit" onPress={handleSubmit} color="#2196F3" />
        </View>
      </ScrollView>

      {/* Error Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
  },
  section: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333', // Dark text color for better readability
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // White background for input fields
    color: '#333', // Dark text color for better readability
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
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
    color: '#333', // Dark text color for better readability
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CompanyDetailsScreen;
