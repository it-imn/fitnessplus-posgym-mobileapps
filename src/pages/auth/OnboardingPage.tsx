import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ImageBackgroundProps,
  StatusBar,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Onboarding1, Onboarding2, Onboarding3 } from "../../assets";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Gap from "../../components/ui/Gap";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";

const windowWidth = Dimensions.get("window").width;

export const OnBoarding = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Onboarding">) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const updateCurrentSlideIndex = (e: any) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / windowWidth);
    setCurrentSlideIndex(currentIndex);
  };

  const data = [
    {
      id: 1,
      image: Onboarding1,
      title: "GET STRONG\nTODAY RUN AND\nEXTRA MILE",
    },
    {
      id: 2,
      image: Onboarding2,
      title: "BUILD YOUR\nBODY GOOD\nYOUR LIFESTYLE",
    },
    {
      id: 3,
      image: Onboarding3,
      title: "LETS MAKE\nBODY WITH A\nGOOD SHAP",
    },
  ];

  const gotoLogin = () => {
    navigation.replace("LoginPage");
  };

  const Slide = ({ item }: any) => {
    return (
      <ImageBackground
        source={item.background}
        style={
          {
            flex: 1,
            width: windowWidth / 1,
            flexDirection: "column",
            justifyContent: "space-between",
          } as StyleProp<ImageBackgroundProps>
        }>
        <Image
          source={item.image}
          resizeMode="cover"
          style={{
            width: windowWidth / 1,
            height: "70%",
          }}
        />
        <View style={{ paddingHorizontal: 30, flex: 1 }}>
          <View>
            <Text
              style={{
                color: colors._white,
                fontSize: 24,
                fontFamily: fonts.primary[700],
                fontWeight: "600",
              }}>
              {item.title}
            </Text>
          </View>
        </View>
        <Gap height={40} />
        <View
          style={{ flex: 0.2, flexDirection: "row", justifyContent: "center" }}>
          {data.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex === index && {
                  backgroundColor: colors._grey2,
                  width: 26,
                },
              ]}
            />
          ))}
        </View>
        <View style={{ marginBottom: 20, flex: 0.6, marginHorizontal: 30 }}>
          <TouchableOpacity style={styles.btn} onPress={gotoLogin}>
            <Text style={styles.textBtn}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <View style={{ flex: 2 } as StyleProp<ViewStyle>}>
        <FlatList
          onMomentumScrollEnd={updateCurrentSlideIndex}
          showsHorizontalScrollIndicator={false}
          horizontal
          data={data}
          pagingEnabled
          renderItem={({ item }) => <Slide item={item} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors._blue4,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors._blue2, // colors.tel2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  indicator: {
    height: 8,
    width: 14,
    backgroundColor: colors._grey4,
    marginHorizontal: 4,
    borderRadius: 4,
  },
  btn: {
    height: 50,
    backgroundColor: colors._btnBoard,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  textBtn: {
    fontSize: 16,
    fontFamily: fonts.primary[700],
    color: colors._white,
  },
});
