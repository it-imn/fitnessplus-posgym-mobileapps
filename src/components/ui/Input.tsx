import React, { useContext, useState } from "react";
import {
  ColorValue,
  KeyboardTypeOptions,
  Platform,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { colors, fonts } from "../../lib/utils";
import { EyeWhite, EyeSeeWhite, Eye, EyeSee } from "../../assets";

export const Input = ({
  placeholder,
  keyboardType,
  maxLength,
  underlineColorAndroid,
  value,
  onChangeText,
  autoCapitalize,
  multiline,
}: {
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  underlineColorAndroid?: ColorValue;
  value?: string;
  onChangeText: (value: string) => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  multiline?: boolean;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View>
      <Text style={styles.teks2(isDarkMode)}>{placeholder}</Text>
      <TextInput
        style={styles.input(isDarkMode)}
        autoCapitalize={autoCapitalize}
        placeholderTextColor={colors._grey4}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholder={placeholder}
        underlineColorAndroid={underlineColorAndroid}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
      />
    </View>
  );
};

export const Inputeye = ({
  placeholder,
  keyboardType,
  maxLength,
  underlineColorAndroid,
  value,
  onChangeText,
}: {
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  underlineColorAndroid?: ColorValue;
  value: string;
  onChangeText: (value: string) => void;
}) => {
  const [see, setsee] = useState(true);
  const onSee = () => {
    setsee(!see);
  };

  const { isDarkMode } = useContext(ThemeContext);

  return (
    <View>
      <Text style={styles.teksEye(isDarkMode)}>{placeholder}</Text>
      <TextInput
        style={styles.inputEye(isDarkMode)}
        secureTextEntry={see}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor={colors._grey4}
        underlineColorAndroid={underlineColorAndroid}
        value={value}
        onChangeText={onChangeText}
      />
      <TouchableOpacity style={styles.eye} onPress={onSee}>
        {isDarkMode ? (
          <View style={styles.icon}>
            {see ? (
              <EyeWhite width={24} height={24} />
            ) : (
              <EyeSeeWhite width={24} height={24} />
            )}
          </View>
        ) : (
          <View style={styles.icon}>
            {see ? (
              <Eye width={24} height={24} />
            ) : (
              <EyeSee width={24} height={24} />
            )}
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  input: (isDarkMode: boolean) => ({
    padding: 12,
    fontSize: 13,
    fontFamily: fonts.primary[300],
    backgroundColor: isDarkMode ? colors._black : colors._grey2,
    borderRadius: 10,
    color: isDarkMode ? colors._white : colors._black,
    borderWidth: 0.5,
    borderColor: isDarkMode ? colors._grey4 : colors._grey3,
  }),
  teks2: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    marginBottom: 4,
    fontSize: 14,
    fontFamily: fonts.primary[400],
  }),
  inputEye: (isDarkMode: boolean) =>
    ({
      padding: 12,
      width: "100%",
      fontSize: 13,
      fontFamily: fonts.primary[300],
      backgroundColor: isDarkMode ? colors._black : colors._grey2,
      borderRadius: 10,
      color: isDarkMode ? colors._white : colors._black,
      position: "relative",
      borderWidth: 0.5,
      borderColor: isDarkMode ? colors._grey4 : colors._grey3,
    } as StyleProp<ViewStyle>),
  eye: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "ios" ? 26 : 32,
  } as StyleProp<ViewStyle>,
  teksEye: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    marginBottom: 5,
    fontSize: 14,
    fontFamily: fonts.primary[400],
  }),
  icon: {
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
  } as StyleProp<ViewStyle>,
};
