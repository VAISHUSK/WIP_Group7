import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

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

const AddJobScreen = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [province, setProvince] = useState('Any');
  const [type, setType] = useState('Part-Time');
  const [salary, setSalary] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        company,
        location,
        province,
        type,
        salary,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      // Clear fields after submission
      setTitle('');
      setCompany('');
      setLocation('');
      setProvince('Any');
      setType('Part-Time');
      setSalary('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Job Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={title}
        onChangeText={setTitle}
      />
      <Text style={styles.label}>Company</Text>
      <TextInput
        style={styles.input}
        placeholder="Company Name"
        value={company}
        onChangeText={setCompany}
      />
      <Text style={styles.label}>Location</Text>
      <TextInput
        style={styles.input}
        placeholder="City or Address"
        value={location}
        onChangeText={setLocation}
      />
      <Text style={styles.label}>Province</Text>
      <Picker
        selectedValue={province}
        onValueChange={(itemValue) => setProvince(itemValue)}
        style={styles.picker}
      >
        {provinces.map((prov) => (
          <Picker.Item key={prov.value} label={prov.label} value={prov.value} />
        ))}
      </Picker>
      <Text style={styles.label}>Job Type</Text>
      <Picker
        selectedValue={type}
        onValueChange={(itemValue) => setType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Part-Time" value="Part-Time" />
        <Picker.Item label="Contract" value="Contract" />
        <Picker.Item label="Internship" value="Internship" />
      </Picker>
      <Text style={styles.label}>Salary</Text>
      <TextInput
        style={styles.input}
        placeholder="Salary"
        value={salary}
        onChangeText={setSalary}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Latitude</Text>
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Longitude</Text>
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />
      <Button title="Add Job" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
