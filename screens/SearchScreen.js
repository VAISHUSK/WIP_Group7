// SearchScreen.js
import React from 'react';
import { View, TextInput, Button, StyleSheet, useColorScheme, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SearchScreen = () => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        placeholderTextColor={styles.placeholder.color}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Login"
            color={styles.buttonText.color}
            onPress={() => navigation.navigate('Login')}
          />
        </View>
        <View style={styles.button}>
          <Button
            title="Sign Up"
            color={styles.buttonText.color}
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      </View>
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
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#ffffff',
  },
  placeholder: {
    color: 'gray',
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
  buttonText: {
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
  buttonText: {
    color: '#ffffff',
  },
  placeholder: {
    color: '#b0b0b0',
  },
});

export default SearchScreen;
