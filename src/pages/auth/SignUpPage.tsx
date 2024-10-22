import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { useCameraPermission } from "react-native-vision-camera";
import { ImageSign, LogoP } from "../../assets/index.js";
import { Button } from "../../components/ui/Button";
import Gap from "../../components/ui/Gap";
import { Input, Inputeye } from "../../components/ui/Input";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { useModalStore } from "../../stores/useModalStore";
import { useSignUpStore } from "../../stores/useSignUpStore";

export const SignUp = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SignUp">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const signUpReq = useSignUpStore(state => state.signUpReq);
  const updateSignUp = useSignUpStore(state => state.update);
  const { hasPermission, requestPermission } = useCameraPermission();
  const { openModal, closeModal } = useModalStore();

  const onRegister = async () => {
    let error = [];
    if (signUpReq.name === "") {
      error.push("Name required");
    }
    // if (name.length > 50) {
    //   error.push('Name longer than 50 characters');
    // }
    if (signUpReq.username === "") {
      error.push("Username required");
    }
    if (signUpReq.username.length > 50) {
      error.push("Name longer than 50 characters");
    }
    if (signUpReq.email === "") {
      error.push("Email required");
    }
    if (!signUpReq.email.includes("@")) {
      error.push("Enter correct email");
    }
    if (signUpReq.phone !== "") {
      if (signUpReq.phone.length < 9) {
        error.push("Phone number at least 9 characters");
      }
      if (signUpReq.phone.length > 16) {
        error.push("Phone number up to 16 characters");
      }
    }
    if (signUpReq.identity !== "none") {
      if (signUpReq.no_identity === "") {
        error.push("Identity number required");
      }
    }
    if (signUpReq.password === "") {
      error.push("Password required");
    }
    if (signUpReq.password.length < 8) {
      error.push("Password less than 8 characters");
    }
    if (error.length > 0) {
      showMessage({
        icon: "warning",
        message: error[0],
        type: "default",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return;
    }

    if (!hasPermission) {
      try {
        const permission = await requestPermission();
        console.log(permission);

        if (!permission) {
          openModal({
            children: (
              <View
                style={{
                  backgroundColor: isDarkMode ? colors._black : colors._white,
                  padding: 16,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.primary[600],
                    fontSize: 16,
                    color: isDarkMode ? colors._white : colors._black,
                  }}>
                  You need to allow camera permission to go to selfie
                </Text>
                <Gap height={16} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("SelectGym");
                      closeModal();
                    }}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: colors._grey2,
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.primary[600],
                        fontSize: 14,
                        color: colors._black,
                      }}>
                      Skip
                    </Text>
                  </TouchableOpacity>
                  <Gap width={8} />
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openSettings();
                      closeModal();
                    }}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: colors._blue2,
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.primary[600],
                        fontSize: 14,
                        color: colors._white,
                      }}>
                      Open Setting
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ),
          });
          return;
        }

        navigation.navigate("Selfie");
      } catch (err: any) {
        showMessage({
          icon: "warning",
          message: err.message || "An error occured",
          type: "default",
          backgroundColor: colors._red,
          color: colors._white,
        });
        return;
      }
    }

    navigation.navigate("Selfie");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <ImageBackground source={ImageSign} style={styles.container}>
          <StatusBar
            hidden={false}
            translucent={true}
            barStyle={"light-content"}
            backgroundColor="transparent"
          />
          <View style={{ marginLeft: 30 }}>
            <Image source={LogoP} resizeMode="contain" style={{ width: 160 }} />
          </View>
          <View style={styles.main}>
            <Text style={styles.teks1}>Join PosGym App</Text>
            <Gap height={14} />
            <Text style={styles.teks2}>
              Excliusive Gym Portal for Posgym member
            </Text>
          </View>
          <Gap height={40} />
          <ScrollView style={styles.main2}>
            <Input
              autoCapitalize="words"
              placeholder="Full Name"
              value={signUpReq.name}
              onChangeText={(value: string) => updateSignUp({ name: value })}
            />
            <Gap height={20} />
            <Input
              placeholder="Email"
              keyboardType="email-address"
              value={signUpReq.email}
              onChangeText={(value: string) => updateSignUp({ email: value })}
            />
            <Gap height={20} />
            <Input
              placeholder="Phone Number"
              keyboardType="numeric"
              value={signUpReq.phone}
              onChangeText={(value: string) => updateSignUp({ phone: value })}
            />
            <Gap height={20} />
            <Text style={styles.teks(isDarkMode)}>Select Gender</Text>
            <View
              style={{
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
              }}>
              <Picker
                selectedValue={signUpReq.gender}
                style={{
                  color: isDarkMode ? colors._white : colors._black,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                }}
                itemStyle={{
                  color: isDarkMode ? colors._white : colors._black,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                }}
                dropdownIconColor={isDarkMode ? colors._white : colors._black}
                onValueChange={itemValue =>
                  updateSignUp({ gender: itemValue })
                }>
                <Picker.Item
                  label="Male"
                  value="male"
                  style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                />
                <Picker.Item
                  label="Female"
                  value="female"
                  style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                />
                <Picker.Item
                  label="Rather not say"
                  value="rather_not_say"
                  style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                />
              </Picker>
            </View>
            <Gap height={20} />
            <Text style={styles.teks(isDarkMode)}>Select ID Card</Text>
            <View
              style={{
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
              }}>
              <Picker
                selectedValue={signUpReq.identity}
                style={{
                  color: isDarkMode ? colors._white : colors._black,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                }}
                itemStyle={{
                  color: isDarkMode ? colors._white : colors._black,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                }}
                dropdownIconColor={isDarkMode ? colors._white : colors._black}
                onValueChange={itemValue =>
                  updateSignUp({ identity: itemValue })
                }>
                <Picker.Item
                  label="None"
                  value="none"
                  style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                />
                <Picker.Item
                  label="KTP"
                  value="ktp"
                  style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                />
                <Picker.Item
                  label="Driver license"
                  value="sim"
                  style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                />
                <Picker.Item
                  label="Passport"
                  value="passport"
                  style={{ fontSize: 14, fontFamily: fonts.primary[400] }}
                />
              </Picker>
            </View>
            {signUpReq.identity !== "none" && (
              <>
                <Gap height={20} />
                <Input
                  placeholder="Identity Number"
                  maxLength={16}
                  value={signUpReq.no_identity}
                  keyboardType="numeric"
                  onChangeText={(value: string) =>
                    updateSignUp({ no_identity: value })
                  }
                />
              </>
            )}
            <Gap height={20} />
            <Input
              placeholder="Username"
              value={signUpReq.username}
              onChangeText={(value: string) =>
                updateSignUp({ username: value })
              }
            />
            <Gap height={20} />
            <Inputeye
              placeholder="Password"
              value={signUpReq.password}
              onChangeText={(value: string) =>
                updateSignUp({ password: value })
              }
            />
            <Gap height={25} />
            <Button teks="Continue" onPress={onRegister} />
            <Gap height={64} />
          </ScrollView>
        </ImageBackground>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors._blue4,
  },
  main: {
    marginHorizontal: 24,
  },
  teks1: {
    color: colors._white,
    fontFamily: fonts.primary[700],
    fontSize: 24,
  },
  teks2: {
    color: colors._white,
    fontSize: 14,
    fontFamily: fonts.primary[700],
  },
  teks3: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks4: {
    color: colors._black,
    fontFamily: fonts.primary[600], // 500
    fontSize: 14,
  },
  tombol: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    height: 62,
    width: "100%",
    backgroundColor: "green",
  },
  btnScan: {
    backgroundColor: colors._white,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: colors._black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 1,
    width: "48%",
    height: 50,
  },
  mainModal: {
    width: "100%",
    height: "100%",
    backgroundColor: colors._black3,
    alignItems: "center",
    justifyContent: "center",
  },
  contentModal: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
    padding: 16,
    borderRadius: 20,
  }),
  inputCode: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._grey4 : colors._black,
    fontSize: 16,
    fontFamily: fonts.primary[300],
  }),
  main2: {
    flex: 1,
    backgroundColor: colors._white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    // paddingVertical: 30,
  },
  font: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontSize: 12,
    fontFamily: fonts.primary[300],
  }),
  font3: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontSize: 12,
    fontFamily: fonts.primary[600],
  }),
  //   teks: {
  //     color: colors._gold,
  //     fontSize: 16,
  //     fontFamily: fonts.primary[300],
  //   },
  font2: {
    color: colors._blue2,
    fontSize: 12,
    fontFamily: fonts.primary[400],
  },
  teks: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    marginBottom: 5,
    fontSize: 14,
    fontFamily: fonts.primary[400],
  }),
};
