import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
import { refreshFCMToken } from "../services/notification";
import { showMessage } from "react-native-flash-message";

export async function setNotificationsHandler() {
  let granted = await checkNotificationPermissionStatus();
  if (!granted) return;

  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log("FCM token:", token);
  await refreshFCMToken(token);

  messaging().onMessage(async remoteMessage => {
    console.log("A new FCM message arrived!", remoteMessage);
    showMessage({
      message: remoteMessage.notification?.title || "New Notification",
      description: remoteMessage.notification?.body,
      type: "info",
      icon: "info",
      backgroundColor: "#000",
      color: "#fff",
    });
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log("Message handled in the background!", remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage,
    );
  });

  messaging().onTokenRefresh(async fcmToken => {
    console.log("FCM token refreshed");
    await refreshFCMToken(fcmToken);
  });
}

export async function checkNotificationPermissionStatus() {
  const enabled = await messaging().hasPermission();
  return (
    enabled === messaging.AuthorizationStatus.AUTHORIZED ||
    enabled === messaging.AuthorizationStatus.PROVISIONAL
  );
}
