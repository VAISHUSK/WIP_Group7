import React from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Image } from 'react-native';

const LandingScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Job Search App</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for jobs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: 'black',
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'black',
    width: '100%',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LandingScreen;
