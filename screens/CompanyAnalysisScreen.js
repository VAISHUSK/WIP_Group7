import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, Animated } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { PieChart } from 'react-native-chart-kit';
import { useUser } from '../UserContext';

const screenWidth = Dimensions.get('window').width;

const CompanyAnalysisScreen = () => {
  const [applications, setApplications] = useState([]);
  const [applicationsByStatus, setApplicationsByStatus] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for fade-in effect
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) {
      console.log('Loading user data...');
      return;
    }

    if (!user) {
      console.log('No user is logged in.');
      return;
    }

    console.log('Logged in user email:', user.email);

    const fetchApplications = async () => {
      try {
        const applicationsRef = collection(db, 'applications');
        const q = query(applicationsRef, where('createdBy', '==', user.email));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const apps = [];
          querySnapshot.forEach((doc) => {
            const appData = { id: doc.id, ...doc.data() };
            console.log('Application createdBy:', appData.createdBy);
            apps.push(appData);
          });
          setApplications(apps);

          const statusCounts = {};

          apps.forEach(app => {
            statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
          });

          setApplicationsByStatus(Object.keys(statusCounts).map(key => ({
            name: key,
            population: statusCounts[key],
            color: getRandomColor(),
            legendFontColor: "#FFFFFF",
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

    // Animate the fade-in effect
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

  }, [user, loading, fadeAnim]);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <Text style={styles.headerText}>Company Analysis</Text>
      </Animated.View>
      <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
        <Text style={styles.chartTitle}>Applications by Status</Text>
        <PieChart
          data={applicationsByStatus}
          width={screenWidth - 32}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </Animated.View>
      <Animated.View style={[styles.thoughtsContainer, { opacity: fadeAnim }]}>
        <Text style={styles.thoughtsTitle}>Understanding the Data</Text>
        <Text style={styles.thoughtsText}>
          The pie chart above visualizes the distribution of your job applications based on their status. Analyzing this data helps in understanding which stages of your application process require more attention.
        </Text>
        <Text style={styles.thoughtsText}>
          For instance, if a large portion of applications are stuck in the "Pending" status, it might indicate a need to follow up or enhance your resume and cover letter.
        </Text>
        <Text style={styles.thoughtsText}>
          Conversely, a high number of "Accepted" applications could suggest that your approach is highly effective. Use this analysis to optimize your job search strategy.
        </Text>
      </Animated.View>
    </ScrollView>
  );
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const chartConfig = {
  backgroundGradientFrom: '#87CEEB', // Sky blue gradient start
  backgroundGradientTo: '#B0E0E6', // Lighter sky blue gradient end
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Dark text for readability
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F8FF', // Alice blue for a white-dominant background
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4682B4', // Steel blue for the header text
    textAlign: 'center',
  },
  chartContainer: {
    marginBottom: 24,
    backgroundColor: '#FFFFFF', // White background for chart container
    padding: 20,
    borderRadius: 16,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4682B4', // Steel blue for chart title
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  thoughtsContainer: {
    backgroundColor: '#FFFFFF', // White background for thoughts container
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#87CEEB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  thoughtsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4682B4', // Steel blue for thoughts title
    marginBottom: 10,
    textAlign: 'center',
  },
  thoughtsText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default CompanyAnalysisScreen;
