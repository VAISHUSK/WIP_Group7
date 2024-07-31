import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // For image selection
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this import matches your file structure

const ApplyJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params || {}; // Extract jobId from params
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [applying, setApplying] = useState(false);

  const handleResumeUpload = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
    if (!result.didCancel && result.assets && result.assets[0]) {
      setSelectedResume(result.assets[0].uri);
      setResume(result.assets[0].fileName);
    }
  };

  const handleSubmit = async () => {
    if (!name || !email) {
      alert('Please fill out all required fields.');
      return;
    }

    setApplying(true);
    try {
      await addDoc(collection(db, 'applications'), {
        jobId,
        applicantName: name,
        applicantEmail: email,
        resume: resume || null, // Allow for resume to be optional
        coverLetter,
        timestamp: new Date(),
      });

      alert('Application submitted successfully!');
      navigation.goBack(); // Navigate back to previous screen after submission
    } catch (err) {
      console.error('Error submitting application:', err);
      alert('Error submitting application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://via.placeholder.com/150' }} // Replace with relevant image or logo
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>Apply for Job</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Resume (Optional, PDF or DOC)</Text>
        <View style={styles.resumeContainer}>
          <Button title="Upload Resume" onPress={handleResumeUpload} />
          {selectedResume && (
            <Text style={styles.resumeText}>{resume}</Text>
          )}
        </View>

        <Text style={styles.label}>Cover Letter</Text>
        <TextInput
          style={[styles.input, styles.coverLetter]}
          placeholder="Write your cover letter here"
          multiline
          numberOfLines={4}
          value={coverLetter}
          onChangeText={setCoverLetter}
        />

        <Button
          title={applying ? 'Submitting...' : 'Submit Application'}
          onPress={handleSubmit}
          color="#007bff"
          disabled={applying}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 20,
    marginBottom: 20,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  headerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    elevation: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  coverLetter: {
    height: 120,
  },
  resumeContainer: {
    marginBottom: 16,
  },
  resumeText: {
    marginTop: 8,
    color: '#555',
  },
});

export default ApplyJobScreen;
