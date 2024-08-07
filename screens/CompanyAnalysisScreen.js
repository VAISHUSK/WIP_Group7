import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ensure this import matches your file structure
import { PieChart } from 'react-native-chart-kit'; // Import PieChart component
import { useUser } from '../UserContext'; // Import UserContext

const screenWidth = Dimensions.get('window').width;

const CompanyAnalysisScreen = () => {
  const [applications, setApplications] = useState([]);
  const [applicationsByStatus, setApplicationsByStatus] = useState([]);
  const { user, loading } = useUser(); // Get user from UserContext

  useEffect(() => {
    if (loading) {
      console.log('Loading user data...');
      return;
    }

    if (!user) {
      console.log('No user is logged in.');
      return;
    }

    console.log('Logged in user email:', user.email); // Log the user email

    // Fetch applications for the logged-in user
    const fetchApplications = async () => {
      try {
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('createdBy', '==', user.email)); // Filter by logged-in user's email

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const apps = [];
          querySnapshot.forEach((doc) => {
            const appData = { id: doc.id, ...doc.data() };
            console.log('Application createdBy:', appData.createdBy); // Log createdBy field
            apps.push(appData);
          });
          setApplications(apps);

          // Process data for pie chart
          const statusCounts = {};

          apps.forEach(app => {
            statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
          });

          // Convert counts to array for chart
          setApplicationsByStatus(Object.keys(statusCounts).map(key => ({
            name: key,
            population: statusCounts[key],
            color: getRandomColor(),
            legendFontColor: "#7F7F7F",
            legendFontSize: 15
          })));
        }, (error) => {
          console.error('Error fetching applications:', error);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [user, loading]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Applications by Status</Text>
        <PieChart
          data={applicationsByStatus}
          width={screenWidth - 32} // Adjust width as needed
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </View>
    </ScrollView>
  );
};

// Helper function to generate random colors for pie chart
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Chart configuration
const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  chart: {
    borderRadius: 16,
  },
});

export default CompanyAnalysisScreen;
