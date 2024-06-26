// screens/HomeScreen.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const InsertScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  searchBar: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
});

export default InsertScreen;
