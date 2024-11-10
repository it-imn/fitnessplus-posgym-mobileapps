import React from "react";
import {
  ColorValue,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors, fonts } from "../../lib/utils";
import {
  AskIcon,
  InvitationIcon,
  StarIcon,
  Exercise,
  IconClass,
  PersonalTrainerIcon,
  Progress,
  Frequency,
  IconSave,
  IconShare,
  Biodata,
  Password,
  IconCamera,
  IconDeleteAccount,
  IconSetting,
  IconMembershipAgreement,
  Subscribe,
  Approval,
  History,
  RightArrowWhite,
} from "../../assets";
import Gap from "./Gap";

export const Button = ({
  teks,
  onPress,
  disabled,
}: {
  teks: string;
  onPress: () => void;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <LinearGradient
        colors={[colors._green2, colors._blue2]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}>
        <Text
          style={{
            color: colors._white,
            fontSize: 16,
            fontFamily: fonts.primary[400],
            textAlign: "center",
          }}>
          {teks}
        </Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export const ButtonColor = ({
  teks,
  onPress,
  backColor,
  textColor,
  disabled,
}: any) => {
  return (
    <TouchableOpacity
      style={styles.containerColor(backColor)}
      onPress={onPress}
      disabled={disabled}>
      <Text style={styles.teks(textColor)}>{teks}</Text>
    </TouchableOpacity>
  );
};

export const ButtonIconTeks = ({
  teksColor,
  backColor,
  teks,
  type,
  onPress,
  noIcon = true,
}: {
  teksColor: ColorValue;
  backColor: ColorValue;
  teks: string;
  type: string;
  onPress: () => void;
  noIcon?: boolean;
}) => {
  return (
    <TouchableOpacity
      style={styles.tombol(backColor, noIcon)}
      onPress={onPress}>
      <Gap width={10} />
      <View
        style={{
          width: 25,
          height: 25,
          alignItems: "center",
          justifyContent: "center",
        }}>
        {type === "about" && <AskIcon width={24} height={24} />}
        {type === "invitation" && <InvitationIcon width={24} height={24} />}
        {type === "rating" && <StarIcon width={24} height={24} />}
        {type === "exercise" && <Exercise width={24} height={24} />}
        {type === "class" && <IconClass width={24} height={24} />}
        {type === "personaltrainer" && (
          <PersonalTrainerIcon width={24} height={24} />
        )}
        {type === "progress" && <Progress width={24} height={24} />}
        {type === "frequency" && <Frequency width={24} height={24} />}
        {type === "save" && <IconSave width={24} height={24} />}
        {type === "share" && <IconShare width={24} height={24} />}
        {type === "biodata" && <Biodata width={24} height={24} />}
        {type === "password" && <Password width={24} height={24} />}
        {type === "camera" && <IconCamera width={24} height={24} />}
        {type === "deleteAccount" && (
          <IconDeleteAccount width={24} height={24} />
        )}
        {type === "setting" && <IconSetting width={24} height={24} />}
        {type === "membershipagreement" && (
          <IconMembershipAgreement width={24} height={24} />
        )}
        {type === "subscribe" && <Subscribe width={24} height={24} />}
        {type === "approval" && <Approval width={24} height={24} />}
        {type === "class-history" && <History width={24} height={24} />}
      </View>
      <Gap width={10} />
      <Text numberOfLines={1} style={styles.teksIcon(teksColor)}>
        {teks}
      </Text>
      <View style={{ flex: 1 }} />
      <RightArrowWhite />
      <Gap width={10} />
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  } as StyleProp<ViewStyle>,
  containerColor: (backColor: ColorValue) =>
    ({
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: backColor,
      padding: 16,
      borderRadius: 8,
      width: "100%",
    } as StyleProp<ViewStyle>),
  teks: (textColor: ColorValue) => ({
    fontSize: 16,
    color: textColor,
    fontFamily: fonts.primary[400],
  }),
  tombol: (backColor: ColorValue, noIcon: boolean) =>
    ({
      paddingVertical: 14,
      paddingHorizontal: noIcon ? 0 : 16,
      backgroundColor: backColor,
      borderRadius: 10,
      alignItems: "center",
      flexDirection: "row",
    } as StyleProp<ViewStyle>),
  teksIcon: (teksColor: ColorValue) => ({
    color: teksColor,
    fontSize: 14,
    fontFamily: fonts.primary[300],
  }),
};
