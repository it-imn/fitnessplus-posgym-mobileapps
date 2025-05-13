import { useIsFocused } from "@react-navigation/native";
import React, { useContext, useEffect } from "react";
import {
  GestureResponderEvent,
  Image,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ThemeContext } from "../contexts/ThemeContext";
import { colors } from "../lib/utils";
import { LabelPosition } from "@react-navigation/bottom-tabs/lib/typescript/src/types";
import {
  HistoryBlue,
  HistoryGrey,
  HomeBlue,
  HomeGrey,
  IconAnyTransfer,
  IconQrWhite,
  ProfileBlue,
  ProfileGrey,
  ReportBlue,
  ReportGrey,
} from "../assets";
import LinearGradient from "react-native-linear-gradient";

export const BottomNavbar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const isFocused = useIsFocused();
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    isFocused;
  }, [isFocused]);

  return (
    <View style={styles.container(isDarkMode)}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused2 = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused2 && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabItems
            key={index}
            title={label}
            active={isFocused2}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
};

const TabItems = ({
  title,
  active,
  onPress,
  onLongPress,
}: {
  title:
    | string
    | ((props: {
        focused: boolean;
        color: string;
        position: LabelPosition;
        children: string;
      }) => React.ReactNode);
  active: boolean;
  onPress: (event: GestureResponderEvent) => void | undefined;
  onLongPress: (event: GestureResponderEvent) => void | undefined;
}) => {
  const Icon = ({ width, height }: { width: number; height: number }) => {
    if (title === "Home") {
      return active ? (
        <HomeBlue width={width} height={height} />
      ) : (
        <HomeGrey width={width} height={height} />
      );
    }
    if (title === "Report") {
      return active ? (
        <ReportBlue width={width} height={height} />
      ) : (
        <ReportGrey width={width} height={height} />
      );
    }
    if (title === "MyQRCode") {
      return (
        <LinearGradient
          colors={[colors._green2, colors._blue2]}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{
            backgroundColor: colors._red,
            borderRadius: 100,
            transform: [
              {
                translateY: -4,
              },
            ],
            width: 56,
            height: 56,
            // padding: 4,
            justifyContent: "center",
            alignItems: "center",
          }}>
          <IconQrWhite width={40} height={40} />
        </LinearGradient>
      );
    }
    if (title === "History") {
      return active ? (
        <HistoryBlue width={width} height={height} />
      ) : (
        <HistoryGrey width={width} height={height} />
      );
    }
    if (title === "Profil") {
      return active ? (
        <ProfileBlue width={width} height={height} />
      ) : (
        <ProfileGrey width={width} height={height} />
      );
    }
    return <HomeBlue width={width} height={height} />;
  };
  return (
    <TouchableOpacity
      style={styles.containerTabItem}
      onPress={onPress}
      onLongPress={onLongPress}>
      <Icon width={24} height={24} />
    </TouchableOpacity>
  );
};

const styles = {
  containerTabItem: {
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
    margin: 12,
  } as StyleProp<ViewStyle>,
  container: (isDarkMode: boolean) =>
    ({
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 5,
      paddingHorizontal: 24,
      backgroundColor: isDarkMode ? colors._black2 : colors._white,
    } as StyleProp<ViewStyle>),
};
