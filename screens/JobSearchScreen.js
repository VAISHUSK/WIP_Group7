import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo icons

const JobSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const q = searchQuery ? query(collection(db, 'jobs'), where('title', '==', searchQuery)) : collection(db, 'jobs');
      const querySnapshot = await getDocs(q);
      const jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsList);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const renderJob = ({ item }) => (
    <TouchableOpacity style={styles.jobContainer}>
      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobCompany}>{item.company}</Text>
        <Text style={styles.jobLocation}>{item.location}</Text>
      </View>
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search Jobs"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchJobs}>
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: 'dodgerblue',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 5,
  },
  jobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  jobCompany: {
    color: '#666',
    marginBottom: 4,
  },
  jobLocation: {
    color: '#666',
  },
  applyButton: {
    backgroundColor: 'dodgerblue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default JobSearchScreen;
