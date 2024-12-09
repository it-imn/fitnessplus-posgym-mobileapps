import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import LinearGradient from "react-native-linear-gradient";
import SignatureScreen from "react-native-signature-canvas";
import {
  TransactionType,
  useTransactionStore,
} from "../../stores/useTransactionStore";
import Header from "../../components/ui/Header";
import { ButtonColor } from "../../components/ui/Button";
import Gap from "../../components/ui/Gap";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { IPTPackage } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { fetchPersonalTrainerDetailPackage } from "../../services/personal_trainer";
import { showMessage } from "react-native-flash-message";
import { ThemeContext } from "../../contexts/ThemeContext";
import Loading from "../../components/ui/Loading";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { useModalStore } from "../../stores/useModalStore";
import { SignatureModal } from "./MembershipDetailPage";

const DetailPackageTrainer = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailPackageTrainer">) => {
  const { id, pt_id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [feature, setFeature] = useState("");
  const [packagePT, setPackagePT] = useState<IPTPackage | null>(null);
  const { update, payment } = usePaymentStore();
  const { openModal, closeModal } = useModalStore();
  const gotoVoucher = () => {
    if (!payment.signature) {
      showMessage({
        message: "Please sign first",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return;
    }

    update({
      packageName: packagePT?.package_name,
      normalPrice: (packagePT?.base_price || 1) * (packagePT?.session || 1),
      totalPrice: packagePT?.total,
      packageId: packagePT?.id,
      packagePTId: packagePT?.package_personal_trainer_id,
      ptId: pt_id,
      isDpAvailable: packagePT?.down_payment,
      firstPayment: packagePT?.installment_first_pay.total_price,
    });

    // if (packagePT?.price_disc !== 0) {
    //   update({
    //     discountPrice: packagePT?.price_disc,
    //     discountType: "percent",
    //   });
    // }

    if (packagePT?.discount !== 0) {
      update({
        discountPrice: packagePT?.discount,
        discountType: "value",
      });
    }

    navigation.navigate("Payment");
  };

  const getPackage = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchPersonalTrainerDetailPackage(id);
      if (data) {
        setPackagePT(data);

        if (data.down_payment) {
          if (data.dp_discount !== 0) {
            setFeature(`${data.dp_discount}% DP Available`);
            return;
          }

          if (data.dp_price_disc !== 0) {
            setFeature(
              `${convertToRupiah(data.dp_price_disc.toString())} DP Available`,
            );
            return;
          }
        }

        if (!data.down_payment) {
          // if (data.price_disc !== 0) {
          //   setFeature(`Disc ${data.price_disc}%`);
          //   return;
          // }

          if (data.discount !== 0) {
            setFeature(convertToRupiah(data.discount.toString()));
            return;
          }
        }
      }
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

  React.useEffect(() => {
    getPackage();
  }, []);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Package PT" onPress={() => navigation.goBack()} />
      <View style={{ padding: 24, flex: 1 }}>
        <Image
          source={{
            uri: packagePT?.image,
          }}
          style={{
            width: 96,
            height: 96,
            alignSelf: "center",
            borderRadius: 4,
          }}
        />
        <Gap height={24} />
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? colors._grey4 : colors._grey3,
              fontFamily: fonts.primary[400],
            }}>
            Package Name
          </Text>
          <Gap height={4} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._black,
              lineHeight: 20,
            }}>
            {packagePT?.package_name}
          </Text>
          <Gap height={16} />
          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? colors._grey4 : colors._grey3,
              fontFamily: fonts.primary[400],
            }}>
            Periode
          </Text>
          <Gap height={4} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._black,
              lineHeight: 20,
            }}>
            {packagePT?.period}
          </Text>
          <Gap height={16} />
          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? colors._grey4 : colors._grey3,
              fontFamily: fonts.primary[400],
            }}>
            Session
          </Text>
          <Gap height={4} />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._black,
              lineHeight: 20,
            }}>
            {packagePT?.session} Session
          </Text>
          <Gap height={16} />
          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? colors._grey4 : colors._grey3,
              fontFamily: fonts.primary[400],
            }}>
            Total Price
          </Text>
          <Gap height={4} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            {convertToRupiah(packagePT?.total.toString() || "0")}
          </Text>
          <Gap height={16} />
          {feature !== "" && (
            <>
              <Text
                style={{
                  fontSize: 12,
                  color: isDarkMode ? colors._grey4 : colors._grey3,
                  fontFamily: fonts.primary[400],
                }}>
                Feature
              </Text>
              <Gap height={4} />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    backgroundColor: colors._blue,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                    borderRadius: 4,
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontFamily: fonts.primary[400],
                      color: isDarkMode ? colors._white : colors._black,
                      lineHeight: 20,
                    }}>
                    {feature}
                  </Text>
                </View>
                <Gap width={4} />
              </View>
            </>
          )}
        </View>
        <View style={{ flex: 1 }} />
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            justifyContent: "flex-start",
          }}>
          <BouncyCheckbox
            isChecked={payment.signature !== ""}
            onPress={() =>
              openModal({
                children: (
                  <SignatureModal
                    closeModal={() => closeModal()}
                    setSignature={signature => {
                      update({
                        signature: signature,
                      });
                    }}
                  />
                ),
              })
            }
            fillColor={colors._blue}
            unFillColor={isDarkMode ? colors._black : colors._white}
            iconImageStyle={{ tintColor: colors._black }}
          />
          <Gap width={8} />
          <Text style={styles.teks4(isDarkMode)}>I agree to </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Agreement");
            }}>
            <Text style={styles.teks4(isDarkMode)}>
              Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={16} />
        <ButtonColor
          disabled={!payment.signature}
          backColor={colors._blue2}
          textColor={colors._white}
          teks="Continue"
          onPress={gotoVoucher}
        />
      </View>
      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  teks: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
    marginTop: 12,
  }),
  teks2: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks3: (isDarkMode: boolean) =>
    ({
      color: isDarkMode ? colors._grey4 : colors._grey3,
      fontSize: 12,
      fontFamily: fonts.primary[600],
      textAlign: "center",
    } as StyleProp<ViewStyle>),
  teks4: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
    lineHeight: 20,
  }),
  button: {
    backgroundColor: colors._white,
    borderRadius: 8,
    height: 45,
    shadowColor: colors._black,
    shadowOffset: {
      width: 0.1,
      height: 0.1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 1.5,
    paddingLeft: 16,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors._black3,
  },
  modalView: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black : colors._grey2,
    padding: 12,
    width: "90%",
    borderRadius: 8,
  }),
  buttonDrop: {
    padding: 8,
  },
  setButton: {
    backgroundColor: "deepskyblue",
    textAlign: "center",
    fontWeight: "900",
    color: "#fff",
    // marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  } as StyleProp<ViewStyle>,
  mainModal: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    // alignItems: 'center',
    flex: 1,
    padding: 24,
  } as StyleProp<ViewStyle>,
  subModal: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 24,
    position: "relative",
    height: 400,
  } as StyleProp<ViewStyle>,
  teks6: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._black : colors._white,
    lineHeight: 20,
  }),
};

export default DetailPackageTrainer;
