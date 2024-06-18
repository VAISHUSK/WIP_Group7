import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
    <View style={styles.jobContainer}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text>{item.company}</Text>
      <Text>{item.location}</Text>
      <TouchableOpacity>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search Jobs"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Button title="Search" onPress={fetchJobs} />
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
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  jobContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  applyText: {
    color: 'blue',
    fontWeight: 'bold',
  },
});

export default JobSearchScreen;
