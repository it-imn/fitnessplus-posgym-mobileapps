import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType, UserDetail } from "../../lib/definition";
import { RootStackParamList, TabParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import NoData from "../../components/ui/NoData";
import { fetchProfile } from "../../services/profile";
import { showMessage } from "react-native-flash-message";
import Header from "../../components/ui/Header";
import StatusBarComp from "../../components/ui/StatusBarComp";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import { RefreshCwIcon } from "lucide-react-native";

export const MyQRCode = ({
  navigation,
}: CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "MyQRCode">,
  NativeStackScreenProps<RootStackParamList, "MainApp">
>) => {
  const { isDarkMode } = useContext(ThemeContext);

  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserDetail | null>(null);

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchProfile();
      setProfile(data);
    } catch (err: any) {
      showMessage({
        message: err.message || "An error occurred",
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
    isFocused && getProfile();
  }, [isFocused]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Text
        style={{
          color: isDarkMode ? colors._white : colors._black,
          fontFamily: fonts.primary[600],
          fontSize: 22,
          textAlign: "center",
          padding: 20,
        }}>
        My QR Code
      </Text>
      <Gap height={24} />
      <View style={{ paddingHorizontal: 24 }}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.primary[400],
            color: isDarkMode ? colors._grey2 : colors._black,
            textAlign: "center",
          }}>
          {profile?.qrcode?.code}
        </Text>
        <Gap height={16} />
        <Image
          src={profile?.qrcode?.url}
          style={{
            width: 250,
            height: 250,
            alignSelf: "center",
          }}
          resizeMode="contain"
        />
        <Gap height={16} />
        <TouchableOpacity
          onPress={() => {
            getProfile();
          }}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Text
            style={{
              textDecorationLine: "underline",
              fontSize: 14,
              fontFamily: fonts.primary[400],
              color: colors._gold3,
            }}>
            Refresh
          </Text>
          <Gap width={8} />
          <RefreshCwIcon color={colors._gold3} />
        </TouchableOpacity>
        <Gap height={64} />
        <Text
          style={{
            fontSize: 24,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._grey2 : colors._black,
            textAlign: "center",
          }}>
          {profile?.qrcode?.name}
        </Text>
        <Gap height={16} />
        <Text
          style={{
            fontSize: 14,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._grey2 : colors._black,
            textAlign: "center",
          }}>
          Berlaku hingga{" "}
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.primary[300],
              color: colors._blue2,
            }}>
            {profile?.qrcode?.expiredAt}
          </Text>
        </Text>
      </View>

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
