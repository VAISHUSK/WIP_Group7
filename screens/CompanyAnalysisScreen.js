import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CompanyAnalysisScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Company Analysis</Text> */}
      {/* You can add your analysis components here, such as lists of applicants, charts, etc. */}
      <Text style={styles.info}>Applicants Applied: 10</Text>
      {/* Add more analytics as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  info: {
    fontSize: 18,
    marginVertical: 8,
  },
});

export default CompanyAnalysisScreen;
