// JobDetailsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this import matches your file structure

const JobDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Access navigation prop
  const { jobId } = route.params || {}; // Extract jobId from params

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) {
        setError('No job ID provided');
        setLoading(false);
        return;
      }

      try {
        const jobDocRef = doc(db, 'jobs', jobId);
        const jobDoc = await getDoc(jobDocRef);

        if (jobDoc.exists()) {
          setJob(jobDoc.data());
        } else {
          setError('No job details available');
        }
      } catch (err) {
        setError('Error fetching job details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleApplyNow = () => {
    if (job) {
      navigation.navigate('ApplyJobScreen', { jobId }); // Navigate to ApplyJobScreen with jobId
    }
  };

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

  if (!job) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No job details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* Example image, you can replace it with a company logo or other relevant image */}
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
          style={styles.companyImage}
        />
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.company}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Job Details</Text>
        <Text style={styles.location}>{job.location}, {job.province}</Text>
        <Text style={styles.type}>Type: {job.type}</Text>
        <Text style={styles.salary}>Salary: ${job.salary}</Text>
        <Text style={styles.coordinates}>Coordinates: {job.latitude}, {job.longitude}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Apply Now" onPress={handleApplyNow} color="#007bff" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  companyImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  company: {
    fontSize: 20,
    color: '#666',
    marginBottom: 16,
  },
  detailsContainer: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#777',
    marginBottom: 8,
  },
  type: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  salary: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  coordinates: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 16,
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
});

export default JobDetailsScreen;
