//
// import React, {useContext, useEffect, useState} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StyleProp,
//   Text,
//   View,
//   ViewStyle,
// } from 'react-native';
// import helpers from '../../utils/helpers';
// import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {RootStackParamList} from '../../utils/types/routes';
// import ThemeContext from '../../context/ThemeContext';
// import StatusBarComp from '../../components/moleculars/StatusBarComp';
// import Loading from '../../components/atoms/Loading';
// import {
//   IMembershipPackageDetail,
//   IPTPackage,
//   IVoucher,
//   Theme,
//   ThemeType,
//   UserDetail,
// } from '../../utils/types/definition';
// import {colors} from '../../utils/colors';
// import {fonts} from '../../utils/fonts';
// import ButtonColor from '../../components/moleculars/ButtonColor';
// import Gap from '../../components/atoms/Gap';
// import {
//   checkVoucher,
//   fetchMembershipPackageDetail,
// } from '../../services/membership';
// import {Toaster} from '../../components/atoms/Toaster';
// import {fetchProfile} from '../../services/profile';
// import Header from '../../components/moleculars/Header';
// import {fetchPersonalTrainerDetailPackage} from '../../services/personal_trainer';

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../lib/routes";

const WillTransaction = ({}: NativeStackScreenProps<
  RootStackParamList,
  "WillTransaction"
>) => {
  //   const {theme} = useContext(ThemeContext);
  //   const {
  //     membership_id,
  //     package_pt_id,
  //     pt_id,
  //     signature,
  //     sales_id,
  //     voucher_code,
  //     down_payment,
  //     type,
  //   } = route.params;
  //   const [isLoading, setIsLoading] = useState(false);
  //   const [membershipPackage, setMembershipPackage] =
  //     React.useState<IMembershipPackageDetail>({
  //       price: 0,
  //       dp_discount: 0,
  //       dp_price_disc: 0,
  //     } as IMembershipPackageDetail);
  //   const [packagePT, setPackagePT] = useState<IPTPackage>({
  //     total: 0,
  //   } as IPTPackage);
  //   const [voucher, setVoucher] = useState<IVoucher>({
  //     total_package_discount: 0,
  //     value_price: 0,
  //   } as IVoucher);
  //   const onNext = async () => {
  //     // getData('userData').then(res => {
  //     //   if (type == 'SC') {
  //     //     const dataCheck = {
  //     //       sclass_id: id,
  //     //     };
  //     //     const checkClass = async () => {
  //     //       const responseCheckClass = await Api.checkBookedSclass(
  //     //         dataCheck,
  //     //         token,
  //     //       );
  //     //       if (responseCheckClass.data.status == 'allowed') {
  //     //         const params = {
  //     //           id: id,
  //     //           iduser: res.iduser,
  //     //           item_name: item_name,
  //     //           item_price: item_price,
  //     //           item_count: item_count,
  //     //           name: name,
  //     //           email: email,
  //     //           phone: phone,
  //     //           type: type,
  //     //           token: token,
  //     //           down_pay: down_pay,
  //     //           seat_number: seat_number,
  //     //           isDarkMode: boolean,
  //     //         };
  //     //         navigation.navigate('PaymentMethod', params);
  //     //       } else {
  //     //         showMessage({
  //     //           icon: 'danger',
  //     //           message: 'You still have session in this class',
  //     //           type: 'default',
  //     //           backgroundColor: colors._red,
  //     //           color: colors._white,
  //     //         });
  //     //       }
  //     //     };
  //     //     checkClass();
  //     //   } else {
  //     //     const params = {
  //     //       id: id,
  //     //       iduser: res.iduser,
  //     //       item_name: item_name,
  //     //       item_price: item_price,
  //     //       item_count: item_count,
  //     //       name: name,
  //     //       email: email,
  //     //       phone: phone,
  //     //       type: type,
  //     //       signature: signature,
  //     //       sales_id: sales_id,
  //     //       down_pay: down_pay,
  //     //       index: index,
  //     //       token: token,
  //     //       isDarkMode: boolean,
  //     //       voucher_id: voucher_id,
  //     //       package_price: package_price,
  //     //       discount: discount,
  //     //       exp_date: exp_date,
  //     //       installments: installments,
  //     //       due_date: due_date,
  //     //       item_price_fix: item_price_fix,
  //     //     };
  //     //     navigation.navigate('PaymentMethod', params);
  //     //   }
  //     // });
  //     if (type === 'MBR') {
  //       navigation.navigate('PaymentMethod', {
  //         membership_id: membership_id,
  //         signature: signature,
  //         sales_id: sales_id,
  //         voucher_code: voucher_code,
  //         type: type,
  //       });
  //     } else if (type === 'PPT') {
  //       navigation.navigate('PaymentMethod', {
  //         package_pt_id: package_pt_id,
  //         pt_id: pt_id,
  //         signature: signature,
  //         voucher_code: voucher_code,
  //         type: type,
  //       });
  //     }
  //   };
  //   // const paymentClassStd = async () => {
  //   // setLoading(true);
  //   // const dataClass = {
  //   //   class_id: id,
  //   //   seat_number: seat_number,
  //   // };
  //   // const response = await Api.buyClassStd(dataClass, token);
  //   // setLoading(false);
  //   // const params = {
  //   //   isDarkMode: boolean,
  //   // };
  //   // navigation.navigate('WaitingPage', params);
  //   // };
  //   //   const detailDp = () => {
  //   //     if (down_payment === 1) {
  //   //         try {
  //   //           if (type === 'MBR') {
  //   //             const {data} = await fetchMembershipPackageDetail(membership_id);
  //   //             if (data.) {
  //   //               setDataDP(data.package_installments.plan);
  //   //             }
  //   //             // setDataDP(response.data.data[index].package_installments.plan);
  //   //           }
  //   //         //   if (type === 'PPT') {
  //   //         //     const responPt = await Api.getPackageTrainer(res.branch_id);
  //   //         //     setDataDP(responPt.data[0].package_installments.plan);
  //   //         //   } else {
  //   //         //     const responses = await Api.getClassSpl(res.branch_id);
  //   //         //     setDataDP(responses.data[index].package_installments.plan);
  //   //         //   }
  //   //         } catch (error) {}
  //   //       };
  //   //     }
  //   //   };
  //   const getMembershipPackageDetail = async () => {
  //     setIsLoading(true);
  //     try {
  //       const {data} = await fetchMembershipPackageDetail(membership_id!);
  //       if (data) {
  //         setMembershipPackage(data);
  //       }
  //     } catch (err: any) {
  //       Toaster(err.message || 'An error occured', 'warning');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   const getPTPackageDetail = async () => {
  //     setIsLoading(true);
  //     try {
  //       const {data} = await fetchPersonalTrainerDetailPackage(package_pt_id!);
  //       if (data) {
  //         setPackagePT(data);
  //       }
  //     } catch (err: any) {
  //       Toaster(err.message || 'An error occured', 'warning');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   const getVoucher = async () => {
  //     setIsLoading(true);
  //     try {
  //       const {data} = await checkVoucher(voucher_code, membership_id!);
  //       if (data) {
  //         setVoucher(data);
  //       }
  //     } catch (err: any) {
  //       Toaster(err.message || 'An error occured', 'warning');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   useEffect(() => {
  //     if (type === 'MBR') {
  //       Promise.all([getMembershipPackageDetail(), getVoucher()]);
  //     } else if (type === 'PPT') {
  //       Promise.all([getPTPackageDetail()]);
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);
  //   return (
  //     <SafeAreaView style={styles.container(isDarkMode)}>
  //       <StatusBarComp />
  //       <Header teks="Transaction" onPress={() => navigation.goBack()} />
  //       <ScrollView showsVerticalScrollIndicator={false}>
  //         <View style={styles.cardDetail}>
  //           <ProfileSection />
  //           <Gap height={20} />
  //           <Text style={styles.teks(isDarkMode)}>Item</Text>
  //           <Text style={styles.teks2(isDarkMode)}>
  //             {type === 'MBR'
  //               ? membershipPackage.name
  //               : type === 'PPT'
  //               ? packagePT.package_name
  //               : '??'}
  //           </Text>
  //           {voucher.total_package_discount !== 0 && (
  //             <>
  //               <Gap height={20} />
  //               <Text style={styles.teks(isDarkMode)}>Voucher</Text>
  //               <Text style={styles.teks2(isDarkMode)}>{voucher.name}</Text>
  //               <Gap height={20} />
  //               <Text style={styles.teks(isDarkMode)}>Discount</Text>
  //               <Text style={styles.teks2(isDarkMode)}>
  //                 {voucher.value_percent
  //                   ? `${voucher.value_percent}%`
  //                   : voucher.value_price
  //                   ? helpers.convertToRupiah(voucher.value_price.toString())
  //                   : 0}
  //               </Text>
  //             </>
  //           )}
  //           <Gap height={20} />
  //           <View style={styles.cardDetail2}>
  //             <View>
  //               <Text style={styles.teks(isDarkMode)}>Price</Text>
  //               <Text style={styles.teks2(isDarkMode)}>
  //                 {type === 'MBR'
  //                   ? helpers.convertToRupiah(membershipPackage.price.toString())
  //                   : type === 'PPT'
  //                   ? helpers.convertToRupiah(packagePT.total.toString())
  //                   : '??'}
  //               </Text>
  //             </View>
  //             <View style={{alignItems: 'flex-end'}}>
  //               <Text style={styles.teks(isDarkMode)}>Quantity</Text>
  //               <Text style={styles.teks2(isDarkMode)}>1</Text>
  //               {/* // Hardcoded value */}
  //             </View>
  //           </View>
  //           <Gap height={20} />
  //           {/* {down_payment === 1 && (
  //               <>
  //                 <Text style={styles.teks(isDarkMode)}>Detail Down Payment</Text>
  //               </>
  //             )}
  //             {installments && installments[1] !== null && (
  //               <>
  //                 <View
  //                   style={{
  //                     flexDirection: 'row',
  //                     alignItems: 'center',
  //                     justifyContent: 'space-between',
  //                   }}>
  //                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                     <Text style={styles.teks2(isDarkMode)}>1.</Text>
  //                     <Gap width={4} />
  //                     <Text style={styles.teks2(isDarkMode)}>{due_date[1]}</Text>
  //                   </View>
  //                   <Text style={styles.teks2(isDarkMode)}>{installments[1]}</Text>
  //                 </View>
  //               </>
  //             )}
  //             {installments && installments[2] != null && (
  //               <>
  //                 <View
  //                   style={{
  //                     flexDirection: 'row',
  //                     alignItems: 'center',
  //                     justifyContent: 'space-between',
  //                   }}>
  //                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                     <Text style={styles.teks2(isDarkMode)}>2.</Text>
  //                     <Gap width={4} />
  //                     <Text style={styles.teks2(isDarkMode)}>{due_date[2]}</Text>
  //                   </View>
  //                   <Text style={styles.teks2(isDarkMode)}>{installments[2]}</Text>
  //                 </View>
  //               </>
  //             )}
  //             {installments && installments[3] != null && (
  //               <>
  //                 <View
  //                   style={{
  //                     flexDirection: 'row',
  //                     alignItems: 'center',
  //                     justifyContent: 'space-between',
  //                   }}>
  //                   <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                     <Text style={styles.teks2(isDarkMode)}>3.</Text>
  //                     <Gap width={4} />
  //                     <Text style={styles.teks2(isDarkMode)}>{due_date[3]}</Text>
  //                   </View>
  //                   <Text style={styles.teks2(isDarkMode)}>{installments[3]}</Text>
  //                 </View>
  //               </>
  //             )} */}
  //           {/* {
  //                             dataDP.map(data => {
  //                                 return(
  //                                     <View key={data.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
  //                                         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //                                             <Text style={styles.teks2(isDarkMode)}>{data.installment_number}. </Text>
  //                                             <Gap width={4} />
  //                                             <Text style={styles.teks2(isDarkMode)}>{data.installment_due}</Text>
  //                                         </View>
  //                                         <Text style={styles.teks2(isDarkMode)}>{helpers.convertToRupiah(data.installment_amount)}</Text>
  //                                     </View>
  //                                 )
  //                             })
  //                         } */}
  //           <Gap height={20} />
  //           <View style={styles.cardDetail2}>
  //             <Text style={styles.teks(isDarkMode)}>Total</Text>
  //             <Text style={styles.teks3(isDarkMode)}>
  //               {/* {helpers.convertToRupiah(item_price)} */}
  //               {/* {helpers.convertToRupiah(membershipPackage.price.toString())} */}
  //               {voucher.total_package_discount !== 0
  //                 ? helpers.convertToRupiah(
  //                     voucher.total_package_discount.toString(),
  //                   )
  //                 : type === 'MBR'
  //                 ? helpers.convertToRupiah(membershipPackage.price.toString())
  //                 : type === 'PPT'
  //                 ? helpers.convertToRupiah(packagePT.total.toString())
  //                 : '??'}
  //             </Text>
  //           </View>
  //           {(membershipPackage.dp_price_disc !== 0 ||
  //             membershipPackage.dp_discount !== 0) && (
  //             <>
  //               <Gap height={20} />
  //               <View style={styles.cardDetail2}>
  //                 <Text style={styles.teks(isDarkMode)}>Feature</Text>
  //                 <Gap height={4} />
  //                 <View style={{flexDirection: 'row', alignItems: 'center'}}>
  //                   {membershipPackage.dp_price_disc !== 0 && (
  //                     <View
  //                       style={{
  //                         alignItems: 'center',
  //                         justifyContent: 'center',
  //                         padding: 4,
  //                         borderRadius: 4,
  //                       }}>
  //                       <Text>
  //                         {helpers.convertToRupiah(
  //                           membershipPackage.dp_price_disc.toString(),
  //                         )}{' '}
  //                         Dp Available
  //                       </Text>
  //                     </View>
  //                   )}
  //                   {membershipPackage.dp_discount !== 0 && (
  //                     <View
  //                       style={{
  //                         alignItems: 'center',
  //                         justifyContent: 'center',
  //                         padding: 4,
  //                         borderRadius: 4,
  //                       }}>
  //                       <Text>
  //                         {`${membershipPackage.dp_discount}%`} DP Available
  //                       </Text>
  //                     </View>
  //                   )}
  //                 </View>
  //               </View>
  //             </>
  //           )}
  //           {/* {
  //                             voucher_name != undefined ?
  //                                 <View style={styles.cardDetail2}>
  //                                     <Text style={styles.teks(isDarkMode)}>Total</Text>
  //                                     <Text style={styles.teks3(isDarkMode)}>{helpers.convertToRupiah(item_price)}</Text>
  //                                 </View>
  //                                 :
  //                                 <View style={styles.cardDetail2}>
  //                                     <Text style={styles.teks(isDarkMode)}>Total</Text>
  //                                     {
  //                                         dataDP[0] == undefined &&
  //                                         <Text style={styles.teks3(isDarkMode)}>{helpers.convertToRupiah(item_price * item_count)}</Text>
  //                                     }
  //                                     {
  //                                         dataDP[0] != undefined &&
  //                                         <Text style={styles.teks3(isDarkMode)}>{helpers.convertToRupiah(dataDP[0].installment_amount)}</Text>
  //                                     }
  //                                 </View>
  //                         } */}
  //         </View>
  //       </ScrollView>
  //       <View style={styles.btn}>
  //         {/* {class_type === 'std' ? (
  //               <ButtonColor
  //                 backColor={colors._green2}
  //                 textColor={colors._white}
  //                 teks="Pay Now"
  //                 onPress={paymentClassStd}
  //               />
  //             ) : (
  //             )} */}
  //         <ButtonColor
  //           backColor={colors._green2}
  //           textColor={colors._white}
  //           teks="Pay Now"
  //           onPress={onNext}
  //         />
  //       </View>
  //       {isLoading && <Loading />}
  //     </SafeAreaView>
  //   );
};

