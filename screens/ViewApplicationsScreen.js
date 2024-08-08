import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import RNPickerSelect from 'react-native-picker-select';

const STATUS_OPTIONS = [
  { label: 'Interview', value: 'Interview' },
  { label: 'Offer', value: 'Offer' },
  { label: 'Rejected', value: 'Rejected' },
];

const ViewApplicationsScreen = () => {
  const [applications, setApplications] = useState([]);
  const navigation = useNavigation();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading || !user) return;

    const fetchApplications = async () => {
      try {
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('createdBy', '==', user.email));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const apps = [];
          querySnapshot.forEach((doc) => {
            const appData = { id: doc.id, ...doc.data() };
            apps.push(appData);
          });
          setApplications(apps);
        }, (error) => {
          console.error('Error fetching applications:', error);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [user, loading]);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const applicationRef = doc(db, 'applications', applicationId);
      await updateDoc(applicationRef, { status: newStatus });
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
        {applications.length > 0 ? (
          applications.map((app) => (
            <View key={app.id} style={styles.application}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ApplicationDetails', { applicationId: app.id })}
              >
                <Text style={styles.label}>Name: {app.applicantName}</Text>
                <Text style={styles.label}>Email: {app.applicantEmail}</Text>
                {app.resume && <Text style={styles.label}>Resume: {app.resume}</Text>}
                {app.coverLetter && <Text style={styles.label}>Cover Letter: {app.coverLetter}</Text>}
              </TouchableOpacity>
              <View style={styles.separator} />
              <View style={styles.statusContainer}>
                <RNPickerSelect
                  placeholder={{ label: 'Select status...', value: null }}
                  items={STATUS_OPTIONS}
                  onValueChange={(value) => handleStatusChange(app.id, value)}
                  value={app.status}
                  style={pickerSelectStyles}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noApplications}>No applications yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};

// Styles for the picker
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
  },
  inputAndroid: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#333',
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue background
  },
  listContainer: {
    padding: 16,
  },
  application: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  separator: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  noApplications: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  statusContainer: {
    marginTop: 10,
  },
});

export default ViewApplicationsScreen;
