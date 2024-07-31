import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../UserContext';

const HomeScreen = () => {
  const { user } = useUser(); // Access user from context
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [lineData, setLineData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch application data filtered by the applicant's email address
      const applicationsRef = collection(db, 'applications');
      const q = query(applicationsRef, where('applicantEmail', '==', user.email));
      const querySnapshot = await getDocs(q);

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

        // Ensure status exists in statusCount before incrementing
        if (statusCount[status] !== undefined) {
          statusCount[status]++;
        }

        monthlyCount[month]++;
        weeklyCount[week]++;
      });

      console.log('Status Count:', statusCount); // Debugging line
      console.log('Monthly Count:', monthlyCount); // Debugging line
      console.log('Weekly Count:', weeklyCount); // Debugging line

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
          },
        ],
      });

      setLineData({
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            data: weeklyCount,
            strokeWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching application data:', error);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case 'Applied':
        return '#FF6384';
      case 'Interview':
        return '#36A2EB';
      case 'Offer':
        return '#FFCE56';
      case 'Rejected':
        return '#4BC0C0';
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
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f0f0f0',
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
});

export default HomeScreen;
