import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
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
  MembershipReq,
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
import { IMembershipPackage, ISales } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { fetchMembershipPackageDetail } from "../../services/membership";
import { fetchSales } from "../../services/sales";
import { ThemeContext } from "../../contexts/ThemeContext";
import SignatureView from "react-native-signature-canvas";
import { useModalStore } from "../../stores/useModalStore";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { fetchProfile } from "../../services/profile";
import { usePaymentStore } from "../../stores/usePaymentStore";
import { CalendarCheckIcon, ChevronDownIcon } from "lucide-react-native";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export const MembershipDetail = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "MembershipDetail">) => {
  const { id } = route.params;
  const { isDarkMode } = useContext(ThemeContext);
  const [showDatePickerIOS, setShowDatePickerIOS] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [membershipPackage, setMembershipPackage] =
    React.useState<IMembershipPackage | null>(null);
  const [sales, setSales] = useState<ISales[]>([]);

  const { openModal, closeModal } = useModalStore();
  const { update, payment } = usePaymentStore();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const [search, setSearch] = React.useState("");
  const [filteredSales, setFilteredSales] = React.useState<ISales[]>([]);

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
    if (!payment.salesName || !payment.salesId || !payment.salesEmail) {
      showMessage({
        message: "Member Consultant required",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return;
    }

    if (!payment.signature) {
      showMessage({
        message: "Signature required",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      return;
    }

    update({
      membershipId: membershipPackage?.id,
      packagePrice: membershipPackage?.price,
      packageName: membershipPackage?.name,
      isDpAvailable:
        membershipPackage?.down_payment_membership === 1 ||
        membershipPackage?.down_payment_membership === true,
    });

    navigation.navigate("Payment");
  };

  const getSales = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchSales();
      if (data) {
        setSales(data);
        setFilteredSales(data);
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

  const getProfile = async () => {
    try {
      const { data } = await fetchProfile();
      if (data.membership.expired_at) {
        const expiredAt = new Date(data.membership.expired_at);
        // add one day
        expiredAt.setDate(expiredAt.getDate() + 1);

        // if expired date is less than today
        if (expiredAt.getDate() < new Date().getDate()) {
          return;
        }

        update({
          expiredDate: expiredAt,
          startDate: expiredAt,
        });
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([getPackage(), getSales(), getProfile()]);
  }, []);

  useEffect(() => {
    setFilteredSales(
      sales.filter(data => {
        return data.name.toLowerCase().startsWith(search.toLowerCase());
      }),
    );
  }, [search]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <Header
        teks={membershipPackage?.name || "Detail Membership"}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.content}>
        <Image
          source={{
            uri: membershipPackage?.image,
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
            {membershipPackage?.desc}
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
            }}>{`${membershipPackage?.periode}`}</Text>
          <Gap height={16} />
          {(membershipPackage?.down_payment_membership === 1 ||
            membershipPackage?.down_payment_membership ||
            membershipPackage?.discount !== 0) && (
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
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  rowGap: 4,
                }}>
                {membershipPackage?.dp_discount !== 0 && (
                  <Fragment>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
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
                          {membershipPackage?.dp_discount} Dp Available
                        </Text>
                      </View>
                      <Gap width={4} />
                    </View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}>
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
                          {membershipPackage?.installment} Installment
                        </Text>
                      </View>
                      <Gap width={4} />
                    </View>
                  </Fragment>
                )}
                {membershipPackage?.discount !== 0 && (
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
                        {membershipPackage?.discount} Discount
                      </Text>
                    </View>
                    <Gap width={4} />
                  </View>
                )}
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
                membershipPackage?.total_price.toString() || "0",
              )}
            </Text>
          </View>
          <Gap height={16} />
          {sales.length > 0 && (
            <>
              <Text
                style={{
                  fontSize: 12,
                  color: isDarkMode ? colors._grey4 : colors._grey3,
                  fontFamily: fonts.primary[400],
                }}>
                Member Consultant
              </Text>
              <Gap height={4} />
              <TouchableOpacity
                style={{
                  padding: 12,
                  backgroundColor: isDarkMode ? colors._black : colors._grey2,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderColor: isDarkMode ? colors._grey4 : colors._grey3,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                // onPress={() => {
                //   openModal({
                //     children: (
                //       <ScrollView>
                //         {sales.map((data: ISales) => {
                //           return (
                //             <TouchableOpacity
                //               key={data.id}
                //               style={styles.buttonDrop}
                //               onPress={() => {
                //                 update({
                //                   salesId: data.id,
                //                   salesName: data.name,
                //                   salesEmail: data.email,
                //                 });
                //                 closeModal();
                //               }}>
                //               <Text style={styles.teks5(isDarkMode)}>
                //                 {data.name}
                //               </Text>
                //             </TouchableOpacity>
                //           );
                //         })}
                //       </ScrollView>
                //     ),
                //   });
                // }}
                onPress={handlePresentModalPress}>
                <Text
                  style={{
                    color: isDarkMode ? colors._white : colors._black,
                    fontSize: 14,
                    fontFamily: fonts.primary[400],
                  }}>
                  {payment.salesName || "Select Member Consultant"}
                </Text>
                <ChevronDownIcon
                  size={20}
                  color={isDarkMode ? colors._white : colors._black}
                />
              </TouchableOpacity>
              <Gap height={16} />
            </>
          )}

          <Text
            style={{
              fontSize: 12,
              color: isDarkMode ? colors._grey4 : colors._grey3,
              fontFamily: fonts.primary[400],
            }}>
            Start Date
          </Text>
          <Gap height={4} />
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: isDarkMode ? colors._black : colors._grey2,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: isDarkMode ? colors._grey4 : colors._grey3,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
            onPress={() => {
              if (Platform.OS === "android") {
                DateTimePickerAndroid.open({
                  value: payment.startDate || new Date(),
                  mode: "date",
                  onChange: (_, selectedDate) => {
                    if (selectedDate) {
                      if (
                        payment.expiredDate &&
                        selectedDate.getDate() < payment.expiredDate?.getDate()
                      ) {
                        showMessage({
                          message:
                            "Start date must be greater than expired date",
                          type: "warning",
                          icon: "warning",
                          backgroundColor: colors._red,
                          color: colors._white,
                        });
                        return;
                      }

                      if (selectedDate.getDate() < new Date().getDate()) {
                        showMessage({
                          message: "Start date must be greater than today",
                          type: "warning",
                          icon: "warning",
                          backgroundColor: colors._red,
                          color: colors._white,
                        });
                        return;
                      }

                      update({
                        startDate: selectedDate,
                      });
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
              {payment.startDate?.toLocaleDateString("id-ID")}
            </Text>
            <CalendarCheckIcon
              size={20}
              color={isDarkMode ? colors._white : colors._black}
            />
          </TouchableOpacity>
          {showDatePickerIOS && (
            <DateTimePicker
              value={payment.startDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowDatePickerIOS(false);
                if (selectedDate) {
                  if (
                    payment.expiredDate &&
                    selectedDate.getDate() < payment.expiredDate?.getDate()
                  ) {
                    showMessage({
                      message: "Start date must be greater than expired date",
                      type: "warning",
                      icon: "warning",
                      backgroundColor: colors._red,
                      color: colors._white,
                    });
                    return;
                  }

                  if (selectedDate.getDate() < new Date().getDate()) {
                    showMessage({
                      message: "Start date must be greater than today",
                      type: "warning",
                      icon: "warning",
                      backgroundColor: colors._red,
                      color: colors._white,
                    });
                    return;
                  }

                  update({
                    startDate: selectedDate,
                  });
                }
              }}
            />
          )}
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
          backColor={colors._blue2}
          textColor={colors._white}
          teks="Continue"
          onPress={onNext}
        />
      </View>
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          backgroundStyle={{
            backgroundColor: isDarkMode ? colors._black : colors._white,
          }}
          style={{
            paddingHorizontal: 24,
            borderColor: isDarkMode ? colors._black : colors._grey3,
            borderWidth: 0.5,
          }}>
          <BottomSheetView
            style={{
              height: Dimensions.get("window").height / 3,
            }}>
            <TextInput
              onChangeText={setSearch}
              value={search}
              placeholder={"Search sales"}
              placeholderTextColor={colors._grey4}
              style={{
                padding: 12,
                fontSize: 13,
                fontFamily: fonts.primary[300],
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                borderRadius: 10,
                color: isDarkMode ? colors._white : colors._black,
                borderWidth: 0.5,
                borderColor: isDarkMode ? colors._grey4 : colors._grey3,
              }}
            />
            <Gap height={16} />
            <ScrollView>
              {filteredSales.map(data => {
                return (
                  <>
                    <TouchableOpacity
                      key={data.id}
                      style={styles.buttonDrop}
                      onPress={() => {
                        update({
                          salesId: data.id,
                          salesName: data.name,
                          salesEmail: data.email,
                        });
                        bottomSheetModalRef.current?.dismiss();
                      }}>
                      <Text style={styles.teks5(isDarkMode)}>{data.name}</Text>
                    </TouchableOpacity>
                    <Gap height={8} />
                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: colors._grey3,
                      }}
                    />
                  </>
                );
              })}
            </ScrollView>
          </BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

export const SignatureModal = ({
  setSignature,
  closeModal,
}: {
  setSignature: (signature: string) => void;
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
  button: (isDarkMode: boolean) =>
    ({
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
    } as StyleProp<ViewStyle>),
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
