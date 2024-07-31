import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
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
  const [suggestions, setSuggestions] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    fetchSuggestions();
  }, [searchQuery]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      let q = collection(db, 'jobs');

      if (searchQuery) {
        q = query(
          q,
          where('title', '>=', searchQuery),
          where('title', '<=', searchQuery + '\uf8ff')
        );
      }

      const querySnapshot = await getDocs(q);
      let jobsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (filters.jobType && filters.jobType !== 'Any') jobsList = jobsList.filter(job => job.type === filters.jobType);
      if (filters.salary && filters.salary !== 'Any') jobsList = jobsList.filter(job => job.salary === filters.salary);
      if (filters.location) jobsList = jobsList.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
      if (filters.province && filters.province !== 'Any') jobsList = jobsList.filter(job => job.province === filters.province);

      if (jobsList.length === 0) {
        setError('No jobs found');
      }

      setJobs(jobsList);
    } catch (error) {
      setError('Error fetching jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    if (searchQuery.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const q = query(
        collection(db, 'jobs'),
        where('title', '>=', searchQuery),
        where('title', '<=', searchQuery + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const suggestionsList = querySnapshot.docs.map(doc => doc.data().title);
      setSuggestions(suggestionsList);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
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
          onChangeText={(text) => {
            setSearchQuery(text);
            fetchSuggestions();
          }}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchJobs}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSearchQuery(suggestion);
                fetchJobs();
              }}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.filterButton}>
          <Ionicons name="options" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsListView(!isListView)} style={styles.viewToggleButton}>
          <Ionicons name={isListView ? "map" : "list"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" style={styles.loadingIndicator} />
      ) : error ? (
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
              <Picker.Item label="Full-Time" value="Full-Time" />
              <Picker.Item label="Part-Time" value="Part-Time" />
              <Picker.Item label="Internship" value="Internship" />
              <Picker.Item label="Contract" value="Contract" />
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
            <Text style={styles.sliderValue}>{filters.kmRange} km</Text>
            <TouchableOpacity
              onPress={() => {
                fetchJobs();
                setModalVisible(false);
              }}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
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
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
  },
  searchButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    marginLeft: 10,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  suggestionText: {
    padding: 10,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  viewToggleButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 4,
  },
  map: {
    flex: 1,
  },
  jobContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  jobDetails: {
    padding: 10,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 16,
    color: '#888',
  },
  jobLocation: {
    fontSize: 14,
    color: '#555',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  picker: {
    width: '100%',
    height: 50,
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  sliderValue: {
    marginBottom: 20,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default JobSearchScreen;
