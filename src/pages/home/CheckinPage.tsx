import React, { useContext, useRef } from "react";
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

const Checkin = ({
  navigation,
}: CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, "Checkin">,
  BottomTabScreenProps<TabParamList, "Home">
>) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { isDarkMode } = useContext(ThemeContext);
  const { openModal, closeModal } = useModalStore();
  const device = useCameraDevice("back");

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

    setIsLoading(true);
    try {
      // const {status, message} = await checkIn(code);
      // //   Toaster(status, 'success');
      // if (status === 'checkin') {
      //   navigation.navigate('Loaning');
      // } else {
      //   Toaster(message || 'Checkout Success', 'success');
      //   navigation.navigate('Home');
      // }
      const { status } = await scanQR(code);

      if (status === "checkin") {
        navigation.navigate("Loaning", { code: code });
        return;
      }

      if (status === "checkout") {
        // openModal({
        //   children: (
        //     <>
        //       <Text
        //         style={{
        //           fontFamily: fonts.primary[400],
        //           fontSize: 16,
        //           color: isDarkMode ? colors._white : colors._black,
        //           textAlign: "center",
        //         }}>
        //         Are you sure you want to checkout?
        //       </Text>
        //       <Gap height={16} />
        //       <View
        //         style={{
        //           flexDirection: "row",
        //           justifyContent: "center",
        //           gap: 16,
        //         }}>
        //         <TouchableOpacity
        //           style={{
        //             alignSelf: "center",
        //             backgroundColor: colors._grey2,
        //             padding: 12,
        //             borderRadius: 8,
        //           }}
        //           onPress={() => closeModal()}>
        //           <Text
        //             style={{
        //               color: colors._black,
        //               fontFamily: fonts.primary[400],
        //               fontSize: 16,
        //             }}>
        //             No
        //           </Text>
        //         </TouchableOpacity>
        //         <TouchableOpacity
        //           style={{
        //             alignSelf: "center",
        //             backgroundColor: colors._red,
        //             padding: 12,
        //             borderRadius: 8,
        //           }}
        //           onPress={async () => {
        //             closeModal();
        //             setIsLoading(true);
        //             try {
        //               await checkIn(code);
        //               showMessage({
        //                 message: "Checkout Success",
        //                 type: "success",
        //                 icon: "success",
        //                 backgroundColor: colors._green,
        //                 color: colors._white,
        //               });
        //               navigation.replace("MainApp");
        //             } catch (error: any) {
        //               showMessage({
        //                 message: error.message || "An error occured",
        //                 type: "warning",
        //                 icon: "warning",
        //                 backgroundColor: colors._red,
        //                 color: colors._white,
        //               });
        //             } finally {
        //               setIsLoading(false);
        //             }
        //           }}>
        //           <Text
        //             style={{
        //               color: colors._white,
        //               fontFamily: fonts.primary[400],
        //               fontSize: 16,
        //             }}>
        //             Yes
        //           </Text>
        //         </TouchableOpacity>
        //       </View>
        //     </>
        //   ),
        // });
        navigation.replace("Returning", {
          code: code,
        });
        return;
      }
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

export default Checkin;
