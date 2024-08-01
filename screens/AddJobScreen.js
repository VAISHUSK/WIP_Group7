import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
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

  const handleSubmit = () => {
    // Navigate to the next screen to handle company details
    navigation.navigate('CompanyDetails', {
      title,
      company,
      location,
      province,
      city,
      type,
      salary,
      latitude,
      longitude,
    });
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
          { key: 'Location', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Location</Text>
              <GooglePlacesAutocomplete
                placeholder='Search for an address'
                onPress={handleAddressSelect}
                query={{ key: 'AIzaSyDi08rJ4cV1T-rTcvmWv5Nk_0o6AYfOyGw', language: 'en' }} // Replace with your API Key
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
          { key: 'Latitude', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Latitude</Text>
              <TextInput
                style={styles.input}
                placeholder="Latitude"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
            </View>
          )},
          { key: 'Longitude', component: (
            <View style={styles.section}>
              <Text style={styles.label}>Longitude</Text>
              <TextInput
                style={styles.input}
                placeholder="Longitude"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
            </View>
          )},
          { key: 'Submit', component: (
            <View style={styles.section}>
              <Button title="Next" onPress={handleSubmit} />
            </View>
          )},
        ]}
        renderItem={({ item }) => item.component}
        keyExtractor={item => item.key}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 32,
  },
  label: {
    marginVertical: 8,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
});

export default AddJobScreen;
