// screens/EmployerTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import CompanyAnalysisScreen from './CompanyAnalysisScreen'; // Import CompanyAnalysisScreen
import AddJobScreen from './AddJobScreen';
import ProfileScreen from './ProfileScreen';

const Tab = createBottomTabNavigator();

const EmployerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'CompanyAnalysis') {
            iconName = focused ? 'analytics' : 'analytics-outline'; // Assuming 'analytics' is the icon name
          } else if (route.name === 'AddJob') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="CompanyAnalysis" component={CompanyAnalysisScreen} />
      <Tab.Screen name="AddJob" component={AddJobScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default EmployerTabNavigator;
