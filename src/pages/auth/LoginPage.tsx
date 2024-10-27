import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { LogoP, ImageSign } from "../../assets/index.js";
import Gap from "../../components/ui/Gap";
import { storeToken, storeUser } from "../../lib/local-storage";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { login } from "../../services/auth";
import { Input, Inputeye } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import { useSignUpStore } from "../../stores/useSignUpStore";

export const LoginPage = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "LoginPage">) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { reset } = useSignUpStore();

  const onLogin = async () => {
    setLoading(true);
    let error = [];
    if (username === "") {
      error.push("Username required");
    }
    if (password === "") {
      error.push("Password required");
    }
    if (password.length < 8) {
      error.push("Password less than 8 characters");
    }
    if (error.length > 0) {
      setLoading(false);
      showMessage({
        icon: "warning",
        message: error[0],
        type: "default",
        backgroundColor: colors._red,
        color: colors._white,
      });
    } else {
      try {
        const { data } = await login(username, password);

        await storeToken(data.token);
        await storeUser(data.user);

        setLoading(false);

        navigation.replace("MainApp");
      } catch (err: any) {
        setLoading(false);
        showMessage({
          message: err.message || "An error occurred",
          type: "warning",
          icon: "warning",
          backgroundColor: colors._red,
          color: colors._white,
        });
      }
    }
  };

  // const gotoQRExisting = () => {
  //   const params = {
  //     type: 'existing',
  //   };
  //   navigation.navigate('ScanQRExistingTrial', params);
  // };

  const gotoSign = () => {
    reset();
    navigation.navigate("SignUp");
  };

  // const gotoForgotPassword = () => {
  //   navigation.navigate('ForgotPassword');
  // };

  // const gotoQRTrial = () => {
  //   const params = {
  //     type: 'trial',
  //   };
  //   navigation.navigate('ScanQRExistingTrial', params);
  // };

  return (
    <>
      {/* <View style={styles.container(isDarkMode)}>
      <StatusBar
          hidden={false}
          translucent={true}
          barStyle={'light-content'}
          backgroundColor="transparent"
        />
        <View style={{}}>
          <Image source={SignAtom} style={{width: 278,}} />
        </View>

      </View> */}
      <SafeAreaView style={{ flex: 1, backgroundColor: colors._white }}>
        <ScrollView>
          {Platform.OS === "ios" && Platform.isPad ? (
            <View style={styles.container}>
              <StatusBar
                // hidden={false}
                translucent={true}
                barStyle={
                  Platform.OS === "ios" ? "dark-content" : "light-content"
                }
                backgroundColor="transparent"
              />
              <View style={{ marginLeft: 30 }}>
                <Image
                  source={LogoP}
                  resizeMode="contain"
                  style={{ width: 160 }}
                />
              </View>
              <View style={styles.main}>
                <Text style={styles.teks1}>Exercise Your Mind and Body</Text>
                <Gap height={14} />
                <Text style={styles.teks2}>
                  Login to continue and you can access posgym
                </Text>
              </View>
              <Gap height={40} />
              <View style={styles.main2}>
                <Input
                  placeholder="Username"
                  autoCapitalize="none"
                  maxLength={200}
                  value={username}
                  onChangeText={(value: string) => setUsername(value)}
                />
                <Gap height={20} />
                <Inputeye
                  placeholder="Password"
                  value={password}
                  onChangeText={(value: string) => setPassword(value)}
                />
                {/* <Gap height={12} />
                <TouchableOpacity
                  style={{alignItems: 'flex-end'}}
                  onPress={gotoForgotPassword}>
                  <Text
                    style={{
                      color: colors._blue2,
                      fontSize: 14,
                      fontFamily: fonts.primary[400],
                    }}>
                    Forgot Password
                  </Text>
                </TouchableOpacity> */}
                <Gap height={30} />
                <Button teks="Login" onPress={onLogin} disabled={false} />
                <Gap height={30} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      color: colors._black,
                      fontSize: 14,
                      fontFamily: fonts.primary[300],
                    }}>
                    Not a member?{" "}
                  </Text>
                  <TouchableOpacity onPress={gotoSign}>
                    <Text
                      style={{
                        color: colors._blue2,
                        fontSize: 14,
                        fontFamily: fonts.primary[400],
                      }}>
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
                {/*
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={styles.btnScan}
                    onPress={gotoQRExisting}>
                    <IconQrBlue />
                    <Gap width={6} />
                    <Text
                      style={{
                        color: colors._blue2,
                        fontSize: 14,
                        fontFamily: fonts.primary[400],
                        textAlign: 'center',
                      }}>
                      Existing Member
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnScan}
                    onPress={gotoQRTrial}>
                    <IconVoucher />
                    <Gap width={4} />
                    <Text
                      style={{
                        color: colors._blue2,
                        fontSize: 14,
                        fontFamily: fonts.primary[400],
                        textAlign: 'center',
                      }}>
                      Trial Voucher
                    </Text>
                  </TouchableOpacity>
                </View>
                */}
              </View>
            </View>
          ) : (
            <ImageBackground source={ImageSign} style={styles.container}>
              <StatusBar
                // hidden={false}
                translucent={true}
                barStyle={
                  Platform.OS === "ios" ? "dark-content" : "light-content"
                }
                backgroundColor="transparent"
              />
              <View style={{ marginLeft: 30 }}>
                <Image
                  source={LogoP}
                  resizeMode="contain"
                  style={{ width: 160 }}
                />
              </View>
              <View style={styles.main}>
                <Text style={styles.teks1}>Exercise Your Mind and Body</Text>
                <Gap height={14} />
                <Text style={styles.teks2}>
                  Login to continue and you can access posgym
                </Text>
              </View>
              <Gap height={40} />
              <View style={styles.main2}>
                <Input
                  placeholder="Username"
                  autoCapitalize="none"
                  maxLength={200}
                  value={username}
                  onChangeText={(value: string) => setUsername(value)}
                />
                <Gap height={20} />
                <Inputeye
                  placeholder="Password"
                  value={password}
                  onChangeText={(value: string) => setPassword(value)}
                />
                {/* <Gap height={12} />
                <TouchableOpacity
                  style={{alignItems: 'flex-end'}}
                  onPress={gotoForgotPassword}>
                  <Text
                    style={{
                      color: colors._blue2,
                      fontSize: 14,
                      fontFamily: fonts.primary[400],
                    }}>
                    Forgot Password
                  </Text>
                </TouchableOpacity> */}
                <Gap height={30} />
                <Button teks="Login" onPress={onLogin} disabled={false} />
                <Gap height={30} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 22,
                    alignItems: "center",
                  }}>
                  <Text
                    style={{
                      color: colors._black,
                      fontSize: 14,
                      fontFamily: fonts.primary[300],
                    }}>
                    Not a member?{" "}
                  </Text>
                  <TouchableOpacity onPress={gotoSign}>
                    <Text
                      style={{
                        color: colors._blue2,
                        fontSize: 14,
                        fontFamily: fonts.primary[400],
                      }}>
                      Register
                    </Text>
                  </TouchableOpacity>
                </View>
                {/*
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={styles.btnScan}
                    onPress={gotoQRExisting}>
                    <IconQrBlue />
                    <Gap width={6} />
                    <Text
                      style={{
                        color: colors._blue2,
                        fontSize: 14,
                        fontFamily: fonts.primary[400],
                        textAlign: 'center',
                      }}>
                      Existing Member
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnScan}
                    onPress={gotoQRTrial}>
                    <IconVoucher />
                    <Gap width={4} />
                    <Text
                      style={{
                        color: colors._blue2,
                        fontSize: 14,
                        fontFamily: fonts.primary[400],
                        textAlign: 'center',
                      }}>
                      Trial Voucher
                    </Text>
                  </TouchableOpacity>
                </View>
                */}
              </View>
            </ImageBackground>
          )}
        </ScrollView>
      </SafeAreaView>

      {loading && <Loading />}
    </>
  );
};
const styles = StyleSheet.create({
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
  teks3: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: colors._black,
  },
  // teks3: theme => ({
  //   fontSize: 14,
  //   fontFamily: fonts.primary[400],
  //   color: theme == true ? colors._white : colors._black,
  // }),
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
  contentModal: {
    backgroundColor: colors._white,
    padding: 16,
    borderRadius: 20,
  },
  inputCode: {
    color: colors._black,
    fontSize: 16,
    fontFamily: fonts.primary[300],
  },
  // contentModal: theme => ({
  //   backgroundColor: theme == true ? colors._black2 : colors._white,
  //   padding: 16,
  //   borderRadius: 20,
  // }),
  // inputCode: theme => ({
  //   color: theme == true ? colors._grey4 : colors._black,
  //   fontSize: 16,
  //   fontFamily: fonts.primary[300],
  // }),
  main2: {
    flex: 1,
    backgroundColor: colors._white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 30,
    // paddingVertical: 30,
  },
});
