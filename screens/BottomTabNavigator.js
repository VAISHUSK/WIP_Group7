import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is installed

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
        tabBarStyle: {
          backgroundColor: '#fff', // Tab bar background color
          borderTopColor: '#ddd', // Border color on top of the tab bar
          borderTopWidth: 1,
          height: 60, // Tab bar height
        },
        tabBarLabelStyle: {
          fontSize: 12, // Label font size
          fontWeight: 'bold', // Label font weight
        },
        tabBarActiveTintColor: '#007bff', // Active tab color
        tabBarInactiveTintColor: 'gray', // Inactive tab color
        tabBarIconStyle: {
          marginBottom: 5, // Margin for icons
        },
      })}
    >
      {userType === 'employee' && (
        <>
          <Tab.Screen name="JobSearch" component={JobSearchScreen} options={{ title: 'Job Search' }} />
          <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </>
      )}
      {userType === 'employer' && (
        <>
          <Tab.Screen name="AdminPanel" component={AdminPanelScreen} options={{ title: 'Admin Panel' }} />
          <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