// const ProfileSection = () => {
//   const {theme} = useContext(ThemeContext);
//   const [dataProfile, setDataProfile] = useState<UserDetail>({} as UserDetail);

//   const getProfile = async () => {
//     // setIsLoading(true);
//     try {
//       const {data} = await fetchProfile();
//       if (data) {
//         setDataProfile(data);
//       }
//     } catch (err: any) {
//       Toaster(err.message || 'An error occured', 'warning');
//     } finally {
//       // setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProfile();
//   }, []);

//   return (
//     <>
//       <Text style={styles.teks(isDarkMode)}>Name</Text>
//       <Text style={styles.teks2(isDarkMode)}>{dataProfile.name}</Text>
//       <Gap height={20} />
//       <Text style={styles.teks(isDarkMode)}>Email</Text>
//       <Text style={styles.teks2(isDarkMode)}>{dataProfile.email}</Text>
//       <Gap height={20} />
//       <Text style={styles.teks(isDarkMode)}>Phone Number</Text>
//       <Text style={styles.teks2(isDarkMode)}>{dataProfile.phone}</Text>
//     </>
//   );
// };

// const styles = {
//   container: (isDarkMode: boolean) => ({
//     backgroundColor: isDarkMode ? colors._black2 : colors._white,
//     flex: 1,
//   }),
//   teks: (isDarkMode: boolean) => ({
//     fontSize: 16,
//     fontFamily: fonts.primary[400],
//     color: isDarkMode ? colors._white : colors._black,
//   }),
//   teks2: (isDarkMode: boolean) => ({
//     fontSize: 12,
//     fontFamily: fonts.primary[300],
//     color: isDarkMode ? colors._white : colors._black,
//   }),
//   teks3: (isDarkMode: boolean) => ({
//     fontSize: 20,
//     fontFamily: fonts.primary[400],
//     color: isDarkMode ? colors._white : colors._black,
//   }),
//   cardDetail: {
//     marginHorizontal: 24,
//     borderRadius: 20,
//     flex: 1,
//   },
//   teks4: {
//     fontSize: 16,
//     fontFamily: fonts.primary[400],
//     color: colors._black,
//     textAlign: 'center',
//   },
//   teks5: (isDarkMode: boolean) => ({
//     fontSize: 12,
//     fontFamily: fonts.primary[300],
//     color: isDarkMode ? colors._white : colors._black,
//   }),
//   cardDetail2: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   } as StyleProp<ViewStyle>,
//   btn: {
//     marginHorizontal: 24,
//     marginBottom: 24,
//   },
// };

export default WillTransaction;
