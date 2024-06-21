import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Button, CheckBox } from 'react-native-elements';

const JobSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isListView, setIsListView] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    remote: false,
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      const q = searchQuery ? query(collection(db, 'jobs'), where('title', '==', searchQuery)) : collection(db, 'jobs');
      const querySnapshot = await getDocs(q);
      let jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (filters.fullTime) jobsList = jobsList.filter(job => job.type === 'Full-Time');
      if (filters.partTime) jobsList = jobsList.filter(job => job.type === 'Part-Time');
      if (filters.remote) jobsList = jobsList.filter(job => job.remote);

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

  const renderMapMarkers = () => jobs.map(job => (
    <Marker
      key={job.id}
      coordinate={{ latitude: job.latitude, longitude: job.longitude }}
      title={job.title}
      description={`${job.company} - ${job.location}`}
    />
  ));

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
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
          <Ionicons name="options" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsListView(!isListView)} style={styles.viewToggleButton}>
          <Ionicons name={isListView ? "map" : "list"} size={24} color="white" />
        </TouchableOpacity>
      </View>
      {isListView ? (
        <FlatList
          data={jobs}
          renderItem={renderJob}
          keyExtractor={item => item.id}
        />
      ) : (
        <MapView style={styles.map}>
          {renderMapMarkers()}
        </MapView>
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filters</Text>
            <CheckBox
              title="Full-Time"
              checked={filters.fullTime}
              onPress={() => setFilters({ ...filters, fullTime: !filters.fullTime })}
            />
            <CheckBox
              title="Part-Time"
              checked={filters.partTime}
              onPress={() => setFilters({ ...filters, partTime: !filters.partTime })}
            />
            <CheckBox
              title="Remote"
              checked={filters.remote}
              onPress={() => setFilters({ ...filters, remote: !filters.remote })}
            />
            <Button
              title="Apply Filters"
              onPress={() => {
                fetchJobs();
                setModalVisible(false);
              }}
              buttonStyle={styles.applyFilterButton}
            />
          </View>
        </View>
      </Modal>
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: 'dodgerblue',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 5,
  },
  viewToggleButton: {
    backgroundColor: 'dodgerblue',
    paddingHorizontal: 16,
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
  map: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  applyFilterButton: {
    backgroundColor: 'dodgerblue',
    marginTop: 20,
  },
});

export default JobSearchScreen;
