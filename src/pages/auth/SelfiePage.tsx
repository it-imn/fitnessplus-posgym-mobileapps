import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useRef } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  EditPenWhite,
  EditPen,
  ArrowWhite,
  ArrowBlack,
} from "../../assets/index.js";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { useIsForeground } from "../../hooks/useIsForeground";
import { ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { useSignUpStore } from "../../stores/useSignUpStore";
import { useCameraDevice, PhotoFile, Camera } from "react-native-vision-camera";
import { showMessage } from "react-native-flash-message";
import { Button } from "../../components/ui/Button";

const Selfie = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Selfie">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const device = useCameraDevice("front");
  const [photo, setPhoto] = React.useState<PhotoFile | null>(null);
  const updateImage = useSignUpStore(state => state.update);
  // const {openModal, closeModal} = useModalStore();

  // check if camera page is active
  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const cameraRef = useRef<Camera>(null);

  if (device == null) {
    navigation.navigate("SelectGym");
    return;
  }

  const onTakePicture = async () => {
    try {
      if (photo) {
        updateImage({ image: photo.path });
        navigation.navigate("SelectGym");
        return;
      }

      const p = await cameraRef.current?.takePhoto();
      if (p) {
        setPhoto(p);
      }
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

  // const checkCameraPermission = async () => {
  //   if (!hasPermission) {
  //     try {
  //       const permission = await requestPermission();

  //       if (!permission) {
  //         openModal({
  //           children: (
  //             <View
  //               style={{
  //                 backgroundColor:
  //                   isDarkMode ? colors._black : colors._white,
  //                 padding: 16,
  //                 borderRadius: 8,
  //               }}>
  //               <Text
  //                 style={{
  //                   fontFamily: fonts.primary[600],
  //                   fontSize: 16,
  //                   color:
  //                     isDarkMode ? colors._white : colors._black,
  //                 }}>
  //                 You need to allow camera permission to use this feature
  //               </Text>
  //               <Gap height={16} />
  //               <View
  //                 style={{
  //                   flexDirection: 'row',
  //                   justifyContent: 'center',
  //                   width: '100%',
  //                 }}>
  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     navigation.navigate('SelectGym');
  //                     closeModal();
  //                   }}
  //                   style={{
  //                     padding: 16,
  //                     borderRadius: 8,
  //                     backgroundColor: colors._grey2,
  //                   }}>
  //                   <Text
  //                     style={{
  //                       fontFamily: fonts.primary[600],
  //                       fontSize: 14,
  //                       color: colors._black,
  //                     }}>
  //                     Skip
  //                   </Text>
  //                 </TouchableOpacity>
  //                 <Gap width={8} />
  //                 <TouchableOpacity
  //                   onPress={() => {
  //                     Linking.openSettings();
  //                     closeModal();
  //                   }}
  //                   style={{
  //                     padding: 16,
  //                     borderRadius: 8,
  //                     backgroundColor: colors._blue2,
  //                   }}>
  //                   <Text
  //                     style={{
  //                       fontFamily: fonts.primary[600],
  //                       fontSize: 14,
  //                       color: colors._white,
  //                     }}>
  //                     Open Setting
  //                   </Text>
  //                 </TouchableOpacity>
  //               </View>
  //             </View>
  //           ),
  //         });
  //       }
  //     } catch (err: any) {
  //       Toaster(err.message || 'An error occured', 'warning');
  //     }
  //   }
  // };

  // useEffect(() => {
  // checkCameraPermission();
  // }, [isFocused, isForeground]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        {photo !== null ? (
          <TouchableOpacity
            onPress={() => setPhoto(null)}
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              transform: [{ rotate: "180deg" }],
            }}>
            {isDarkMode ? <EditPenWhite /> : <EditPen />}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24, height: 24 }} />
        )}
        <Text
          style={{
            color: isDarkMode ? colors._white : colors._black,
            fontFamily: fonts.primary[600],
            fontSize: 20,
            textAlign: "center",
          }}>
          Selfie
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("SelectGym")}
          style={{
            width: 24,
            height: 24,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            transform: [{ rotate: "180deg" }],
          }}>
          {isDarkMode ? <ArrowWhite /> : <ArrowBlack />}
        </TouchableOpacity>
      </View>
      {photo !== null ? (
        <View>
          <Image
            src={`file://${photo?.path}`}
            resizeMode="cover"
            style={{ height: "100%", width: "100%" }}
          />
        </View>
      ) : (
        <Camera
          ref={cameraRef}
          style={{ flex: 1 }}
          device={device}
          isActive={isActive}
          photo={true}
          video={false}
          audio={false}
        />
      )}

      <View
        style={{
          position: "absolute",
          bottom: 32,
          left: 16,
          right: 16,
        }}>
        <Button
          onPress={() => onTakePicture()}
          teks={photo ? "Next" : "Take Picture"}
        />
      </View>
    </SafeAreaView>
  );
};

export default Selfie;
