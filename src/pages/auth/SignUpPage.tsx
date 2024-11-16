import { Picker } from "@react-native-picker/picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import {
  Image,
  ImageBackground,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { useCameraPermission } from "react-native-vision-camera";
import { ImageSign, LogoP } from "../../assets";
import { Button, ButtonColor } from "../../components/ui/Button";
import Gap from "../../components/ui/Gap";
import { Input, Inputeye } from "../../components/ui/Input";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { useModalStore } from "../../stores/useModalStore";
import { useSignUpStore } from "../../stores/useSignUpStore";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { validateSignUp } from "../../services/member";
import Loading from "../../components/ui/Loading";

const signUpSchema = z
  .object({
    name: z.string().min(1, "Name required").max(250, "Name too long"),
    email: z.string().email("Enter correct email").min(1, "Email required"),
    phone: z
      .string()
      .max(16, "Phone number up to 16 characters")
      .min(9, "Phone number at least 9 characters")
      .regex(
        new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
        "Invalid Phone Number!",
      ),
    gender: z.enum(["male", "female", "rather_not_say"]),
    birthDate: z.date().refine(value => value < new Date(), {
      message: "Birth date must be less than today",
    }),
    address: z.string().min(1, "Address required"),
    username: z.string().min(1, "Username required"),
    password: z.string().min(8, "Password less than 8 characters"),
    confirmPassword: z.string().min(8, "Password less than 8 characters"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Password not match",
    path: ["confirmPassword"],
  });

export const SignUp = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SignUp">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const { update } = useSignUpStore();
  const { hasPermission, requestPermission } = useCameraPermission();
  const { openModal, closeModal } = useModalStore();
  const [showDatePickerIOS, setShowDatePickerIOS] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      gender: "rather_not_say",
      address: "",
      birthDate: new Date(),
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onRegister = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true);
      await validateSignUp({
        ...values,
        birthdate: values.birthDate.toISOString().slice(0, 10),
        password_confirmation: values.confirmPassword,
      });
    } catch (err: any) {
      if (err.errors) {
        if (err.errors.name && err.errors.name.length > 0) {
          form.setError("name", {
            type: "manual",
            message: err.errors.name[0],
          });
        }

        if (err.errors.gender && err.errors.gender.length > 0) {
          form.setError("gender", {
            type: "manual",
            message: err.errors.gender[0],
          });
        }

        if (err.errors.email && err.errors.email.length > 0) {
          form.setError("email", {
            type: "manual",
            message: err.errors.email[0],
          });
        }

        if (err.errors.phone && err.errors.phone.length > 0) {
          form.setError("phone", {
            type: "manual",
            message: err.errors.phone[0],
          });
        }

        if (err.errors.birthdate && err.errors.birthdate.length > 0) {
          form.setError("birthDate", {
            type: "manual",
            message: err.errors.birthdate[0],
          });
        }

        if (err.errors.address && err.errors.address.length > 0) {
          form.setError("address", {
            type: "manual",
            message: err.errors.address[0],
          });
        }

        if (err.errors.username && err.errors.username.length > 0) {
          form.setError("username", {
            type: "manual",
            message: err.errors.username[0],
          });
        }

        if (err.errors.password && err.errors.password.length > 0) {
          form.setError("password", {
            type: "manual",
            message: err.errors.password[0],
          });
        }
        return;
      }

      showMessage({
        icon: "warning",
        message: err.message || "An error occured",
        type: "default",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return;
    } finally {
      setIsLoading(false);
    }

    update({
      ...values,
    });

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
              Exclusive Gym Portal for Posgym member
            </Text>
          </View>
          <Gap height={40} />
          <ScrollView style={styles.main2}>
            <Controller
              name="name"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Full Name"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {form.formState.errors.name && (
              <Text style={{ color: colors._red, marginTop: 4 }}>
                {form.formState.errors.name.message}
              </Text>
            )}
            <Gap height={20} />
            <Controller
              name="email"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Email"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {form.formState.errors.email && (
              <Text style={{ color: colors._red, marginTop: 4 }}>
                {form.formState.errors.email.message}
              </Text>
            )}
            <Gap height={20} />
            <Controller
              name="phone"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Phone Number"
                  keyboardType="phone-pad"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {form.formState.errors.phone && (
              <Text style={{ color: colors._red, marginTop: 4 }}>
                {form.formState.errors.phone.message}
              </Text>
            )}
            <Gap height={20} />
            <Text style={styles.teks(isDarkMode)}>Select Gender</Text>
            <View
              style={{
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                borderWidth: Platform.OS === "android" ? 0.5 : 0,
                borderColor: isDarkMode ? colors._grey4 : colors._grey3,
              }}>
              <Controller
                name="gender"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
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
                    dropdownIconColor={
                      isDarkMode ? colors._white : colors._black
                    }
                    onValueChange={onChange}>
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
                )}
              />
            </View>
            <Gap height={20} />
            <Text
              style={{
                color: isDarkMode ? colors._white : colors._black,
                marginBottom: 5,
                fontSize: 14,
                fontFamily: fonts.primary[400],
              }}>
              Birth Date
            </Text>
            <Controller
              name="birthDate"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={{
                    padding: 12,
                    backgroundColor: isDarkMode ? colors._black : colors._grey2,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: isDarkMode ? colors._grey4 : colors._grey3,
                  }}
                  onPress={() => {
                    if (Platform.OS === "android") {
                      DateTimePickerAndroid.open({
                        value: value,
                        mode: "date",
                        onChange: (_, selectedDate) => {
                          if (selectedDate) {
                            onChange(selectedDate);
                          }
                        },
                      });
                    } else if (Platform.OS === "ios") {
                      setShowDatePickerIOS(true);
                    }
                  }}>
                  <Text
                    style={{
                      color: isDarkMode ? colors._white : colors._black,
                      fontSize: 14,
                      fontFamily: fonts.primary[400],
                    }}>
                    {form.getValues("birthDate").toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {showDatePickerIOS && (
              <Controller
                name="birthDate"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onChange={(_, selectedDate) => {
                      setShowDatePickerIOS(false);
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                )}
              />
            )}
            {form.formState.errors.birthDate && (
              <Text style={{ color: colors._red, marginTop: 4 }}>
                {form.formState.errors.birthDate.message}
              </Text>
            )}
            <Gap height={20} />
            <Controller
              name="address"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Address"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {form.formState.errors.address && (
              <Text style={{ color: colors._red, marginTop: 4 }}>
                {form.formState.errors.address.message}
              </Text>
            )}
            <Gap height={20} />
            <Controller
              name="username"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Username"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {form.formState.errors.username && (
              <Text style={{ color: colors._red, marginTop: 4 }}>
                {form.formState.errors.username.message}
              </Text>
            )}
            <Gap height={20} />
            <Controller
              name="password"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Inputeye
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {form.formState.errors.password && (
              <Text style={{ color: colors._red, marginTop: 4 }}>
                {form.formState.errors.password.message}
              </Text>
            )}
            <Gap height={20} />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <Inputeye
                  placeholder="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {form.formState.errors.confirmPassword && (
              <Text style={{ color: colors._red, marginTop: 4 }}>
                {form.formState.errors.confirmPassword.message}
              </Text>
            )}
            <Gap height={25} />
            <ButtonColor
              teks="Continue"
              backColor={colors._blue2}
              textColor={colors._white}
              onPress={form.handleSubmit(onRegister)}
            />
          </ScrollView>
          {isLoading && <Loading />}
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
