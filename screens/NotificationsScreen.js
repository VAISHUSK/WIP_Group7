import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem, Text, Icon } from 'react-native-elements';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'New Job Opportunity', message: 'A new job is available. Apply now!' },
    { id: '2', title: 'Application Status', message: 'Your application has been reviewed.' },
    { id: '3', title: 'Interview Scheduled', message: 'You have an interview on Monday.' },
    { id: '4', title: 'Congratulations!', message: 'You got the job!' },
  ]);

  const renderNotification = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <Icon name="chevron-right" type="font-awesome" color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No notifications found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});

export default NotificationsScreen;
