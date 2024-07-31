// screens/ApplicationsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const ApplicationsScreen = ({ route }) => {
  const { jobId } = route.params || {};
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      if (!jobId) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }

      try {
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('jobId', '==', jobId));
        const querySnapshot = await getDocs(q);

        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
      } catch (err) {
        setError('Error fetching applications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (applications.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noApplicationsText}>No applications found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={applications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.applicationContainer}>
            <Text style={styles.name}>Name: {item.name}</Text>
            <Text style={styles.email}>Email: {item.email}</Text>
            <Text style={styles.coverLetter}>Cover Letter: {item.coverLetter}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  noApplicationsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  applicationContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    marginBottom: 8,
  },
  coverLetter: {
    fontSize: 16,
  },
});

export default ApplicationsScreen;
