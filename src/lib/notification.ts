import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";
import { storeFCMToken } from "./local-storage";

export async function requestUserPermissionFCM() {
  const os = Platform.OS;
  try {
    if (os === "ios") {
      await messaging().registerDeviceForRemoteMessages();
      const authStatus = await messaging().requestPermission({
        // provisional: true,
      });
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      console.log(enabled);

      if (!enabled) {
        console.log("Authorization status:", authStatus);
        return;
      }

      console.log("Permission granted");
    }

    if (os === "android") {
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (res !== PermissionsAndroid.RESULTS.GRANTED) {
        return;
      }

      console.log("Permission granted");
    }
  } catch (err: any) {
    console.error(err);
  }
}
