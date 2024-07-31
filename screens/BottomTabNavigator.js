// screens/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Make sure you have Ionicons installed or import icons from another source

import JobSearchScreen from './JobSearchScreen';
import AdminPanelScreen from './AdminPanelScreen';
import ProfileScreen from './ProfileScreen'; // Import ProfileScreen for both employer and employee
import NotificationsScreen from './NotificationsScreen'; // Import NotificationsScreen for employee

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ userType }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'JobSearch') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'AdminPanel' && userType === 'employer') {
            iconName = focused ? 'person' : 'person-outline'; // Replace with appropriate icons for AdminPanel
          } else if (route.name === 'Notifications' && userType === 'employee') {
            iconName = focused ? 'notifications' : 'notifications-outline'; // Replace with appropriate icons for Notifications
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline'; // Example icon for Profile
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      {userType === 'employee' && (
        <>
          <Tab.Screen name="JobSearch" component={JobSearchScreen} />
          <Tab.Screen name="Notifications" component={NotificationsScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />

        </>
      )}
      {userType === 'employer' && (
        <>
          <Tab.Screen name="AdminPanel" component={AdminPanelScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
