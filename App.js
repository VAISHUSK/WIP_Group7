import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UserProvider, useUser } from './UserContext'; // Import UserContext
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import LandingScreen from './screens/LandingScreen';
import EmployerTabNavigator from './screens/EmployerTabNavigator';
import EmployeeTabNavigator from './screens/EmployeeTabNavigator';
import JobDetailsScreen from './screens/JobDetailsScreen'; // Import JobDetailsScreen
import ApplyJobScreen from './screens/ApplyJobScreen'; // Import ApplyJobScreen

const Stack = createStackNavigator();

const App = () => {
  const { user, loading } = useUser();

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
          </>
        ) : user.userType === 'employer' ? (
          <>
            <Stack.Screen
              name="EmployerTabNavigator"
              component={EmployerTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="JobDetails"
              component={JobDetailsScreen}
              options={{ title: 'Job Details' }}
            />
            <Stack.Screen
              name="ApplyJobScreen"
              component={ApplyJobScreen}
              options={{ title: 'Apply for Job' }}
            />
          </>
        ) : user.userType === 'employee' ? (
          <>
            <Stack.Screen
              name="EmployeeTabNavigator"
              component={EmployeeTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="JobDetails"
              component={JobDetailsScreen}
              options={{ title: 'Job Details' }}
            />
            <Stack.Screen
              name="ApplyJobScreen"
              component={ApplyJobScreen}
              options={{ title: 'Apply for Job' }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const RootApp = () => (
  <UserProvider>
    <App />
  </UserProvider>
);

export default RootApp;
