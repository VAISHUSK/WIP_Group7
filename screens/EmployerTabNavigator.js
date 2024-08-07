import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import CompanyAnalysisScreen from './CompanyAnalysisScreen'; // Import CompanyAnalysisScreen
import AddJobScreen from './AddJobScreen';
import ProfileScreen from './ProfileScreen';
import ViewApplicationsScreen from './ViewApplicationsScreen'; // Import ViewApplicationsScreen
import AddedJobListScreen from './AddedJobListScreen'; // Import AddedJobListScreen

const Tab = createBottomTabNavigator();

const EmployerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'CompanyAnalysis':
              iconName = focused ? 'analytics' : 'analytics-outline';
              break;
            case 'AddJob':
              iconName = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'AddedJobList':
              iconName = focused ? 'list' : 'list-outline'; // Icon for AddedJobListScreen
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'ViewApplications':
              iconName = focused ? 'document-text' : 'document-text-outline'; // Updated icon for ViewApplications
              break;
            default:
              iconName = 'home'; // Default icon
              break;
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
      <Tab.Screen name="AddedJobList" component={AddedJobListScreen} />
      <Tab.Screen name="ViewApplications" component={ViewApplicationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default EmployerTabNavigator;
