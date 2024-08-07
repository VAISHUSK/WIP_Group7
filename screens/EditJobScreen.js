// EditJobScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Modal, TouchableOpacity } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Update path as needed

const EditJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params;
  const [jobDetails, setJobDetails] = useState({
    title: '',
    company: '',
    location: '',
    province: '',
    city: '',
    type: '',
    salary: '',
    description: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobDoc = doc(db, 'jobs', jobId);
        const docSnap = await getDoc(jobDoc);
        if (docSnap.exists()) {
          setJobDetails(docSnap.data());
        }
      } catch (error) {
        setErrorMessage('Error fetching job details');
        setModalVisible(true);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'jobs', jobId), jobDetails);
      navigation.goBack();
    } catch (error) {
      setErrorMessage('Error updating job details');
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Form fields for editing job details */}
      <Text style={styles.label}>Job Title</Text>
      <TextInput
        style={styles.input}
        value={jobDetails.title}
        onChangeText={(text) => setJobDetails({ ...jobDetails, title: text })}
      />
      {/* Add similar fields for other job details */}
      <Button title="Update" onPress={handleUpdate} color="#2196F3" />

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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditJobScreen;
