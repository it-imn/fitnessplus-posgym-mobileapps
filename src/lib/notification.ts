import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
import { refreshFCMToken } from "../services/notification";
import notifee, { AndroidImportance } from "@notifee/react-native";

export async function setNotificationsHandler() {
  let granted = await checkNotificationPermissionStatus();
  if (!granted) return;

  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log("FCM token:", token);
  await refreshFCMToken(token);

  notifee.isChannelCreated("default").then(isCreated => {
    if (!isCreated) {
      notifee.createChannel({
        id: "default",
        name: "default",
        sound: "default",
      });
    }
  });

  messaging().onMessage(async remoteMessage => {
    console.log("A new FCM message arrived!", remoteMessage);
    notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        smallIcon: "ic_stat_name",
        largeIcon: remoteMessage.notification?.android?.imageUrl,
        channelId: "default",
        importance: AndroidImportance.DEFAULT,
        pressAction: {
          id: "default",
          launchActivity: "default",
        },
      },
    });
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
  console.log("Notification permission status:", enabled);

  if (!enabled) {
    if (Platform.OS === "android") {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (res === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }

      return false;
    }

    if (Platform.OS === "ios") {
      const authStatus = await messaging().requestPermission({
        provisional: true,
      });
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log(enabled);

      if (!enabled) {
        console.log("Authorization status:", authStatus);
        return false;
      }

      console.log("Permission granted");
      return true;
    }
  }

  return (
    enabled === messaging.AuthorizationStatus.AUTHORIZED ||
    enabled === messaging.AuthorizationStatus.PROVISIONAL
  );
}
