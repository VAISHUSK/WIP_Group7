import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Button, CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';  
import { Slider } from 'react-native-elements';

const JobSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isListView, setIsListView] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    fullTime: false,
    partTime: false,
    remote: false,
    salaryRange: [0, 100000],
    jobType: 'Any',
    kmRange: 10,
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
      if (filters.salaryRange) jobsList = jobsList.filter(job => job.salary >= filters.salaryRange[0] && job.salary <= filters.salaryRange[1]);
      if (filters.jobType && filters.jobType !== 'Any') jobsList = jobsList.filter(job => job.type === filters.jobType);

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
            <Text style={styles.filterLabel}>Salary Range</Text>
            <TextInput
              style={styles.input}
              placeholder="Min Salary"
              value={String(filters.salaryRange[0])}
              keyboardType="numeric"
              onChangeText={min => setFilters({ ...filters, salaryRange: [Number(min), filters.salaryRange[1]] })}
            />
            <TextInput
              style={styles.input}
              placeholder="Max Salary"
              value={String(filters.salaryRange[1])}
              keyboardType="numeric"
              onChangeText={max => setFilters({ ...filters, salaryRange: [filters.salaryRange[0], Number(max)] })}
            />
            <Text style={styles.filterLabel}>Job Type</Text>
            <Picker
              selectedValue={filters.jobType}
              onValueChange={jobType => setFilters({ ...filters, jobType })}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="Any" />
              <Picker.Item label="Full-Time" value="Full-Time" />
              <Picker.Item label="Part-Time" value="Part-Time" />
              <Picker.Item label="Contract" value="Contract" />
              <Picker.Item label="Internship" value="Internship" />
            </Picker>
            <Text style={styles.filterLabel}>Distance (km)</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={100}
              step={1}
              value={filters.kmRange}
              onValueChange={value => setFilters({ ...filters, kmRange: value })}
              minimumTrackTintColor="dodgerblue"
              maximumTrackTintColor="#d3d3d3"
            />
            <Text>{filters.kmRange} km</Text>
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  jobDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 14,
    color: '#555',
  },
  jobLocation: {
    fontSize: 12,
    color: '#888',
  },
  applyButton: {
    backgroundColor: 'dodgerblue',
    padding: 8,
    borderRadius: 5,
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: Dimensions.get('window').width - 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    marginVertical: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  slider: {
    width: '100%',
    marginVertical: 10,
  },
  applyFilterButton: {
    backgroundColor: 'dodgerblue',
    borderRadius: 5,
  },
});

export default JobSearchScreen;
