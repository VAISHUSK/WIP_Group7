import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// Foreground message handler
messaging().onMessage(async remoteMessage => {
  Alert.alert('New Notification', remoteMessage.notification.body);
});

// Background and quit state message handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Request permission to receive notifications
export const requestUserPermission = async () => {
  const authorizationStatus = await messaging().hasPermission();
  if (authorizationStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
    await messaging().requestPermission();
  }
};

// Get the FCM token
export const getFcmToken = async () => {
  const fcmToken = await messaging().getToken();
  console.log('FCM Token:', fcmToken);
  return fcmToken;
};
