import { Theme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import Header from "../../components/ui/Header";
import { errorModal } from "../../components/Modal";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ClassStdDetail, ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { fonts, colors } from "../../lib/utils";
import { fetchDetailClass, postBooking } from "../../services/class";
import { showMessage } from "react-native-flash-message";
import { Button } from "../../components/ui/Button";

const DetailClass = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, "DetailClass">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const { id } = route.params;
  //   const [data, setData] = useState([]);
  //   const [modalVisible, setmodalVisible] = useState(false);
  //   const [selected, setSelected] = useState('');
  //   const [labelDp, setLabelDp] = useState('Select full payment');
  //   const [seat, setSeat] = useState([]);
  //   const [modalDp, setModalDp] = useState(false);
  //   const [down_pay, setdown_pay] = useState('');

  //   const [dp] = useState([
  //     {
  //       id: 0,
  //       label: 'Full Payment',
  //     },
  //     {
  //       id: 1,
  //       label: 'Down Payment',
  //     },
  //   ]);
  //   const selectDp = params => {
  //     setdown_pay(params.id);
  //     setLabelDp(params.label);
  //     setModalDp(!modalDp);
  //   };
  //   const goPay = () => {
  //     getData('userProfile').then(res => {
  //       if (selected == '') {
  //         showMessage({
  //           icon: 'warning',
  //           message: 'Select your seat',
  //           type: 'default',
  //           backgroundColor: colors._red,
  //           color: colors._white,
  //         });
  //       } else {
  //         const params = {
  //           name: res.name,
  //           email: res.email,
  //           phone: res.phone,
  //           token: res.token,
  //           id: id,
  //           //kondisi
  //           item_price: class_price,
  //           item_name: class_name,
  //           item_count: 1,
  //           type: 'SC',
  //           seat_number: selected,
  //           down_pay: down_pay,
  //           index: index,
  //           isDarkMode: boolean,
  //         };
  //         navigation.navigate('Voucher', params);
  //       }
  //     });
  //   };

  const [classStdDetail, setClassStdDetail] = useState<ClassStdDetail>(
    {} as ClassStdDetail,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const getClassDetail = async () => {
    try {
      setIsLoading(true);

      const { data } = await fetchDetailClass(id);
      if (data) {
        setClassStdDetail(data);
      }

      setIsLoading(false);
    } catch (err: any) {
      showMessage({
        message: err.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
      setIsLoading(false);
    }
  };

  const goPayStd = async () => {
    try {
      setIsProcessing(true);

      await postBooking(id);

      setIsProcessing(false);

      navigation.navigate("BookingSuccess");
    } catch (err: any) {
      errorModal(err.message || "An error occured", isDarkMode);
      setIsProcessing(false);
    }

    // getData('userProfile').then(res => {
    //   const params = {
    //     name: res.name,
    //     email: res.email,
    //     phone: res.phone,
    //     token: res.token,
    //     id: id,
    //     item_price: class_price,
    //     item_name: class_name,
    //     item_count: 1,
    //     //kondisi
    //     class_name: class_name,
    //     class_type: 'std',
    //     seat_number: selected,
    //     isDarkMode: boolean,
    //   };
    //   navigation.navigate('WillTransaction', params);
    // });
  };

  //   const openYoutube = () => {
  //     if (video_link != null) {
  //       Linking.openURL(video_link);
  //     } else {
  //       showMessage({
  //         icon: 'warning',
  //         message: 'Video not available',
  //         type: 'default',
  //         backgroundColor: colors._red,
  //         color: colors._white,
  //       });
  //     }
  //   };

  //   const openDocs = () => {
  //     if (document_link != null) {
  //       Linking.openURL(document_link);
  //     } else {
  //       showMessage({
  //         icon: 'warning',
  //         message: 'Document not available',
  //         type: 'default',
  //         backgroundColor: colors._red,
  //         color: colors._white,
  //       });
  //     }
  //   };

  //   const getRangking = async () => {
  //     try {
  //       if (type_class == 'std') {
  //         const response = await Api.getRangkingClass(id);
  //         setData(response.data);
  //       } else {
  //         const response = await Api.getRangkingSClass(id);
  //         setData(response.data);
  //       }
  //     } catch (error) {}
  //   };

  //   const getSeat = async () => {
  //     try {
  //       if (type_class == 'std') {
  //         const response = await Api.getSeatSTDClass(id);
  //         setSeat(response.data);
  //       } else {
  //         const response = await Api.getSeatSpecialClass(id);
  //         setSeat(response.data);
  //       }
  //     } catch (error) {}
  //   };

  useEffect(() => {
    //   getSeat();
    //   getRangking();
    getClassDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Detail Class" onPress={() => navigation.goBack()} />

      <View style={styles.cardContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{
                uri: classStdDetail.image,
              }}
              style={{ width: 150, height: 150, borderRadius: 10 }}
            />
          </View>
          <Gap height={32} />
          <Text
            style={{
              fontSize: 24,
              fontFamily: fonts.primary[600],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            {classStdDetail.class_name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.primary[400],
              color: colors._grey4,
            }}>
            {classStdDetail.instructure_name}
          </Text>
          <Gap height={24} />
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            {classStdDetail.desc ? classStdDetail.desc : "No Description"}
          </Text>
          <Gap height={16} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}>
            <View
              style={{
                flexDirection: "column",
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                Class Quota
              </Text>
              <Gap height={8} />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                {classStdDetail.count_member || 0}/{classStdDetail.quota || 0}{" "}
                member
              </Text>
            </View>
            <View
              style={{
                flexDirection: "column",
                flex: 1,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                Schedule
              </Text>
              <Gap height={8} />
              <Text
                style={{
                  flexWrap: "wrap",
                  alignItems: "flex-start",
                  fontSize: 16,
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                }}>{`${classStdDetail.schedule} ${classStdDetail.date_class_local}, ${classStdDetail.start_time_class} - ${classStdDetail.finish_time_class}`}</Text>
            </View>
          </View>
        </ScrollView>
        <Gap height={10} />
        <Button teks="Book Now" onPress={goPayStd} disabled={isProcessing} />
        <Gap height={16} />
        {/* <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={{uri: `https://positive-gym.com/${instructure_image}`}}
                style={{width: 42, height: 42, borderRadius: 10}}
              />
              <View style={{marginLeft: 10}}>
                <Text style={styles.teks3(isDarkMode)}>{instructure_name}</Text>
                <Text style={styles.teks2}>Instructure</Text>
              </View>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.teks3(isDarkMode)}>{quota}</Text>
              <Text style={styles.teks2}>Quota</Text>
            </View>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.teks3(isDarkMode)}>
                {periode == null ? '1' : periode}
              </Text>
              <Text style={styles.teks2}>Period</Text>
            </View>
          </View>
          <Gap height={20} /> */}
        {/* <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity style={styles.btnTouch} onPress={openYoutube}>
              <IconPlay />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnTouch2} onPress={openDocs}>
              <IconDocument />
            </TouchableOpacity>
          </View>
          <Gap height={20} /> */}
        {/* {available_seat && (
            <TouchableOpacity onPress={() => setmodalVisible(!modalVisible)}>
              <Gap height={20} />
              <Text style={styles.teks(isDarkMode)}>Map Seat</Text>
            </TouchableOpacity>
          )} */}
        {/* {available_seat && (
            <>
              <Gap height={20} />
              <Text style={styles.teks(isDarkMode)}>Select Seat</Text>
              <Gap height={8} />
              <View
                style={{
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: isDarkMode ? colors._black : colors._grey2,
                }}>
                <Picker
                  selectedValue={selected}
                  style={{
                    color: isDarkMode ? colors._white : colors._black,
                    fontSize: 14,
                    fontFamily: fonts.primary[400],
                  }}
                  itemStyle={{
                    color: isDarkMode ? colors._white : colors._black,
                    fontSize: 14,
                    fontFamily: fonts.primary[400],
                  }}
                  dropdownIconColor={isDarkMode ? colors._white : colors._blacks}
                  onValueChange={itemValue => setSelected(itemValue)}>
                  <Picker.Item
                    label="Select Seat"
                    value=""
                    style={{fontSize: 14, fontFamily: fonts.primary[400]}}
                  />
                  {seat.map(data => {
                    return (
                      <Picker.Item
                        label={data.label}
                        value={data.label}
                        style={{fontSize: 14, fontFamily: fonts.primary[400]}}
                      />
                    );
                  })}
                </Picker>
              </View>
            </>
          )} */}
        {/* {class_price === 0 ? (
            <View />
          ) : (
            <>
              <Gap height={20} />
              <Text style={styles.teks(isDarkMode)}>Price</Text>
              <Gap height={8} />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.teks6(isDarkMode)}>Rp. 500.000</Text>
                <Gap width={8} />
                <Text style={styles.teks4}>
                  {helpers.convertToRupiah(class_price)}
                </Text>
              </View>
            </>
          )} */}
        {/* {package_installments !== undefined && (
            <View>
              <Gap height={12} />
              <TouchableOpacity
                style={styles.button(isDarkMode)}
                onPress={() => setModalDp(!modalDp)}>
                <Text style={styles.teks8}>{labelDp}</Text>
              </TouchableOpacity>
              <View style={{position: 'absolute', right: 12, top: 24}}>
                <IconDown />
              </View>
            </View>
          )} */}
        {/* {type === 'detail_from_report' ? (
            <View>
              <Gap height={20} />
              <Text style={styles.teks(isDarkMode)}>Member Ranking</Text>
              <Gap height={12} />
              {data.map((data, index) => {
                return (
                  <CardRangking
                    theme={theme}
                    key={data.id}
                    index={index}
                    name={data.name}
                    image={data.image}
                    point={data.point}
                  />
                );
              })}
            </View>
          ) : (
            <View />
          )} */}

        {/* {type === undefined ? (
          <View>
            {class_price === 0 ? (
              <Button teks="Join Class" onPress={goPayStd} />
            ) : (
                <Button teks="Join Class" onPress={goPay} />
              <></>
            )}
            <Gap height={24} />
          </View>
        ) : (
          <View />
        )} */}
        {/* <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setmodalVisible(!modalVisible);
        }}>
        <View style={styles.mainModal}>
          <View style={styles.cardModal}>
            <Image
              source={{uri: `https://positive-gym.com/${map_seat}`}}
              style={{
                width: width / 1.5,
                height: width / 2,
                resizeMode: 'stretch',
                borderRadius: 20,
              }}
            />
            <Gap height={8} />
            <TouchableOpacity onPress={() => setmodalVisible(!modalVisible)}>
              <Text
                style={{
                  color: colors._white,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal> */
        /* <Modal
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
                    <Text style={styles.teks8}>{data.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal> */}
      </View>
      {(isLoading || isProcessing) && <Loading />}
    </SafeAreaView>
  );
};
const styles = {
  container: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
    flex: 1,
  }),
  teks: (isDarkMode: boolean) => ({
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks2: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors._grey4,
  },
  teks3: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks4: {
    fontSize: 16,
    fontFamily: fonts.primary[400],
    color: colors._blue2,
  },
  teks5: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks6: (isDarkMode: boolean) => ({
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: isDarkMode ? colors._white : colors._black,
    textDecorationLine: "line-through",
  }),
  teks7: {
    fontSize: 12,
    fontFamily: fonts.primary[300],
    color: colors._grey4,
    textAlign: "center",
  },
  teks8: {
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: colors._black,
  },
  cardContent: {
    paddingHorizontal: 24,
    flex: 1,
  },
  btnTouch: {
    backgroundColor: colors._backOrange,
    width: "47%",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
  },
  btnTouch2: {
    backgroundColor: colors._backGreen,
    width: "47%",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
  },
  mainModal: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: colors._black3,
  },
  cardModal: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 20,
  },
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
  }),
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
  buttonDrop: {
    padding: 8,
  },
};

export default DetailClass;
