import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Button } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this import matches your file structure
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext'; // Import your UserContext

const ViewApplicationsScreen = () => {
  const [applications, setApplications] = useState([]);
  const navigation = useNavigation();
  const { user, loading } = useUser(); // Get user from UserContext

  useEffect(() => {
    if (loading) {
      console.log('Loading user data...');
      return;
    }

    if (!user) {
      console.log('No user is logged in.');
      return;
    }

    console.log('Logged in user email:', user.email); // Log the user email

    // Function to fetch applications created by the logged-in user
    const fetchApplications = async () => {
      try {
        const applicationsRef = collection(db, 'applications');
        const q = query(
          applicationsRef,
          where('createdBy', '==', user.email) // Compare createdBy with logged-in user's email
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const apps = [];
          querySnapshot.forEach((doc) => {
            apps.push({ id: doc.id, ...doc.data() });
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
      <View style={styles.header}>
        <Text style={styles.headerText}>Applications</Text>
      </View>

      <View style={styles.listContainer}>
        {applications.length > 0 ? (
          applications.map((app) => (
            <TouchableOpacity
              key={app.id}
              style={styles.application}
              onPress={() => navigation.navigate('ApplicationDetails', { applicationId: app.id })}
            >
              <Text style={styles.label}>Name: {app.applicantName}</Text>
              <Text style={styles.label}>Email: {app.applicantEmail}</Text>
              {app.resume && <Text style={styles.label}>Resume: {app.resume}</Text>}
              {app.coverLetter && <Text style={styles.label}>Cover Letter: {app.coverLetter}</Text>}
              <View style={styles.separator} />
              <View style={styles.statusContainer}>
                <Button
                  title="Interview"
                  onPress={() => handleStatusChange(app.id, 'Interview')}
                />
                <Button
                  title="Offer"
                  onPress={() => handleStatusChange(app.id, 'Offer')}
                />
                <Button
                  title="Rejected"
                  onPress={() => handleStatusChange(app.id, 'Rejected')}
                />
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noApplications}>No applications yet.</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007bff',
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  application: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
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
    color: '#888',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default ViewApplicationsScreen;
