import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this import matches your file structure

const JobDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = route.params || {};

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
      navigation.navigate('ApplyJobScreen', { jobId });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No job details available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Placeholder image URL
          style={styles.companyImage}
        />
        <Text style={styles.title}>{job.title}</Text>
        <Text style={styles.company}>{job.company}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Job Details</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Location:</Text> {job.location}, {job.province}</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Type:</Text> {job.type}</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Salary:</Text> ${job.salary}</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Description:</Text> {job.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Details</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Website:</Text> {job.companyDetails?.website}</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Email:</Text> {job.companyDetails?.email}</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Phone:</Text> {job.companyDetails?.phone}</Text>
        <Text style={styles.detailText}><Text style={styles.detailLabel}>Description:</Text> {job.companyDetails?.description}</Text>
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={handleApplyNow}>
        <Text style={styles.applyButtonText}>Apply Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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
  header: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  companyImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  company: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default JobDetailsScreen;
