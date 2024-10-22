import React, { useEffect } from "react";
import { View } from "react-native";
import { RootStackParamList } from "../../lib/routes";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export const Starter = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Starter">) => {
  useEffect(() => {
    navigation.replace("SplashScreen");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View />;
};
