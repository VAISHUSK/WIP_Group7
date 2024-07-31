import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import { Picker } from '@react-native-picker/picker';

// Initialize Geocoder with your Google API Key
Geocoder.init('AIzaSyDi08rJ4cV1T-rTcvmWv5Nk_0o6AYfOyGw'); 

const provinces = [
  { label: 'Any', value: 'Any' },
  { label: 'Alberta', value: 'AB' },
  { label: 'British Columbia', value: 'BC' },
  { label: 'Manitoba', value: 'MB' },
  { label: 'New Brunswick', value: 'NB' },
  { label: 'Newfoundland and Labrador', value: 'NL' },
  { label: 'Northwest Territories', value: 'NT' },
  { label: 'Nova Scotia', value: 'NS' },
  { label: 'Nunavut', value: 'NU' },
  { label: 'Ontario', value: 'ON' },
  { label: 'Prince Edward Island', value: 'PE' },
  { label: 'Quebec', value: 'QC' },
  { label: 'Saskatchewan', value: 'SK' },
  { label: 'Yukon', value: 'YT' },
];

const AddJobScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('Any');
  const [type, setType] = useState('Part-Time');
  const [salary, setSalary] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddressSelect = async (data, details) => {
    const address = data.description;
    setLocation(address);
    try {
      const response = await Geocoder.from(address);
      const { lat, lng } = response.results[0].geometry.location;
      setLatitude(lat.toString());
      setLongitude(lng.toString());

      // Extract city and province
      const addressComponents = response.results[0].address_components;
      const cityComponent = addressComponents.find(component =>
        component.types.includes('locality') || component.types.includes('administrative_area_level_3')
      );
      const provinceComponent = addressComponents.find(component =>
        component.types.includes('administrative_area_level_1')
      );

      setCity(cityComponent ? cityComponent.long_name : '');
      setProvince(provinceComponent ? provinceComponent.short_name : 'Any');
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const validateFields = () => {
    if (!title || !company || !location || province === 'Any' || !salary || !description) {
      setErrorMessage('Please fill all required fields.');
      setModalVisible(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      navigation.navigate('CompanyDetails', {
        title,
        company,
        location,
        province,
        city,
        type,
        salary,
        description,
        latitude,
        longitude,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={[
          { key: 'Job Title', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Job Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Job Title"
                value={title}
                onChangeText={setTitle}
              />
            </View>
          )},
          { key: 'Company Name', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Company Name"
                value={company}
                onChangeText={setCompany}
              />
            </View>
          )},
          { key: 'Location', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Location</Text>
              <GooglePlacesAutocomplete  
                placeholder='Search for an address'        
                onPress={handleAddressSelect}
                fetchDetails={true}
                query={{ key: 'AIzaSyDi08rJ4cV1T-rTcvmWv5Nk_0o6AYfOyGw', language: 'en' }} 
                styles={{ textInput: styles.input }}
              />
            </View>
          )},
          { key: 'City', component: (
            <View style={styles.section}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
                editable={false} 
              />
            </View>
          )},
          { key: 'Province', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Province</Text>
              <Picker
                selectedValue={province}
                onValueChange={setProvince}
                style={styles.picker}
              >
                {provinces.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            </View>
          )},
          { key: 'Job Type', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Job Type</Text>
              <Picker
                selectedValue={type}
                onValueChange={setType}
                style={styles.picker}
              >
                <Picker.Item label="Part-Time" value="Part-Time" />
                <Picker.Item label="Contract" value="Contract" />
                <Picker.Item label="Internship" value="Internship" />
                <Picker.Item label="Full-Time" value="Full-Time" />
                <Picker.Item label="Permanent" value="Permanent" />
                <Picker.Item label="Temporary" value="Temporary" />
              </Picker>
            </View>
          )},
          { key: 'Salary', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Salary</Text>
              <TextInput
                style={styles.input}
                placeholder="Salary"
                value={salary}
                onChangeText={setSalary}
                keyboardType="numeric"
              />
            </View>
          )},
          { key: 'Job Description', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Job Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Job Description"
                value={description}
                onChangeText={setDescription}
                multiline={true}
              />
            </View>
          )},
          { key: 'Submit', component: (
            <View style={styles.section}>
              <Button title="Next" onPress={handleSubmit} color="#2196F3" />
            </View>
          )},
        ]}
        renderItem={({ item }) => item.component}
        keyExtractor={item => item.key}
      />

      {/* Error Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  section: {
    marginVertical: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color:'red',
  },
  closeButton: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddJobScreen;
