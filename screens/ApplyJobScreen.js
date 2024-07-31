import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { addDoc, collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../UserContext'; // Adjust the import path as needed

const ApplyJobScreen = ({ route, navigation }) => {
  const { jobId } = route.params || {};
  const { user, loading } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('');
  const [workExperience, setWorkExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [applying, setApplying] = useState(false);
  const [createdBy, setCreatedBy] = useState('');

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const jobRef = doc(db, 'jobs', jobId);
        const jobDoc = await getDoc(jobRef);
        if (jobDoc.exists()) {
          const jobData = jobDoc.data();
          setCreatedBy(jobData.createdBy);
          console.log('Job Data:', jobData); // Logging job data
          console.log('Created By:', jobData.createdBy); // Logging createdBy
        } else {
          console.log('No such job!');
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    if (user && !loading) {
      setName(user.name || '');
      setEmail(user.email || ''); // Ensure email is set from user context
      setPhone(user.phone || '');
      setAddress(user.address || '');
      // Set other fields if they exist in the user data
    }
  }, [user, loading]);

  const handleSubmit = async () => {
    if (!name || !email || !phone || !address || !education || !workExperience || !skills) {
      Alert.alert('Missing Information', 'Please fill out all required fields.');
      return;
    }

    setApplying(true);
    try {
      await addDoc(collection(db, 'applications'), {
        jobId,
        applicantName: name,
        applicantEmail: email, // Use the email from user context
        phone,
        address,
        education,
        workExperience,
        skills,
        createdBy, // Include the createdBy email address
        status: 'Applied', // Set the status as 'Applied'
        timestamp: new Date(),
      });

      Alert.alert('Success', 'Application submitted successfully!');
      navigation.goBack();
    } catch (err) {
      console.error('Error submitting application:', err);
      Alert.alert('Error', 'Error submitting application. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
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

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.address]}
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Education</Text>
        <TextInput
          style={[styles.input, styles.education]}
          placeholder="Enter your education details"
          value={education}
          onChangeText={setEducation}
        />

        <Text style={styles.label}>Work Experience</Text>
        <TextInput
          style={[styles.input, styles.workExperience]}
          placeholder="Enter your work experience"
          value={workExperience}
          onChangeText={setWorkExperience}
        />

        <Text style={styles.label}>Skills</Text>
        <TextInput
          style={[styles.input, styles.skills]}
          placeholder="Enter your skills"
          value={skills}
          onChangeText={setSkills}
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
  address: {
    height: 80, // Increased height for address field
  },
  education: {
    height: 80, // Increased height for education field
  },
  workExperience: {
    height: 120, // Increased height for work experience field
  },
  skills: {
    height: 60, // Height for skills field
  },
});

export default ApplyJobScreen;
