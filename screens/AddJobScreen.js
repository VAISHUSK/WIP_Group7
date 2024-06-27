import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

const AddJobScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [salary, setSalary] = useState('');
  const [type, setType] = useState('Full-Time');
  const [remote, setRemote] = useState(false);

  const handleAddJob = async () => {
    try {
      await addDoc(collection(db, 'jobs'), {
        title,
        company,
        location,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        salary: parseFloat(salary),
        type,
        remote,
      });
      navigation.navigate('JobSearch'); // Navigate back to job search screen
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Job</Text>
      <TextInput
        style={styles.input}
        placeholder="Job Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Company"
        value={company}
        onChangeText={setCompany}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude"
        value={latitude}
        keyboardType="numeric"
        onChangeText={setLatitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude"
        value={longitude}
        keyboardType="numeric"
        onChangeText={setLongitude}
      />
      <TextInput
        style={styles.input}
        placeholder="Salary"
        value={salary}
        keyboardType="numeric"
        onChangeText={setSalary}
      />
      <Text style={styles.label}>Job Type</Text>
      <Picker
        selectedValue={type}
        onValueChange={value => setType(value)}
        style={styles.picker}
      >
        <Picker.Item label="Full-Time" value="Full-Time" />
        <Picker.Item label="Part-Time" value="Part-Time" />
        <Picker.Item label="Contract" value="Contract" />
        <Picker.Item label="Internship" value="Internship" />
      </Picker>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setRemote(!remote)}
      >
        <Text style={styles.checkboxLabel}>Remote</Text>
        <View style={styles.checkbox}>
          {remote && <View style={styles.checkboxTick} />}
        </View>
      </TouchableOpacity>
      <Button title="Add Job" onPress={handleAddJob} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  checkboxTick: {
    width: 14,
    height: 14,
    backgroundColor: 'dodgerblue',
    borderRadius: 3,
  },
  checkboxLabel: {
    fontSize: 16,
  },
});

export default AddJobScreen;
