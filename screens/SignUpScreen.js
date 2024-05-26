// SignUpScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const SignUpScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const colorScheme = useColorScheme();
    const styles = colorScheme === 'dark' ? darkStyles : lightStyles;
  
    const handleSignUp = () => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('User registered:', userCredential.user);
          // Navigate to Login screen after successful sign-up
          navigation.navigate('Login');
        })
        .catch((error) => {
          setError(error.message);
        });
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={styles.placeholder.color}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={styles.placeholder.color}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign Up" onPress={handleSignUp} color={styles.buttonText.color} />
      </View>
    );
  };
  
const baseStyles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
  },
  placeholder: {
    color: 'gray',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000000',
  },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#000000',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#ffffff',
  },
  placeholder: {
    color: '#b0b0b0',
  },
});

export default SignUpScreen;
