import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart, LineChart } from 'react-native-chart-kit';

const HomeScreen = () => {
  const pieData = [
    { name: 'Applied', population: 45, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Interview', population: 30, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Offer', population: 15, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    { name: 'Rejected', population: 10, color: '#4BC0C0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  ];

  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [20, 45, 28, 80],
        strokeWidth: 2,
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.header}>Job Application Status</Text>
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
        <Text style={styles.header}>Applications per Month</Text>
        <BarChart
          data={barData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          fromZero
        />
        <Text style={styles.header}>Weekly Applications</Text>
        <LineChart
          data={lineData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
        />
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
