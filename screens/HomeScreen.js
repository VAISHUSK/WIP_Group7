// HomeScreen.js
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Header } from 'react-native-elements';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: 'Home', style: { color: '#fff', fontSize: 20 } }}
      />
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default HomeScreen;
