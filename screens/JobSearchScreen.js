import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Pressable } from 'react-native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const JobSearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [isListView, setIsListView] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    jobType: 'Any',
    salaryMin: 0,
    salaryMax: 100000,
    location: '',
    province: 'Any',
    kmRange: 10,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapRegion, setMapRegion] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  useEffect(() => {
    fetchSuggestions();
  }, [searchQuery]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

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
      if (filters.salaryMin || filters.salaryMax) jobsList = jobsList.filter(job => job.salary >= filters.salaryMin && job.salary <= filters.salaryMax);
      if (filters.province && filters.province !== 'Any') jobsList = jobsList.filter(job => job.province === filters.province);

      if (jobsList.length === 0) {
        setError('No jobs found');
      } else {
        setError('');
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
            ListEmptyComponent={<Text style={styles.errorText}>No jobs found</Text>}
          />
        ) : (
          mapRegion && (
            <MapView
              style={styles.map}
              region={mapRegion}
              onRegionChangeComplete={region => setMapRegion(region)}
            >
              {renderMapMarkers()}
            </MapView>
          )
        )
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
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
              <Text style={styles.filterLabel}>Salary Range</Text>
              <View style={styles.salaryRangeContainer}>
                <Text style={styles.filterLabel}>Min</Text>
                <TextInput
                  style={styles.salaryInput}
                  keyboardType="numeric"
                  value={filters.salaryMin.toString()}
                  onChangeText={text => setFilters({ ...filters, salaryMin: parseInt(text) })}
                />
                <Text style={styles.filterLabel}>Max</Text>
                <TextInput
                  style={styles.salaryInput}
                  keyboardType="numeric"
                  value={filters.salaryMax.toString()}
                  onChangeText={text => setFilters({ ...filters, salaryMax: parseInt(text) })}
                />
              </View>
              <Text style={styles.filterLabel}>Location</Text>
              <Picker
                selectedValue={filters.location}
                onValueChange={location => setFilters({ ...filters, location })}
                style={styles.picker}
              >
                {/* Populate with a list of cities from Canada */}
                <Picker.Item label="Toronto" value="Toronto" />
                <Picker.Item label="Vancouver" value="Vancouver" />
                <Picker.Item label="Montreal" value="Montreal" />
                <Picker.Item label="Calgary" value="Calgary" />
                <Picker.Item label="Edmonton" value="Edmonton" />
                {/* Add more cities as needed */}
              </Picker>
              <Text style={styles.filterLabel}>Province</Text>
              <Picker
                selectedValue={filters.province}
                onValueChange={province => setFilters({ ...filters, province })}
                style={styles.picker}
              >
                <Picker.Item label="Any" value="Any" />
                <Picker.Item label="ON" value="ON" />
                <Picker.Item label="QC" value="QC" />
                <Picker.Item label="BC" value="BC" />
                <Picker.Item label="AB" value="AB" />
                {/* Add more provinces as needed */}
              </Picker>
              <Text style={styles.filterLabel}>Distance (km)</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={50}
                step={1}
                value={filters.kmRange}
                onValueChange={value => setFilters({ ...filters, kmRange: value })}
                minimumTrackTintColor="#007bff"
                maximumTrackTintColor="#000000"
              />
              <Text style={styles.filterLabel}>{filters.kmRange} km</Text>
              <TouchableOpacity style={styles.applyButton} onPress={() => {
                setModalVisible(false);
                fetchJobs();
              }}>
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
  },
  searchButton: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
    marginLeft: 8,
  },
  suggestionsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  suggestionText: {
    padding: 5,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  filterButton: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  viewToggleButton: {
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  map: {
    flex: 1,
  },
  jobContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  jobDetails: {
    flexDirection: 'column',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  jobCompany: {
    fontSize: 16,
    color: '#555',
  },
  jobLocation: {
    fontSize: 14,
    color: '#888',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'red',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 500,
  },
  modalContent: {
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  salaryRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  salaryInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    width: '45%',
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 10,
  },
  applyButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default JobSearchScreen;
