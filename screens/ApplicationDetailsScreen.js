import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this import matches your file structure

const ApplicationDetailsScreen = ({ route, navigation }) => {
  const { applicationId } = route.params || {};
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const docRef = doc(db, 'applications', applicationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApplication(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };

    fetchApplication();
  }, [applicationId]);

  const handleStatusChange = async (newStatus) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, { status: newStatus });
      // Optionally navigate back or show a success message
      navigation.goBack();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  if (!application) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Name: {application.applicantName}</Text>
        <Text style={styles.label}>Email: {application.applicantEmail}</Text>
        {application.resume && <Text style={styles.label}>Resume: {application.resume}</Text>}
        {application.coverLetter && <Text style={styles.label}>Cover Letter: {application.coverLetter}</Text>}
        <Text style={styles.label}>Status: {application.status}</Text>
        <View style={styles.statusContainer}>
          <Button title="Interview" onPress={() => handleStatusChange('Interview')} />
          <Button title="Offer" onPress={() => handleStatusChange('Offer')} />
          <Button title="Rejected" onPress={() => handleStatusChange('Rejected')} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  detailsContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});

export default ApplicationDetailsScreen;
