import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';

const CustomMarker = ({ coordinate, title, onPress }) => {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View style={styles.markerContainer}>
        <Text style={styles.markerText}>{title}</Text>
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
  },
  markerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default CustomMarker;
