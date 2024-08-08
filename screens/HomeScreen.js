import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../UserContext';

const HomeScreen = () => {
  const { user } = useUser(); // Access user from context
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [lineData, setLineData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (user) {
      const unsubscribe = fetchData();
      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, [user]);

  const fetchData = () => {
    const applicationsRef = collection(db, 'applications');
    const q = query(applicationsRef, where('applicantEmail', '==', user.email));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const statusCount = {
        Applied: 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0,
      };
      const monthlyCount = new Array(12).fill(0);
      const weeklyCount = new Array(4).fill(0);

      querySnapshot.forEach(doc => {
        const data = doc.data();
        const status = data.status;
        const appliedDate = new Date(data.timestamp.toDate());
        const month = appliedDate.getMonth();
        const week = Math.floor(appliedDate.getDate() / 7);

        if (statusCount[status] !== undefined) {
          statusCount[status]++;
        }

        monthlyCount[month]++;
        weeklyCount[week]++;
      });

      setPieData(Object.keys(statusCount).map(status => ({
        name: status,
        population: statusCount[status],
        color: getColor(status),
        legendFontColor: '#7F7F7F',
        legendFontSize: 15,
      })));

      setBarData({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: monthlyCount,
            color: (opacity = 1) => `rgba(135, 206, 250, ${opacity})`, // Sky blue for bars
            strokeWidth: 2,
          },
        ],
      });

      setLineData({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            data: weeklyCount,
            color: (opacity = 1) => `rgba(135, 206, 250, ${opacity})`, // Sky blue for line
            strokeWidth: 2,
          },
        ],
      });
    }, (error) => {
      console.error('Error fetching application data:', error);
    });

    return unsubscribe;
  };

  const getColor = (status) => {
    switch (status) {
      case 'Applied':
        return '#87CEEB'; // Sky blue
      case 'Interview':
        return '#4682B4'; // Steel blue
      case 'Offer':
        return '#00BFFF'; // Deep sky blue
      case 'Rejected':
        return '#1E90FF'; // Dodger blue
      default:
        return '#000000';
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Job Application Status</Text>
        {pieData.length > 0 && (
          <PieChart
            data={pieData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        )}
        <Text style={styles.header}>Applications per Month</Text>
        {barData.labels.length > 0 && (
          <BarChart
            data={barData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            fromZero
          />
        )}
        <Text style={styles.header}>Weekly Applications</Text>
        {lineData.labels.length > 0 && (
          <LineChart
            data={lineData}
            width={Dimensions.get('window').width - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
          />
        )}
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientFromOpacity: 0.5,
  backgroundGradientTo: '#f8f8f8',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(135, 206, 250, ${opacity})`, // Sky blue
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0faff', // Light sky blue
    padding: 20,
  },
  container: {
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007bff', // Sky blue
    textAlign: 'center',
  },
});

export default HomeScreen;
