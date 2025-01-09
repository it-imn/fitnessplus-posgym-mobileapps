import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import NoData from "../../components/ui/NoData";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { TabParamList, RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { Controller, useForm } from "react-hook-form";
import { ImageSign, LogoP } from "../../assets";
import { ButtonColor } from "../../components/ui/Button";
import Gap from "../../components/ui/Gap";
import { Input } from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { showMessage } from "react-native-flash-message";
import { requestLogout } from "../../services/member";
import { forgotPassword } from "../../services/auth";

const requestLogoutSchema = z.object({
  email: z
    .string()
    .email("Enter correct email")
    .min(1, { message: "Email is required" }),
});

export const ForgotPassword = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "ForgotPassword">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof requestLogoutSchema>>({
    resolver: zodResolver(requestLogoutSchema),
    defaultValues: {
      email: "",
    },
  });

  const onRegister = async (values: z.infer<typeof requestLogoutSchema>) => {
    setIsLoading(true);
    try {
      const { message } = await forgotPassword(values.email);
      showMessage({
        icon: "success",
        message: message,
        type: "default",
        backgroundColor: colors._green,
        color: colors._white,
      });
      navigation.replace("LoginPage");
    } catch (err: any) {
      showMessage({
        icon: "warning",
        message: err.message || "An error occured",
        type: "default",
        backgroundColor: colors._red,
        color: colors._white,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={ImageSign}
        style={{ flex: 1, backgroundColor: colors._blue4 }}>
        <StatusBar
          hidden={false}
          translucent={true}
          barStyle={"light-content"}
          backgroundColor="transparent"
        />
        <View style={styles.main}>
          <Image
            source={LogoP}
            resizeMode="contain"
            style={{ width: 160, height: 50, marginTop: 10 }}
          />
          <Text style={styles.teks1}>Reset Your Password</Text>
          <Gap height={14} />
          <Text style={styles.teks2}>
            Please enter your email address to reset your password. You will
            receive a link to create a new password via email.
          </Text>
        </View>
        <Gap height={40} />
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: colors._white,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 24,
            paddingTop: 30,
          }}>
          <Controller
            name="email"
            control={form.control}
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
              />
            )}
          />
          {form.formState.errors.email && (
            <Text style={{ color: colors._red, marginTop: 4 }}>
              {form.formState.errors.email.message}
            </Text>
          )}
          <Gap height={25} />
          <ButtonColor
            teks="Reset Password"
            backColor={colors._blue2}
            textColor={colors._white}
            onPress={form.handleSubmit(onRegister)}
          />
        </ScrollView>
        {isLoading && <Loading />}
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = {
  container: {},
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
