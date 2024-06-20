import React, { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet, Image, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredentials.user;

      const docRef = doc(db, 'Users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userType = docSnap.data().userType;

        if (userType === 'employee') {
          navigation.navigate('EmployeeTabNavigator');
        } else if (userType === 'employer') {
          navigation.navigate('EmployerTabNavigator');
        } else {
          Alert.alert("Error", "Invalid user type: " + userType);
        }
      } else {
        Alert.alert("Error", "User details not found.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Pressable style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    height: 50,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
