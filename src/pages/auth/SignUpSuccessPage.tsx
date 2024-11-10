import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useContext } from "react";
import { SafeAreaView, Text } from "react-native";
import { IconSuccess } from "../../assets";
import Gap from "../../components/ui/Gap";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { Button, ButtonColor } from "../../components/ui/Button";

export const SignUpSuccess = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SignUpSuccess">) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <IconSuccess height={96} width={96} />
      <Gap height={24} />
      <Text
        style={{
          fontFamily: fonts.primary[400],
          fontSize: 24,
          color: isDarkMode ? colors._white : colors._black,
        }}>
        Register Success!
      </Text>
      <Text
        style={{
          textAlign: "center",
          fontFamily: fonts.primary[300],
          fontSize: 16,
          paddingHorizontal: 24,
          color: isDarkMode ? colors._white : colors._black,
        }}>
        Your register was successful. Login through the button below.
      </Text>
      <Gap height={24} />
      <ButtonColor
        backColor={colors._blue2}
        textColor={colors._white}
        teks="Go To Login"
        onPress={() => navigation.replace("LoginPage")}
      />
    </SafeAreaView>
  );
};
