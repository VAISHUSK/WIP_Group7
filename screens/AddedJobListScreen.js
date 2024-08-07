import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { collection, query, where, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Update path as needed
import { getAuth } from 'firebase/auth';

const AddedJobListScreen = ({ navigation }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userEmail = user.email;
      const jobsQuery = query(collection(db, 'jobs'), where('createdBy', '==', userEmail));

      const unsubscribe = onSnapshot(jobsQuery, (querySnapshot) => {
        const jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsList);
        setLoading(false);
      }, (err) => {
        setError('Error fetching jobs');
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, []);

  const handleEdit = (jobId) => {
    navigation.navigate('EditJob', { jobId });
  };

  const handleDelete = async (jobId) => {
    Alert.alert(
      'Delete Job',
      'Are you sure you want to delete this job?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: async () => {
            try {
              await deleteDoc(doc(db, 'jobs', jobId));
            } catch (error) {
              setError('Error deleting job');
            }
          }
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {jobs.length === 0 ? (
        <View style={styles.noJobsContainer}>
          <Text style={styles.noJobsText}>No jobs found</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.jobContainer}>
              <View style={styles.jobDetails}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.jobDescription}>{item.description}</Text>
                <Text style={styles.jobLocation}>Location: {item.location}</Text>
                <Text style={styles.jobSalary}>Salary: {item.salary}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 18,
    margin: 20,
  },
  noJobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noJobsText: {
    fontSize: 18,
    color: '#888',
    fontStyle: 'italic',
  },
  jobContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  jobDetails: {
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  jobDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  jobLocation: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  jobSalary: {
    fontSize: 16,
    color: '#444',
    marginBottom: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddedJobListScreen;
