import React, { useContext, useEffect, useRef } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { checkIn, scanQR } from "../../services/member";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList, TabParamList } from "../../lib/routes";
import { fonts, colors } from "../../lib/utils";
import { useModalStore } from "../../stores/useModalStore";
import { showMessage } from "react-native-flash-message";
import {
  Camera,
  Code,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { useIsForeground } from "../../hooks/useIsForeground";
import { ArrowBlack, ArrowWhite } from "../../assets";
import Loading from "../../components/ui/Loading";
import { checkInSchedule } from "../../services/schedule";

const CheckinClass = ({
  navigation,
  route,
}: CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "CheckinClass">,
  BottomTabScreenProps<TabParamList, "Home">
>) => {
  const { seat_id } = route.params;
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext);
  const device = useCameraDevice("back");

  const [isScanned, setIsScanned] = React.useState<boolean>(false);

  // check if camera page is active
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const cameraRef = useRef<Camera>(null);

  if (!device) {
    showMessage({
      message: "Camera not found",
      type: "warning",
      icon: "warning",
      backgroundColor: colors._red,
      color: colors._white,
    });
    navigation.navigate("Home");
    return;
  }

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned(codes, frame) {
      if (codes.length > 0) {
        handlelink(codes[0]);
      }
    },
  });

  const handlelink = async (c: Code) => {
    if (isScanned) {
      return;
    }

    const code = c.value;

    if (!code) {
      showMessage({
        message: "Invalid QR Code",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return;
    }

    setIsScanned(true);

    setIsLoading(true);
    try {
      const { message } = await checkInSchedule(code, seat_id);
      showMessage({
        message: message,
        type: "success",
        icon: "success",
        backgroundColor: colors._green,
        color: colors._white,
      });
    } catch (error: any) {
      showMessage({
        message: error.message || "An error occured",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isScanned) {
      setTimeout(() => {
        setIsScanned(false);
      }, 5000);
    }
  }, [isScanned]);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
          position: "absolute",
          top: Platform.OS === "android" ? 0 : 40,
          left: 0,
          right: 0,
          zIndex: 1,
          backgroundColor: isDarkMode ? colors._black : colors._white,
        }}>
        <TouchableOpacity
          style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}>
          {isDarkMode ? <ArrowWhite /> : <ArrowBlack />}
        </TouchableOpacity>
        <Text
          style={{
            color: isDarkMode ? colors._white : colors._black,
            fontFamily: fonts.primary[600],
            fontSize: 20,
            textAlign: "center",
          }}>
          Scan QR Code
        </Text>
        <View style={{ width: 24, height: 24 }} />
      </View>
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        device={device}
        isActive={isActive}
        photo={false}
        video={false}
        audio={false}
        codeScanner={codeScanner}
      />

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
    flex: 1,
  }),
};

export default CheckinClass;
