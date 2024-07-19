import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const JobSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isListView, setIsListView] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    jobType: 'Any',
    salary: 'Any',
    location: '',
    province: 'Any',
    kmRange: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const navigation = useNavigation();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      let q = collection(db, 'jobs');

      if (searchQuery) {
        q = query(q, where('title', '==', searchQuery));
      }

      const querySnapshot = await getDocs(q);
      let jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (filters.jobType && filters.jobType !== 'Any') jobsList = jobsList.filter(job => job.type === filters.jobType);
      if (filters.salary && filters.salary !== 'Any') jobsList = jobsList.filter(job => job.salary === filters.salary);
      if (filters.location) jobsList = jobsList.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
      if (filters.province && filters.province !== 'Any') jobsList = jobsList.filter(job => job.province === filters.province);

      setJobs(jobsList);
    } catch (error) {
      setError('Error fetching jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderJob = ({ item }) => (
    <TouchableOpacity
      style={styles.jobContainer}
      onPress={() => navigation.navigate('JobDetails', { jobId: item.id })}
    >
      <View style={styles.jobDetails}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobCompany}>{item.company}</Text>
        <Text style={styles.jobLocation}>{item.location}, {item.province}</Text>
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
      description={`${job.company} - ${job.location}, ${job.province}`}
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
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        isListView ? (
          <FlatList
            data={jobs}
            renderItem={renderJob}
            keyExtractor={item => item.id}
          />
        ) : (
          <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={region => setMapRegion(region)}
          >
            {renderMapMarkers()}
          </MapView>
        )
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
            <Text style={styles.filterLabel}>Job Type</Text>
            <Picker
              selectedValue={filters.jobType}
              onValueChange={jobType => setFilters({ ...filters, jobType })}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="Any" />
              <Picker.Item label="Part-Time" value="Part-Time" />
              <Picker.Item label="Contract" value="Contract" />
              <Picker.Item label="Internship" value="Internship" />
            </Picker>
            <Text style={styles.filterLabel}>Salary</Text>
            <Picker
              selectedValue={filters.salary}
              onValueChange={salary => setFilters({ ...filters, salary })}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="Any" />
              <Picker.Item label="$30,000" value="30000" />
              <Picker.Item label="$50,000" value="50000" />
              <Picker.Item label="$70,000" value="70000" />
              <Picker.Item label="$90,000" value="90000" />
            </Picker>
            <Text style={styles.filterLabel}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="City or Address"
              value={filters.location}
              onChangeText={location => setFilters({ ...filters, location })}
            />
            <Text style={styles.filterLabel}>Province</Text>
            <Picker
              selectedValue={filters.province}
              onValueChange={province => setFilters({ ...filters, province })}
              style={styles.picker}
            >
              <Picker.Item label="Any" value="Any" />
              <Picker.Item label="Alberta" value="AB" />
              <Picker.Item label="British Columbia" value="BC" />
              <Picker.Item label="Manitoba" value="MB" />
              <Picker.Item label="New Brunswick" value="NB" />
              <Picker.Item label="Newfoundland and Labrador" value="NL" />
              <Picker.Item label="Northwest Territories" value="NT" />
              <Picker.Item label="Nova Scotia" value="NS" />
              <Picker.Item label="Nunavut" value="NU" />
              <Picker.Item label="Ontario" value="ON" />
              <Picker.Item label="Prince Edward Island" value="PE" />
              <Picker.Item label="Quebec" value="QC" />
              <Picker.Item label="Saskatchewan" value="SK" />
              <Picker.Item label="Yukon" value="YT" />
            </Picker>
            <Text style={styles.filterLabel}>Distance (km)</Text>
            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={100}
              step={1}
              value={filters.kmRange}
              onValueChange={kmRange => setFilters({ ...filters, kmRange })}
            />
            <Text>Distance: {filters.kmRange} km</Text>
            <TouchableOpacity
              style={styles.applyFilterButton}
              onPress={() => {
                fetchJobs();
                setModalVisible(false);
              }}
            >
              <Text style={styles.applyFilterButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  searchButton: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 4,
    marginLeft: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 4,
  },
  viewToggleButton: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 4,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
  },
  jobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
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
    fontSize: 14,
    color: '#777',
  },
  applyButton: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 4,
  },
  applyText: {
    color: 'white',
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    width: '100%',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  slider: {
    width: '100%',
    height: 40,
    marginVertical: 10,
  },
  applyFilterButton: {
    backgroundColor: 'dodgerblue',
    padding: 10,
    borderRadius: 4,
    marginTop: 20,
  },
  applyFilterButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default JobSearchScreen;
