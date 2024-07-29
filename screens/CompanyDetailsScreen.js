import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Update path as needed

const CompanyDetailsScreen = ({ route, navigation }) => {
  const { title, company, location, province, city, type, salary, latitude, longitude } = route.params;

  const [companyDetails, setCompanyDetails] = useState({
    name: '',
    address: '',
    phone: '',
    website: '',
  });

  const handleSubmit = async () => {
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
      });
      // Clear fields and navigate back to the home or job list
      setCompanyDetails({
        name: '',
        address: '',
        phone: '',
        website: '',
      });
      navigation.navigate('Home'); // Navigate to home or job list screen
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Company Details</Text>
      <Text style={styles.label}>Company Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={companyDetails.name}
        onChangeText={(text) => setCompanyDetails({ ...companyDetails, name: text })}
      />
      <Text style={styles.label}>Company Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Company Address"
        value={companyDetails.address}
        onChangeText={(text) => setCompanyDetails({ ...companyDetails, address: text })}
      />
      <Text style={styles.label}>Company Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Company Phone"
        value={companyDetails.phone}
        onChangeText={(text) => setCompanyDetails({ ...companyDetails, phone: text })}
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Company Website</Text>
      <TextInput
        style={styles.input}
        placeholder="Company Website"
        value={companyDetails.website}
        onChangeText={(text) => setCompanyDetails({ ...companyDetails, website: text })}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    marginVertical: 8,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
});

export default CompanyDetailsScreen;
