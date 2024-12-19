import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "./definition";

export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getData = async (key: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    // error reading value
  }
};

export const removeData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};

export const removeAllData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }
};

// User
export const storeUser = async (value: User) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("user", jsonValue);
  } catch (err) {
    // saving error
    console.error(err, "error store user");
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("user");
    const user = jsonValue != null ? JSON.parse(jsonValue) : null;

    return user;
  } catch (err) {
    // error reading value
    console.error(err, "error get user");
    return null;
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (err) {
    console.error(err, "error remove user");
  }
};

// Token
export const storeToken = async (value: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("token", jsonValue);
  } catch (err) {
    console.error(err, "error store token");
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("token");
    const token = jsonValue != null ? JSON.parse(jsonValue) : null;

    return token;
  } catch (err) {
    console.error(err, "error get token");
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (err) {
    console.error(err, "error remove token");
  }
};

// Theme
export const storeTheme = async (value: "light" | "dark") => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("theme", jsonValue);
  } catch (err) {
    console.error(err, "error store theme");
  }
};

export const getTheme = async (): Promise<"light" | "dark" | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("theme");
    const theme = jsonValue != null ? JSON.parse(jsonValue) : null;

    return theme;
  } catch (err) {
    console.error(err, "error get theme");
    return null;
  }
};

export const removeTheme = async () => {
  try {
    await AsyncStorage.removeItem("theme");
  } catch (err) {
    console.error(err, "error remove theme");
  }
};

export const storeFCMToken = async (value: string) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("fcmToken", jsonValue);
  } catch (err) {
    console.error(err, "error store fcm token");
  }
};

export const getFCMToken = async (): Promise<string | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem("fcmToken");
    const fcmToken = jsonValue != null ? JSON.parse(jsonValue) : null;

    return fcmToken;
  } catch (err) {
    console.error(err, "error get fcm token");
    return null;
  }
};

export const removeFCMToken = async () => {
  try {
    await AsyncStorage.removeItem("fcmToken");
  } catch (err) {
    console.error(err, "error remove fcm token");
  }
};
