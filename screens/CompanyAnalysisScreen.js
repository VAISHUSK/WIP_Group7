// CompanyAnalysisScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { db } from '../firebaseConfig'; // Adjust the path according to your setup

const screenWidth = Dimensions.get('window').width;

const CompanyAnalysisScreen = () => {
  const [applications, setApplications] = useState([]);
  const [applicationsByPosition, setApplicationsByPosition] = useState([]);
  const [applicationsByStatus, setApplicationsByStatus] = useState([]);

  useEffect(() => {
    // Fetch applications data from Firestore
    const fetchApplications = async () => {
      try {
        const snapshot = await db.collection('applications').get();
        const fetchedApplications = snapshot.docs.map(doc => doc.data());

        setApplications(fetchedApplications);

        // Process data for charts
        const positionCounts = {};
        const statusCounts = {};

        fetchedApplications.forEach(app => {
          // Count applications by position
          positionCounts[app.position] = (positionCounts[app.position] || 0) + 1;

          // Count applications by status
          statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
        });

        // Convert counts to arrays for charts
        setApplicationsByPosition(Object.keys(positionCounts).map(key => ({ name: key, applications: positionCounts[key] })));
        setApplicationsByStatus(Object.keys(statusCounts).map(key => ({ name: key, applications: statusCounts[key] })));
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {applications.length === 0 ? (
          <View style={styles.noApplicationsContainer}>
            <Text style={styles.noApplicationsText}>No applications found.</Text>
          </View>
        ) : (
          <>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Applications by Job Position</Text>
              <BarChart
                data={{
                  labels: applicationsByPosition.map(item => item.name),
                  datasets: [{
                    data: applicationsByPosition.map(item => item.applications),
                  }],
                }}
                width={screenWidth - 32} // Adjust width as needed
                height={220}
                yAxisLabel=""
                chartConfig={chartConfig}
                verticalLabelRotation={30}
                style={styles.chart}
              />
            </View>

            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Applications by Status</Text>
              <PieChart
                data={applicationsByStatus.map(item => ({
                  name: item.name,
                  population: item.applications,
                  color: getRandomColor(),
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15
                }))}
                width={screenWidth - 32} // Adjust width as needed
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                style={styles.chart}
              />
            </View>
          </>
        )}
      </ScrollView>
    </View>
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
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
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
  noApplicationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noApplicationsText: {
    fontSize: 18,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default CompanyAnalysisScreen;
