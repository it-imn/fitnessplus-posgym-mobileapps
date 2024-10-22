import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ImageStyle,
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Logo2, LogoP, SplashImage } from "../../assets/index.js";
import { offline } from "../../services/auth";
import { fetchProfile } from "../../services/profile";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getToken, removeAllData } from "../../lib/local-storage";
import { RootStackParamList } from "../../lib/routes";
import { showMessage } from "react-native-flash-message";
import { colors } from "../../lib/utils";

const width = Dimensions.get("window").width;

export const SplashScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SplashScreen">) => {
  const handleToken = async () => {
    try {
      const token = await getToken();
      if (!token) {
        navigation.replace("Onboarding");
        return false;
      }
      return true;
    } catch (err: any) {
      showMessage({
        message: err.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      navigation.replace("Onboarding");
      return false;
    }
  };

  const handleProfile = async () => {
    try {
      await fetchProfile();
      navigation.replace("MainApp");
      return true;
    } catch (err: any) {
      showMessage({
        message: err.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return false;
    }
  };

  const handleOffline = async () => {
    try {
      await offline();
      await removeAllData();
    } catch (err: any) {
      showMessage({
        message: err.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
    }
  };

  const goto = () => {
    setTimeout(async () => {
      const tokenHandled = await handleToken();
      if (!tokenHandled) {
        return;
      }

      const profileHandled = await handleProfile();
      if (!profileHandled) {
        await handleOffline();
        navigation.replace("Onboarding");
      }
    }, 3000);
  };

  useEffect(() => {
    goto();
  }, []);

  return (
    <ImageBackground source={SplashImage} style={styles.container}>
      <StatusBar
        hidden={false}
        translucent={true}
        barStyle={"light-content"}
        backgroundColor="transparent"
      />
      <View
        style={{ flex: 1, justifyContent: "center" } as StyleProp<ViewStyle>}>
        <Image
          source={Platform.OS === "ios" ? Logo2 : LogoP}
          style={
            {
              width: Platform.OS === "ios" ? width : width / 1.3,
            } as StyleProp<ImageStyle>
          }
          resizeMode="center"
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
