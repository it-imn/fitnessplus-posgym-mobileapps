import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import SignatureScreen from "react-native-signature-canvas";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import {
  TransactionType,
  useTransactionStore,
} from "../../stores/useTransactionStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { showMessage } from "react-native-flash-message";
import Header from "../../components/ui/Header";
import { IconDown } from "../../assets/index.js";
import { ButtonColor } from "../../components/ui/Button";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import { IMembershipPackageDetail, ISales } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, convertToRupiah, fonts } from "../../lib/utils";
import { fetchMembershipPackageDetail } from "../../services/membership";
import { fetchSales } from "../../services/sales";

export const MembershipDetail = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "MembershipDetail">) => {
  const { id } = route.params;
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [modalSales, setModalSales] = useState(false);
  // const [modalDp, setModalDp] = useState(false);
  const [modalTtd, setModalTtd] = useState(false);
  const [signature, setSignature] = useState<string>("");
  const [sales_id, setSales_id] = useState(0);
  // const [down_pay, setdown_pay] = useState('');
  const [labels, setLabels] = useState("Select member consultant name");
  // const [labelDp, setLabelDp] = useState('Select full payment');
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
          down_payment_label: `${convertToRupiah(
            membershipPackage.installment_first_pay.total_price.toString(),
          )} Dp Available`,
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

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (sign: string) => {
    setSignature(sign);
    setModalTtd(false);
    setToggleCheckBox(true);
    // setSignature(signature.split('data:image/png;base64,'));
    // onOK(signature)
    // Callback from Component props
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {};

  // Called after ref.current.clearSignature()
  const handleClear = () => {};

  // Called after end of stroke
  const handleEnd = () => {
    // ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = () => {};

  // const [dp] = useState([
  //   {
  //     id: 0,
  //     label: 'Full Payment',
  //   },
  //   {
  //     id: 1,
  //     label: 'Down Payment',
  //   },
  // ]);

  const selectSales = (params: any) => {
    setSales_id(params.id);
    setLabels(params.label);
    setModalSales(!modalSales);
  };

  // const selectDp = (params: any) => {
  //   setLabelDp(params.label);
  //   setModalDp(!modalDp);
  // };

  useEffect(() => {
    getSales();
    getPackage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={[colors._green2, colors._blue2]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          teks={membershipPackage.name}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.content}>
          <Image
            source={{
              uri: membershipPackage.image,
            }}
            style={styles.image}
          />
          <Gap height={16} />
          <Text style={styles.teks}>Description :</Text>
          <Gap height={4} />
          <Text style={styles.teks2}>{membershipPackage.desc}</Text>
          <Gap height={16} />
          <Text style={styles.teks}>Periode :</Text>
          <Gap height={4} />
          <Text
            style={styles.teks2}>{`${membershipPackage.periode} days`}</Text>
          <Gap height={16} />
          {membershipPackage.down_payment_membership === 1 && (
            <>
              <Text style={styles.teks}>Feature :</Text>
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
                  <Text style={styles.teks4}>
                    {convertToRupiah(
                      membershipPackage.installment_first_pay.total_price.toString(),
                    )}{" "}
                    Dp Available
                  </Text>
                </View>
                <Gap width={4} />
              </View>
            </>
          )}
          <Gap height={16} />
          <Text style={styles.teks}>Price :</Text>
          <Gap height={4} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.teksPrice}>
              {convertToRupiah(
                membershipPackage.total_price !== undefined
                  ? membershipPackage.total_price.toString()
                  : "0",
              )}
            </Text>
            {/* <Gap width={4} />
                        <View style={{ backgroundColor: colors._white, width: '24%', alignItems: 'center', justifyContent: 'center', padding: 4, borderRadius: 4 }}>
                            <Text style={styles.teks3}>Disc 50%</Text>
                        </View> */}
          </View>
          <Gap height={16} />
          <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalSales(!modalSales)}>
              <Text style={styles.teks5}>{labels}</Text>
            </TouchableOpacity>
            <View style={{ position: "absolute", right: 12, top: 12 }}>
              <IconDown />
            </View>
          </View>
          <Gap height={16} />
          {/* {membershipPackage.down_payment_membership === 1 && (
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModalDp(!modalDp)}>
                <Text style={styles.teks5}>{labelDp}</Text>
              </TouchableOpacity>
              <View style={{position: 'absolute', right: 12, top: 12}}>
                <IconDown />
              </View>
            </View>
          )} */}
          <View style={{ flex: 0.8 }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignContent: "center",
            }}>
            <BouncyCheckbox
              isChecked={toggleCheckBox}
              onPress={() => setModalTtd(true)}
              fillColor={colors._white}
              unFillColor={colors._blue}
              iconImageStyle={{ tintColor: colors._blue }}
            />
            <Gap width={8} />
            <Text style={styles.teks2}>I agree to </Text>
            <TouchableOpacity onPress={gotoTerm}>
              <Text style={styles.teks2}>
                Terms of Service and Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          {/* {
                        !toggleCheckBox &&
                        <View style={{ flex: 1 }}>
                            <SignatureScreen
                                ref={ref}
                                overlayWidth={300}
                                overlayHeight={100}
                                onEnd={handleEnd}
                                onOK={handleOK}
                                onEmpty={handleEmpty}
                                onClear={handleClear}
                                onGetData={handleData}
                                autoClear={false}
                                descriptionText={text}
                            />
                        </View>
                    } */}
          <Gap height={16} />
          <ButtonColor
            disabled={!toggleCheckBox}
            backColor={colors._white}
            textColor={colors._blue2}
            teks="Continue"
            onPress={onNext}
          />
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalSales}
          onRequestClose={() => {
            setModalSales(!modalSales);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView>
                {sales.map((data: ISales) => {
                  const params = {
                    id: data.id,
                    label: data.name,
                  };
                  return (
                    <TouchableOpacity
                      key={data.id}
                      style={styles.buttonDrop}
                      onPress={() => selectSales(params)}>
                      <Text style={styles.teks5}>{data.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
        {/* <Modal
          animationType="fade"
          transparent={true}
          visible={modalDp}
          onRequestClose={() => {
            setModalDp(!modalDp);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView>
                {dp.map(data => {
                  const params = {
                    id: data.id,
                    label: data.label,
                  };
                  return (
                    <TouchableOpacity
                      key={data.id}
                      style={styles.buttonDrop}
                      onPress={() => selectDp(params)}>
                      <Text style={styles.teks5}>{data.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal> */}

        {modalTtd && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalTtd}
            onRequestClose={() => {
              setModalTtd(false);
            }}>
            <View style={styles.mainModal}>
              <View style={styles.subModal}>
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}>
                  <SignatureScreen
                    // ref={ref}
                    onEnd={handleEnd}
                    onOK={handleOK}
                    onEmpty={handleEmpty}
                    onClear={handleClear}
                    onGetData={handleData}
                    autoClear={false}
                  />
                </View>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>

      {isLoading && <Loading />}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  teks: {
    fontSize: 16,
    color: colors._white,
    fontFamily: fonts.primary[400],
  },
  teks2: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors._white,
    lineHeight: 20,
  },
  teks3: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: colors._black,
  },
  teks4: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: colors._white,
    lineHeight: 20,
  },
  teks5: {
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: colors._black,
  },
  teksPrice: {
    fontSize: 24,
    fontFamily: fonts.primary[400],
    color: colors._white,
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
    borderRadius: 4,
  },
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
});
