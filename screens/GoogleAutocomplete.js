import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GoogleAutoComplete = ({ handleAddressSelect }) => {
  return (
    <GooglePlacesAutocomplete
      placeholder='Search for an address'
      onPress={handleAddressSelect}
      fetchDetails={true}
      query={{ key: 'AIzaSyDi08rJ4cV1T-rTcvmWv5Nk_0o6AYfOyGw', language: 'en' }} 
      styles={{ textInput: { height: 40, borderColor: '#ddd', borderWidth: 1, borderRadius: 4, paddingHorizontal: 8 } }}
    />
  );
};

export default GoogleAutoComplete;
