import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  TransactionType,
  useTransactionStore,
} from "../../stores/useTransactionStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { showMessage } from "react-native-flash-message";
import Header from "../../components/ui/Header";
import { IconDown } from "../../assets";
import { ButtonColor } from "../../components/ui/Button";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import { IMembershipPackageDetail, ISales } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { fetchMembershipPackageDetail } from "../../services/membership";
import { fetchSales } from "../../services/sales";
import { ThemeContext } from "../../contexts/ThemeContext";
import SignatureView from "react-native-signature-canvas";
import { useModalStore } from "../../stores/useModalStore";

export const MembershipDetail = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "MembershipDetail">) => {
  const { id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [modalSales, setModalSales] = useState(false);
  // const [modalDp, setModalDp] = useState(false);
  const [signature, setSignature] = useState<string>("");
  const [sales_id, setSales_id] = useState(0);
  // const [down_pay, setdown_pay] = useState('');
  const [labels, setLabels] = useState("Select member consultant name");
  const { openModal, closeModal } = useModalStore();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [membershipPackage, setMembershipPackage] =
    React.useState<IMembershipPackageDetail>({
      installment_first_pay: {
        total_price: 0,
      },
    } as IMembershipPackageDetail);
  const [sales, setSales] = useState<ISales[]>([]);

  const { update, reset } = useTransactionStore();

  const getPackage = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchMembershipPackageDetail(id);
      if (data) {
        setMembershipPackage(data);
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

  const onNext = () => {
    let error = [];
    if (signature === "") {
      error.push("Signature required");
    }
    if (sales_id === 0) {
      error.push("Member Consultant required");
    }
    if (error.length > 0) {
      // setLoading(false);
      showMessage({
        icon: "warning",
        message: error[0],
        type: "default",
        backgroundColor: colors._red,
        color: colors._white,
      });
    } else {
      reset();

      update({
        transaction: {
          sales_id: sales_id,
          sales_name: sales.find(data => data.id === sales_id)?.name || "",
          sales_email: sales.find(data => data.id === sales_id)?.email || "",
          membership_id: id,
          down_payment_membership: 0,
          down_payment_label:
            membershipPackage.down_payment_membership == 1
              ? `${convertToRupiah(
                  membershipPackage.installment_first_pay.total_price.toString(),
                )} Dp Available`
              : "",
        },
        type: TransactionType.MEMBERSHIP,
        signature: signature,
        normal_price: membershipPackage.total_price,
        final_price: membershipPackage.total_price,
        name: membershipPackage.name,
      });
      navigation.navigate("Voucher");
    }
  };

  const getSales = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchSales();
      if (data) {
        setSales(data);
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

  const gotoTerm = () => {
    navigation.navigate("Agreement");
  };

  const selectSales = (params: any) => {
    setSales_id(params.id);
    setLabels(params.label);
    setModalSales(!modalSales);
  };

  useEffect(() => {
    getSales();
    getPackage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <Header
        teks={membershipPackage.name}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Image
          source={{
            uri: membershipPackage.image,
          }}
          style={{
            width: 50,
            height: 50,
            alignSelf: "center",
            borderRadius: 4,
          }}
        />
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Description
        </Text>
        <Gap height={4} />
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            lineHeight: 20,
          }}>
          {membershipPackage.desc}
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
          }}>{`${membershipPackage.periode}`}</Text>
        <Gap height={16} />
        {membershipPackage.down_payment_membership === 1 && (
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
                  {membershipPackage.installment_first_pay?.total_price &&
                    convertToRupiah(
                      membershipPackage.installment_first_pay.total_price.toString() ||
                        "0",
                    )}{" "}
                  Dp Available
                </Text>
              </View>
              <Gap width={4} />
            </View>
          </>
        )}
        <Gap height={16} />
        <Text
          style={{
            fontSize: 12,
            color: isDarkMode ? colors._grey4 : colors._grey3,
            fontFamily: fonts.primary[400],
          }}>
          Price
        </Text>
        <Gap height={4} />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: fonts.primary[400],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            {convertToRupiah(
              membershipPackage?.total_price !== undefined
                ? membershipPackage.total_price.toString()
                : "0",
            )}
          </Text>
        </View>
        <Gap height={16} />
        <View>
          <TouchableOpacity
            style={styles.button(isDarkMode)}
            onPress={() => {
              openModal({
                children: (
                  <ScrollView>
                    {sales.map((data: ISales) => {
                      return (
                        <TouchableOpacity
                          key={data.id}
                          style={styles.buttonDrop}
                          onPress={() => {
                            selectSales({ id: data.id, label: data.name });
                            closeModal();
                          }}>
                          <Text style={styles.teks5(isDarkMode)}>
                            {data.name}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ),
              });
            }}>
            <Text style={styles.teks5(isDarkMode)}>{labels}</Text>
          </TouchableOpacity>
          <View style={{ position: "absolute", right: 12, top: 12 }}>
            <IconDown />
          </View>
        </View>
        <Gap height={16} />
        <View style={{ flex: 1 }} />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "center",
          }}>
          <BouncyCheckbox
            isChecked={toggleCheckBox}
            onPress={() =>
              openModal({
                children: (
                  <SignatureModal
                    checkAgreement={() => setToggleCheckBox(true)}
                    closeModal={() => closeModal()}
                    setSignature={signature => {
                      setSignature(signature);
                    }}
                  />
                ),
              })
            }
            fillColor={colors._blue}
            unFillColor={isDarkMode ? colors._black : colors._white}
            iconImageStyle={{ tintColor: colors._black }}
          />
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._black,
              lineHeight: 20,
            }}>
            I agree to{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Agreement")}>
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[300],
                color: isDarkMode ? colors._white : colors._black,
                lineHeight: 20,
              }}>
              Terms of Service and Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
        <Gap height={16} />
        <ButtonColor
          disabled={!toggleCheckBox}
          backColor={colors._blue2}
          textColor={colors._white}
          teks="Continue"
          onPress={onNext}
        />
      </View>
      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const SignatureModal = ({
  setSignature,
  checkAgreement,
  closeModal,
}: {
  setSignature: (signature: string) => void;
  checkAgreement: () => void;
  closeModal: () => void;
}) => {
  const ref = useRef<SignatureViewRef | null>(null);
  return (
    <View
      style={{
        height: 400,
        width: "100%",
        position: "relative",
      }}>
      <SignatureView
        ref={ref}
        onOK={(signature: string) => {
          setSignature(signature);
          checkAgreement();
          closeModal();
        }}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  teks: (isDarkMode: boolean) => ({
    fontSize: 16,
    color: isDarkMode ? colors._white : colors._black,
    fontFamily: fonts.primary[400],
  }),
  teks2: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
    lineHeight: 20,
  }),
  teks3: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._black : colors._white,
  }),
  teks4: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
    lineHeight: 20,
  }),
  teks5: (isDarkMode: boolean) => ({
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teksPrice: (isDarkMode: boolean) => ({
    fontSize: 24,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  button: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black : colors._grey2,
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
  }) as StyleProp<ViewStyle>,
  centeredView: {
    // width: '100%',
    // height: '100%',
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors._black3,
  },
  modalView: {
    backgroundColor: colors._white,
    padding: 12,
    width: "90%",
    borderRadius: 8,
  },
  modalView2: {
    backgroundColor: colors._black,
    // padding: 12,
    width: "90%",
    borderRadius: 8,
    // flex: 1
  },
  buttonDrop: {
    padding: 8,
  },
  mainModal: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    // alignItems: 'center',
    flex: 1,
    padding: 24,
  },
  subModal: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 24,
    position: "relative",
    height: 400,
  },
};
