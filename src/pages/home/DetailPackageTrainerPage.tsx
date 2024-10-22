import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
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

const DetailPackageTrainer = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailPackageTrainer">) => {
  const { id, pt_id } = route.params;

  //   const [modalDp, setModalDp] = useState(false);
  //   const [labelDp, setLabelDp] = useState('Select full payment');
  //   const [down_pay, setdown_pay] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [signature, setSignature] = useState("");
  const [modalTtd, setModalTtd] = useState(false);
  //   const ref = useRef();
  const [packagePT, setPackagePT] = useState<IPTPackage>({
    total: 0,
    base_price: 0,
    dp_discount: 0,
    dp_price_disc: 0,
    discount: 0,
    price_disc: 0,
  } as IPTPackage);
  const { update, reset } = useTransactionStore();
  const [feature, setFeature] = useState("");

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (sign: string) => {
    setSignature(sign);
    setModalTtd(false);
    setToggleCheckBox(true);
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

  const gotoTerm = () => {
    navigation.navigate("Agreement");
  };

  const gotoVoucher = () => {
    reset();

    update({
      transaction: {
        package_id: id,
        package_pt_id: packagePT.package_personal_trainer_id,
        pt_id: pt_id,
        down_payment_membership: 0,
        down_payment_label: feature,
      },
      signature: signature,
      type: TransactionType.PT,
      normal_price: packagePT.total,
      final_price: packagePT.total,
      name: packagePT.package_name,
    });

    navigation.navigate("Voucher");
  };

  const getPackage = async () => {
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
          if (data.discount !== 0) {
            setFeature(`Disc ${data.discount}%`);
            return;
          }

          if (data.price_disc !== 0) {
            setFeature(convertToRupiah(data.price_disc.toString()));
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
    }
  };

  React.useEffect(() => {
    getPackage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LinearGradient
      colors={[colors._green2, colors._blue2]}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBarComp />
        <Header teks="Package PT" onPress={() => navigation.goBack()} />
        <View style={{ paddingHorizontal: 24, flex: 1, paddingBottom: 24 }}>
          <Text style={styles.teks}>
            Package Name : {packagePT.package_name}
          </Text>
          <Text style={styles.teks}>
            Total Price : {convertToRupiah(packagePT.total.toString())}
          </Text>
          <Text style={styles.teks}>
            Base Price : {convertToRupiah(packagePT.base_price.toString())}
          </Text>
          <Text style={styles.teks}>Session : {packagePT.session} Session</Text>
          {feature !== "" && (
            <>
              <Text style={styles.teks}>Feature :</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <View
                  style={{
                    backgroundColor: colors._blue,
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 4,
                    borderRadius: 4,
                  }}>
                  <Text style={styles.teks6}>{feature}</Text>
                </View>
              </View>
            </>
          )}
          <View style={{ flex: 1 }} />
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
            }}>
            <BouncyCheckbox
              isChecked={toggleCheckBox}
              onPress={() => setModalTtd(true)}
              fillColor={colors._white}
              unFillColor={colors._blue}
              iconImageStyle={{ tintColor: colors._blue }}
            />
            <Gap width={8} />
            <Text style={styles.teks4}>I agree to </Text>
            <TouchableOpacity onPress={gotoTerm}>
              <Text style={styles.teks4}>
                Terms of Service and Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
          <Gap height={16} />
          {/* <View style={{ flex: 1 }} /> */}
          <Gap height={16} />
          <ButtonColor
            disabled={!toggleCheckBox}
            backColor={colors._white}
            textColor={colors._blue2}
            teks="Next"
            onPress={gotoVoucher}
          />
        </View>
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
                    <Text style={styles.teks2}>{data.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal> */}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  teks: {
    fontSize: 14,
    fontFamily: fonts.primary[400],
    color: colors._white,
    marginTop: 12,
  },
  teks2: {
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: colors._white,
  },
  teks3: {
    color: colors._white,
    fontSize: 12,
    fontFamily: fonts.primary[600],
    textAlign: "center",
  } as StyleProp<ViewStyle>,
  teks4: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors._white,
    lineHeight: 20,
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
  teks6: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: colors._white,
    lineHeight: 20,
  },
};

export default DetailPackageTrainer;
