import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AdminPanelScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Panel</Text>
      <Button
        title="Add Job"
        onPress={() => navigation.navigate('AddJob')}
      />
      {/* Add more admin functionalities here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default AdminPanelScreen;
