import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ArrowBlack, WhatsApp } from "../../assets/index.js";
import { Theme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IPersonalTrainer, ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { fetchDetailPersonalTrainer } from "../../services/personal_trainer";
import { showMessage } from "react-native-flash-message";
import { Button } from "../../components/ui/Button";

const width = Dimensions.get("window").width;

const DetailPT = ({
  route,
  navigation,
}: NativeStackScreenProps<RootStackParamList, "DetailPT">) => {
  const { id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [personalTrainer, setPersonalTrainer] = useState<IPersonalTrainer>(
    {} as IPersonalTrainer,
  );
  // const [code, setCode] = useState('');
  // const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onWA = () => {
    Linking.openURL(
      `whatsapp://send?text=hello Mr. ${personalTrainer.name}..&phone=+62${personalTrainer.phone}`,
    );
  };

  const gotoPackage = async () => {
    // getData('userProfile').then(res => {
    //   const Post = async () => {
    //     try {
    //       const data = {
    //         code: code,
    //       };
    //       const response = await Api.checkPTCode(res.token, id, data);
    //       if (
    //         response.data.message ==
    //         'Congratulations, you have successfully entered the code'
    //       ) {
    //         getData('userProfile').then(res => {
    //           const params = {
    //             id: id,
    //             name: res.name,
    //             email: res.email,
    //             phone: res.phone,
    //             token: res.token,
    //             item_name: name,
    //             isDarkMode: boolean,
    //             pt_id: response.data.data.personal_trainer_id,
    //           };
    //           setCode('');
    //           setModalVisible(!modalVisible);
    //           navigation.navigate('PackageTrainer', params);
    //         });
    //       } else {
    //         showMessage({
    //           icon: 'danger',
    //           message: 'Token you entered is wrong',
    //           type: 'default',
    //           backgroundColor: colors._red,
    //           color: colors._white,
    //         });
    //         setModalVisible(!modalVisible);
    //       }
    //     } catch (error) {}
    //   };
    //   Post();
    // });
    navigation.navigate("PackageTrainer", { id });
  };

  const getDetailPT = async () => {
    try {
      setIsLoading(true);

      const { data } = await fetchDetailPersonalTrainer(id);
      if (data) {
        setPersonalTrainer(data);
      }

      setIsLoading(false);
    } catch (error: any) {
      showMessage({
        message: error.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDetailPT();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <ImageBackground
        source={{ uri: personalTrainer.image }}
        style={{ height: "50%", flex: 1 }}
        imageStyle={{
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
        }}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => navigation.goBack()}>
            <ArrowBlack />
          </TouchableOpacity>
          {/* <Text style={styles.teksHeader}>Profile PT</Text> */}
          <View style={{ width: 24, height: 24 }} />
        </View>
        <View style={styles.content(isDarkMode)}>
          <View style={{ flex: 1 }}>
            <View style={styles.topContent}>
              <Text style={styles.teksName(isDarkMode)}>
                {personalTrainer.name}
              </Text>
              <TouchableOpacity onPress={onWA}>
                <WhatsApp />
              </TouchableOpacity>
            </View>
            <Gap height={4} />
            <Text style={styles.teksSecondary(isDarkMode)}>
              {personalTrainer.gender}, {personalTrainer.age} year
            </Text>
            <Gap height={20} />
            <Text style={styles.teksThird(isDarkMode)}>Specification</Text>
            <Gap height={4} />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.teksSecondary(isDarkMode)}>
                {personalTrainer.specification}
              </Text>
              <Gap height={16} />
            </ScrollView>
          </View>
          <Button teks="View Package" onPress={() => gotoPackage()} />
        </View>
      </ImageBackground>

      {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.mainModal}>
          <View style={styles.contentModal(isDarkMode)}>
            <TouchableOpacity
              style={styles.closeModal}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors._black,
                  fontFamily: fonts.primary[400],
                }}>
                x
              </Text>
            </TouchableOpacity>
            <Gap height={8} />
            <Text style={styles.teksThird(isDarkMode)}>
              Input token to view package
            </Text>
            <Gap height={8} />
            <TextInput
              style={styles.inputCode(isDarkMode)}
              placeholderTextColor={colors._grey4}
              placeholder="ex. ABCDEFG123"
              value={code}
              onChangeText={value => setCode(value)}
            />
            <Gap height={8} />
            <Button teks="Submit" onPress={gotoPackage} />
          </View>
        </View>
      </Modal> */}
      {isLoading && <Loading />}
    </SafeAreaView>
  );
};
const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  content: (isDarkMode: boolean) =>
    ({
      backgroundColor: isDarkMode ? colors._black : colors._grey2,
      position: "absolute",
      bottom: 16,
      width: width - 32,
      height: "60%",
      marginHorizontal: 16,
      padding: 24,
      borderRadius: 30,
      justifyContent: "space-between",
    } as StyleProp<ViewStyle>),
  topContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  } as StyleProp<ViewStyle>,
  teksName: (isDarkMode: boolean) =>
    ({
      fontSize: 18,
      fontFamily: fonts.primary[600],
      color: isDarkMode ? colors._white : colors._black,
      width: "80%",
      lineHeight: 30,
    } as StyleProp<ViewStyle>),
  teksSecondary: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
    lineHeight: 20,
  }),
  teksThird: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  } as StyleProp<ViewStyle>,
  btnBack: {
    width: 34,
    height: 34,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors._white,
  } as StyleProp<ViewStyle>,
  teksHeader: {
    color: colors._black,
    fontFamily: fonts.primary[600],
    fontSize: 22,
  },
  mainModal: {
    width: "100%",
    height: "100%",
    backgroundColor: colors._black3,
    alignItems: "center",
    justifyContent: "center",
  } as StyleProp<ViewStyle>,
  closeModal: {
    width: 24,
    height: 24,
    backgroundColor: colors._white,
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  } as StyleProp<ViewStyle>,
  contentModal: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
    padding: 16,
    borderRadius: 20,
  }),
  inputCode: (isDarkMode: boolean) =>
    ({
      color: isDarkMode ? colors._grey4 : colors._black,
      fontSize: 16,
      fontFamily: fonts.primary[300],
      padding: 8,
      maxWidth: "50%",
    } as StyleProp<ViewStyle>),
};

export default DetailPT;
