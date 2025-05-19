import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  GestureResponderEvent,
  Image,
  ImageBackground,
  Linking,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import {
  IconNotification,
  IconQrWhite,
  Personal,
  WoG,
  MerchandiseImage,
  Summary,
  Attendance,
  HeaderHome,
  BMINews,
  BMITheme,
  ClassNews,
  ClassTheme,
  ConsultNews,
  ConsultTheme,
  MembershipNews,
  MembershipTheme,
  MerchandiseNews,
  MerchandiseTheme,
  PTNews,
  PTTheme,
  ScheduleNews,
  ScheduleTheme,
  SummaryNews,
  SummaryTheme,
  WhoGymNews,
  WhoGymTheme,
  ClassImage,
} from "../../assets";
import { fetchProfile } from "../../services/profile";
import { fetchPersonalTrainers } from "../../services/personal_trainer";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Gap from "../../components/ui/Gap";
import Loading from "../../components/ui/Loading";
import { ThemeContext } from "../../contexts/ThemeContext";
import {
  IPersonalTrainer,
  VisitGym,
  UserDetail,
  Branch,
  Membership,
  PersonalTrainerPackage,
  IPromotion,
  INews,
} from "../../lib/definition";
import { colors, fonts } from "../../lib/utils";
import { showMessage } from "react-native-flash-message";
import moment from "moment";
import { useCameraPermission } from "react-native-vision-camera";
import { useModalStore } from "../../stores/useModalStore";
import { fetchPromotions } from "../../services/promotion";
import {
  DoorOpenIcon,
  IdCard,
  MapPin,
  PlusIcon,
  SofaIcon,
  Users2Icon,
} from "lucide-react-native";
import { fetchListNews } from "../../services/news";
import { CancelToken } from "axios";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "../../lib/routes";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";

const width = Dimensions.get("window").width;

function ListPTSection({
  isDarkMode,
  personalTrainers,
  navigation,
  membershipStatus,
}: {
  isDarkMode: boolean;
  personalTrainers: IPersonalTrainer[];
  navigation: any;
  membershipStatus: string;
}) {
  const hide =
    membershipStatus !== "active" && membershipStatus !== "installment";
  return hide ? null : (
    <View
      style={{
        marginHorizontal: 24,
      }}>
      <Text style={styles.teks(isDarkMode)}>Available Personal Trainer</Text>
      <Gap height={8} />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {personalTrainers.map((personalTrainer: IPersonalTrainer) => {
          return (
            <AvailablePT
              key={personalTrainer.id}
              pt_name={personalTrainer.name}
              pt_image={personalTrainer.image}
              paket={personalTrainer.total_package}
              onPress={() => {
                navigation.navigate("DetailPT", {
                  id: personalTrainer.id,
                });
              }}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

function GymServiceSection({
  isDarkMode,
  navigation,
  membershipStatus,
}: {
  isDarkMode: boolean;
  navigation: any;
  membershipStatus: string;
}) {
  const gymServices = [
    {
      name: "Membership",
      image: "member",
      onPress: () => navigation.navigate("Membership"),
      hide: membershipStatus === "freeze_membership",
    },
    {
      name: "Classes",
      image: "class",
      onPress: () => navigation.navigate("Class"),
      hide: membershipStatus !== "active" && membershipStatus !== "installment",
    },
    {
      name: "Who's on Gym",
      image: "who",
      onPress: () => navigation.navigate("WOG"),
    },
    // {
    //   name: 'Schedule',
    //   image: 'schedule',
    //   onPress: () => navigation.navigate("ListSchedule"),
    // },
    // {
    //   name: 'Consultation',
    //   image: 'message',
    //   onPress: gotoConsultation,
    // },
    // {
    //   name: 'Calculate BMI',
    //   image: 'bmi',
    //   onPress: gotoBMI,
    // },
    {
      name: "Personal Trainer",
      image: "personaltrainer",
      onPress: () => navigation.navigate("ListPT"),
      hide: membershipStatus !== "active" && membershipStatus !== "installment",
    },
    // {
    //   name: 'Merchandise',
    //   image: 'bags',
    //   onPress: gotoMerchandise,
    // },
    // {
    //   name: 'Summary',
    //   image: 'summary',
    //   onPress: gotoSummary,
    // },
  ];

  return (
    <View
      style={{
        marginHorizontal: 24,
      }}>
      <Text style={styles.teks(isDarkMode)}>Gym Service</Text>
      <Gap height={8} />
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
        {gymServices.map(service =>
          service.hide ? null : (
            <CardMenu
              key={service.name}
              images={service.image}
              names={service.name}
              onPress={service.onPress}
            />
          ),
        )}
      </ScrollView>
    </View>
  );
}

const CarouselSection = ({ promotions }: { promotions: IPromotion[] }) => {
  // const data = [
  //   {
  //     id: 1,
  //     image: ClassImage,
  //   },
  //   {
  //     id: 2,
  //     image: Personal,
  //   },
  //   {
  //     id: 3,
  //     image: WoG,
  //   },
  //   {
  //     id: 4,
  //     image: MerchandiseImage,
  //   },
  //   {
  //     id: 5,
  //     image: Summary,
  //   },
  //   {
  //     id: 6,
  //     image: Attendance,
  //   },
  // ];

  // const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // const updateCurrentSlideIndex = (e: any) => {
  //   const contentOffsetX = e.nativeEvent.contentOffset.x;
  //   const currentIndex = Math.ceil(contentOffsetX / width);
  //   setCurrentSlideIndex(currentIndex);
  // };

  // return (
  //   <View
  //     style={{
  //       paddingHorizontal: 24,
  //     }}>
  //     <FlatList
  //       onMomentumScrollEnd={updateCurrentSlideIndex}
  //       showsHorizontalScrollIndicator={false}
  //       horizontal
  //       data={promotions}
  //       pagingEnabled
  //       renderItem={({ item }) => {
  //         return (
  //           <Image
  //             src={item.image_thumbnail}
  //             style={{
  //               height: 80,
  //               resizeMode: "contain",
  //               width: Platform.OS === "ios" ? width : width - 50,
  //               marginHorizontal: Platform.OS === "ios" ? -22 : 2,
  //             }}
  //           />
  //         );
  //       }}
  //     />
  //     <Gap height={10} />
  //     <View
  //       style={{
  //         flex: 0.2,
  //         flexDirection: "row",
  //         justifyContent: "center",
  //       }}>
  //       {promotions.map((_, index) => (
  //         <View
  //           key={index}
  //           style={[
  //             {
  //               height: 4,
  //               width: 4,
  //               backgroundColor: colors._grey5,
  //               marginHorizontal: 2,
  //               borderRadius: 4,
  //             },
  //             currentSlideIndex === index && {
  //               backgroundColor: colors._blue4,
  //               width: 10,
  //             },
  //           ]}
  //         />
  //       ))}
  //     </View>
  //   </View>
  // );

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View style={{ flex: 1, marginHorizontal: 24 }}>
      <Carousel
        ref={ref}
        width={width - 48}
        height={80}
        data={promotions}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <Image
            src={item.image_thumbnail}
            style={{
              height: 80,
              resizeMode: "contain",
            }}
          />
        )}
      />

      <Pagination.Basic
        progress={progress}
        data={promotions}
        dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: 10 }}
        onPress={onPressPagination}
      />
    </View>
  );
};

// function CheckVersionModal(props) {
//   return (
//     <Animated.View
//       style={{
//         zIndex: 100,
//         flex: 1,
//         position: 'absolute',
//         width: '100%',
//         backgroundColor: colors._blue,
//         height: heightWindow,
//         opacity: props.fadeMain,
//         justifyContent: 'center',
//         alignItems: 'center',
//         paddingHorizontal: 16,
//       }}>
//       <Animated.View
//         style={{
//           backgroundColor: colors._white,
//           width: '100%',
//           padding: 16,
//           borderRadius: 8,
//           position: 'absolute',
//           opacity: props.fadeView,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             width: '100%',
//           }}>
//           <Text
//             style={{
//               fontFamily: fonts.primary[600],
//               textTransform: 'uppercase',
//               color: colors._black2,
//             }}>
//             Information Update
//           </Text>
//           <TouchableOpacity onPress={() => setShowModal(!showModal)}>
//             <IconCloseBlck />
//           </TouchableOpacity>
//         </View>
//         <Gap height={20} />
//         <Text
//           style={{
//             fontFamily: fonts.primary[600],
//             // 500
//             textAlign: 'center',
//             color: colors._black,
//           }}>
//           To use this app, download the latest version. You can continue to use
//           this app while downloading updates.
//         </Text>
//         <Gap height={10} />
//         <Text
//           style={{
//             fontFamily: fonts.primary[600],
//             // 500
//             textAlign: 'center',
//             color: colors._black,
//           }}>
//           {'common : Update Version '} {versionIOS}
//         </Text>
//         <Text
//           style={{
//             fontFamily: fonts.primary[600],
//             // 500
//             textAlign: 'center',
//             color: colors._black,
//           }}>
//           Your Version : {DeviceInfo.getVersion()}
//         </Text>
//         <Gap height={20} />
//         <TouchableOpacity
//           style={{
//             backgroundColor: colors._blue,
//             width: 100,
//             height: 30,
//             borderRadius: 8,
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//           onPress={() => Linking.openURL(link)}>
//           <Text
//             style={{
//               fontFamily: fonts.primary[600],
//               textAlign: 'center',
//               color: colors._white,
//             }}>
//             Update
//           </Text>
//         </TouchableOpacity>
//       </Animated.View>
//     </Animated.View>
//   );
// }

function CheckCardSection({
  isDarkMode,
  membershipStatus,
  checkIn,
  checkOut,
  navigation,
}: {
  isDarkMode: boolean;
  membershipStatus: string;
  checkIn: string;
  checkOut: string;
  navigation: any;
}) {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { openModal, closeModal } = useModalStore();
  console.log(hasPermission, "hasPermission");
  const goToCheckin = async () => {
    if (!hasPermission) {
      try {
        const permission = await requestPermission();
        console.log(permission);

        if (!permission) {
          openModal({
            children: (
              <View
                style={{
                  backgroundColor: isDarkMode ? colors._black : colors._white,
                  padding: 16,
                  borderRadius: 8,
                }}>
                <Text
                  style={{
                    fontFamily: fonts.primary[600],
                    fontSize: 16,
                    color: isDarkMode ? colors._white : colors._black,
                  }}>
                  You need to allow camera permission to go to checkin
                </Text>
                <Gap height={16} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      closeModal();
                    }}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: colors._grey2,
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.primary[600],
                        fontSize: 14,
                        color: colors._black,
                      }}>
                      Skip
                    </Text>
                  </TouchableOpacity>
                  <Gap width={8} />
                  <TouchableOpacity
                    onPress={() => {
                      Linking.openSettings();
                      closeModal();
                    }}
                    style={{
                      padding: 16,
                      borderRadius: 8,
                      backgroundColor: colors._blue2,
                    }}>
                    <Text
                      style={{
                        fontFamily: fonts.primary[600],
                        fontSize: 14,
                        color: colors._white,
                      }}>
                      Open Setting
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ),
          });
          return;
        }

        navigation.navigate("Checkin");
      } catch (err: any) {
        showMessage({
          icon: "warning",
          message: err.message || "An error occured",
          type: "default",
          backgroundColor: colors._red,
          color: colors._white,
        });
        return;
      }
    }

    navigation.navigate("Checkin");
  };

  const disabled =
    membershipStatus !== "active" && membershipStatus !== "installment";

  return (
    <View
      style={{
        flexDirection: "row",
        marginHorizontal: 24,
      }}>
      <TouchableOpacity
        onPress={goToCheckin}
        style={styles.btnCheck(isDarkMode)}
        disabled={disabled}>
        <TouchableOpacity
          style={styles.UserPhoto}
          onPress={goToCheckin}
          disabled={disabled}>
          <IconQrWhite width={24} height={24} />
          <Gap width={10} />
          <Text
            style={{
              color: colors._white,
              fontFamily: fonts.primary[400],
              fontSize: 14,
            }}>
            Scan QR
          </Text>
        </TouchableOpacity>
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <View
              style={{
                alignItems: "center",
              }}>
              <Text
                style={{
                  color: colors._blue4,
                  fontSize: 12,
                  fontFamily: fonts.primary[300],
                }}>
                Check In
              </Text>
              <Gap height={4} />
              <Text
                style={{
                  color: colors._blue4,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                }}>
                {checkIn === "--:--"
                  ? "--:--"
                  : moment(checkIn).format("hh:mm")}
              </Text>
            </View>
            <Gap width={12} />
            <View
              style={{
                alignItems: "center",
              }}>
              <Text
                style={{
                  color: colors._blue4,
                  fontSize: 12,
                  fontFamily: fonts.primary[300],
                }}>
                Check Out
              </Text>
              <Gap height={4} />
              <Text
                style={{
                  color: colors._blue4,
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                }}>
                {checkOut === "--:--"
                  ? "--:--"
                  : moment(checkOut).format("hh:mm")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

function HeaderSection({
  name,
  branch_name,
  membershipStatus,
  membershipName,
  membershipPeriode,
  navigation,
  notifCount,
}: {
  name: string;
  branch_name: string;
  membershipStatus: string;
  membershipName: string;
  membershipPeriode: string;
  navigation: any;
  notifCount: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
      }}>
      <View
        style={{
          width: "80%",
        }}>
        <Gap height={10} />
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.primary[300],
            color: colors._white,
          }}>{`Hello, ${name}`}</Text>
        <Gap height={10} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}>
          <MapPin color={colors._white} width={16} height={16} />
          <Gap width={4} />
          <Text
            style={{
              fontSize: 20,
              fontFamily: fonts.primary[700],
              color: colors._white,
            }}>
            {branch_name}
          </Text>
        </View>
        <Gap height={10} />
        {membershipStatus === "active" ||
        membershipStatus === "warning" ||
        membershipStatus === "installment" ? (
          // <Text numberOfLines={2} style={styles.teksPaket}>
          //   {`${membershipName} (${membershipPeriode})`}
          // </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <IdCard color={colors._gold} width={16} height={16} />
            <Gap width={4} />
            <Text
              numberOfLines={2}
              style={{
                color: colors._gold,
                fontSize: 16,
                fontFamily: fonts.primary[700],
              }}>
              {`${membershipName} (${membershipPeriode})`}
            </Text>
          </View>
        ) : null}
      </View>
      <TouchableOpacity
        style={{
          width: 25,
          height: 25,
        }}
        onPress={() => navigation.navigate("Notification")}>
        {notifCount > 0 ? (
          <View
            style={{
              backgroundColor: colors._red,
              width: 20,
              height: 20,
              borderRadius: 50,
              position: "absolute",
              zIndex: 10,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              top: -5,
              right: -5,
            }}>
            <Text
              style={{
                color: colors._white,
                fontSize: 12,
              }}>
              {notifCount}
            </Text>
          </View>
        ) : null}
        <IconNotification width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}

export const HomePage = ({ navigation }: any) => {
  const { isDarkMode } = useContext(ThemeContext);

  const isFocused = useIsFocused();

  const [isLoading, setIsLoading] = useState(false);
  const [dataProfile, setDataProfile] = useState<UserDetail | null>(null);
  const [personalTrainers, setPersonalTrainers] = useState<IPersonalTrainer[]>(
    [],
  );
  const [promotions, setPromotions] = useState<IPromotion[]>([]);

  const getPromotions = async () => {
    try {
      const { data } = await fetchPromotions();
      setPromotions(data);
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

  const getProfile = async () => {
    try {
      setIsLoading(true);

      const { data } = await fetchProfile();
      if (data) {
        setDataProfile(data);
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

  const getPersonalTrainers = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchPersonalTrainers();
      if (data) {
        setPersonalTrainers(data);
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

  const onRefresh = React.useCallback(() => {
    getProfile();
  }, []);

  useEffect(() => {
    isFocused &&
      Promise.all([getProfile(), getPersonalTrainers(), getPromotions()]);
  }, [isFocused]);

  return (
    <>
      <SafeAreaView style={styles.container(isDarkMode)}>
        <StatusBar
          barStyle="default"
          backgroundColor={isDarkMode ? colors._black : colors._blue4}
          hidden={false}
          translucent={false}
        />

        <ImageBackground
          source={HeaderHome}
          style={{
            zIndex: 0,
            position: "absolute",
            width: "100%",
            height: 220,
          }}
        />

        <HeaderSection
          name={dataProfile?.name || ""}
          branch_name={dataProfile?.branch.name || ""}
          membershipStatus={dataProfile?.membership.status || ""}
          membershipName={dataProfile?.membership.membership || ""}
          membershipPeriode={dataProfile?.membership.periode || ""}
          navigation={navigation}
          notifCount={dataProfile?.notif_count || 0}
        />
        <Gap height={20} />
        <CheckCardSection
          isDarkMode={isDarkMode}
          membershipStatus={dataProfile?.membership.status || ""}
          checkIn={dataProfile?.visit_gym.check_in || "--:--"}
          checkOut={dataProfile?.visit_gym.check_out || "--:--"}
          navigation={navigation}
        />
        <Gap height={20} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
          }
          style={{
            flex: 1,
          }}>
          <CardInfo
            onPress={() => {
              if (dataProfile?.membership.status === "installment") {
                navigation.navigate("InstallmentPackage");
                return;
              }

              navigation.navigate("Membership");
            }}
            message={dataProfile?.membership.message || ""}
            status={dataProfile?.membership.status || ""}
          />
          <Gap height={10} />
          {dataProfile?.membership.next && (
            <Fragment>
              <CardInfo
                onPress={() => {
                  // if (membership.status === "installment") {
                  //   navigation.navigate("InstallmentPackage");
                  //   return;
                  // }
                  // navigation.navigate("Membership");
                }}
                message={dataProfile.membership.next?.message || ""}
                status={dataProfile.membership.next?.status || ""}
              />
              <Gap height={10} />
            </Fragment>
          )}
          <CardInfo
            onPress={() => {
              if (dataProfile?.pt.status === "installment") {
                navigation.navigate("InstallmentPackage");
                return;
              }

              navigation.navigate("ListPT");
            }}
            message={dataProfile?.pt.message || ""}
            status={dataProfile?.pt.status || ""}
          />
          <Gap height={20} />
          <CarouselSection promotions={promotions} />
          <Gap height={20} />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              flexDirection: "row",
              marginHorizontal: 24,
            }}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                padding: 16,
                borderRadius: 8,
                width: 108,
                height: 108,
              }}>
              <DoorOpenIcon
                color={isDarkMode ? colors._white : colors._black}
                width={24}
                height={24}
              />
              <Gap height={6} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                {dataProfile?.summary.visitGym}
              </Text>
              <Gap height={4} />
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                Visit Gym
              </Text>
            </View>
            <Gap width={20} />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                padding: 16,
                borderRadius: 8,
                width: 108,
                height: 108,
              }}>
              <SofaIcon
                color={isDarkMode ? colors._white : colors._black}
                width={24}
                height={24}
              />
              <Gap height={6} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                {dataProfile?.summary.joinClass}
              </Text>
              <Gap height={4} />
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                Join Class
              </Text>
            </View>
            <Gap width={20} />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                padding: 16,
                borderRadius: 8,
                width: 108,
                height: 108,
              }}>
              <Users2Icon
                color={isDarkMode ? colors._white : colors._black}
                width={24}
                height={24}
              />
              <Gap height={6} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                {dataProfile?.summary.joinPtClass}
              </Text>
              <Gap height={4} />
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                Join PT Class
              </Text>
            </View>
            <Gap width={20} />
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isDarkMode ? colors._black : colors._grey2,
                padding: 16,
                borderRadius: 8,
                width: 108,
                height: 108,
              }}>
              <PlusIcon
                color={isDarkMode ? colors._white : colors._black}
                width={24}
                height={24}
              />
              <Gap height={6} />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                {dataProfile?.summary.point}
              </Text>
              <Gap height={4} />
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  fontFamily: fonts.primary[300],
                  color: isDarkMode ? colors._white : colors._black,
                }}>
                Point
              </Text>
            </View>
          </ScrollView>
          <Gap height={20} />
          <GymServiceSection
            isDarkMode={isDarkMode}
            navigation={navigation}
            membershipStatus={dataProfile?.membership.status || ""}
          />
          <Gap height={20} />
          {personalTrainers.length !== 0 && (
            <>
              <ListPTSection
                isDarkMode={isDarkMode}
                personalTrainers={personalTrainers}
                navigation={navigation}
                membershipStatus={dataProfile?.membership.status || ""}
              />
              <Gap height={20} />
            </>
          )}
          <NewsSection />
        </ScrollView>

        {/* {showModal && (
          <CheckVersionModal fadeMain={fadeMain} fadeView={fadeView} />
        )} */}
      </SafeAreaView>

      {isLoading && <Loading />}
    </>
  );
};

const NewsSection = () => {
  const [news, setNews] = useState<INews[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigation =
    useNavigation<BottomTabNavigationProp<RootStackParamList, "MainApp">>();
  const isFocused = useIsFocused();

  const getNews = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data } = await fetchListNews(
        { page: _page, search: _search },
        {
          cancelToken: token,
        },
      );

      const maxNews = data.slice(0, 5);
      setNews(maxNews);
    } catch (error: any) {
      showMessage({
        message: error.message || "An error occurred",
        type: "warning",
        icon: "warning",
        backgroundColor: colors._red,
        color: colors._white,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isFocused && getNews(1, "");
  }, [isFocused]);

  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 24,
      }}>
      {news.length !== 0 && (
        <>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.primary[600],
              color: colors._black,
            }}>
            News
          </Text>
          <Gap height={8} />
          {news.map(item => {
            return (
              <NewsCard
                key={item.id}
                news={item}
                onClick={() => {
                  navigation.navigate("DetailNews", {
                    id: item.id,
                  });
                }}
              />
            );
          })}
        </>
      )}
    </View>
  );
};

const NewsCard = ({
  news: { image, title, description, created_at },
  onClick,
}: {
  news: INews;
  onClick: () => void;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      onPress={() => {
        onClick();
      }}
      style={{
        borderRadius: 10,
        paddingRight: 16,
        paddingVertical: 16,
        marginBottom: 16,
        flexDirection: "row",
        backgroundColor: isDarkMode ? colors._black : colors._white,
        shadowColor: colors._black,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
      }}>
      <Image
        source={{ uri: image }}
        style={{
          width: 64,
          height: 64,
          borderRadius: 10,
          objectFit: "cover",
        }}
      />
      <Gap width={16} />
      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexShrink: 1,
        }}>
        <View style={{}}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.primary[600],
              color: isDarkMode ? colors._white : colors._black,
            }}>
            {title}
          </Text>
          <Gap height={4} />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._black,
              flexWrap: "wrap",
              textDecorationStyle: "solid",
            }}>
            {description}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.primary[300],
            color: isDarkMode ? colors._white : colors._black,
            marginTop: 8,
          }}>
          {created_at}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const AvailablePT = ({
  onPress,
  pt_name,
  pt_image,
  paket,
}: {
  onPress?: (event: GestureResponderEvent) => void;
  pt_name: string;
  pt_image: string;
  paket: number;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity style={{ marginRight: 8 }} onPress={onPress}>
      <View style={styles.containerAvailablePT(isDarkMode)}>
        <Image
          source={{ uri: pt_image }}
          style={{
            resizeMode: "contain",
            flex: 1,
            borderTopRightRadius: 12,
            borderTopLeftRadius: 12,
          }}
        />
        <Gap height={6} />
        <View style={{ marginHorizontal: 10 }}>
          <Text numberOfLines={1} style={styles.titleAvailablePT(isDarkMode)}>
            {pt_name}
          </Text>
          <Gap height={4} />
          <Text
            numberOfLines={1}
            style={styles.subtitleAvailablePT(isDarkMode)}>
            {paket} packages active
          </Text>
          {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text numberOfLines={1} style={styles.title(theme)}>{day}</Text>
                    </View> */}
        </View>
      </View>
      {/* <ImageBackground source={{ uri: `https://positive-gym.com/${pt_image}` }} imageStyle={{ borderRadius: 12 }} style={{ width: 143, height: 145 }}>
                <View style={{ backgroundColor: colors._black3, padding: 16, width: '100%', height: '100%', justifyContent: "center", borderRadius: 12 }}>
                    <Text numberOfLines={1} style={styles.teks}>{instructure_name}</Text>
                    <Gap height={2} />
                    <Text numberOfLines={1} style={styles.title}>{pt_name}</Text>
                </View>
            </ImageBackground> */}
    </TouchableOpacity>
  );
};

const CardMenu = ({ onPress, images, names, disabled }: any) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <View style={{ marginRight: 14, alignItems: "center" }}>
      <TouchableOpacity
        disabled={disabled}
        style={styles.containerCardMenu(isDarkMode)}
        onPress={onPress}>
        {images === "who" && (
          <Image
            source={isDarkMode ? WhoGymTheme : WhoGymNews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
        {images === "message" && (
          <Image
            source={isDarkMode ? ConsultTheme : ConsultNews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
        {images === "member" && (
          <Image
            source={isDarkMode ? MembershipTheme : MembershipNews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
        {images === "personaltrainer" && (
          <Image
            source={isDarkMode ? PTTheme : PTNews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
        {images === "class" && (
          <Image
            source={isDarkMode ? ClassTheme : ClassNews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
        {images === "bags" && (
          <Image
            source={isDarkMode ? MerchandiseTheme : MerchandiseNews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
        {images === "schedule" && (
          <Image
            source={isDarkMode ? ScheduleTheme : ScheduleNews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
        {images === "bmi" && (
          <Image
            source={isDarkMode ? BMITheme : BMINews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
        {images === "summary" && (
          <Image
            source={isDarkMode ? SummaryTheme : SummaryNews}
            style={{ width: width / 7.5, height: width / 7.5 }}
          />
        )}
      </TouchableOpacity>
      <Gap height={8} />
      <Text style={styles.teks(isDarkMode)}>{names}</Text>
    </View>
  );
};

const CardInfo = ({
  onPress,
  message,
  status,
}: {
  onPress: (event: GestureResponderEvent) => void;
  message: string;
  status: string;
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <View
      style={{
        marginHorizontal: 24,
        flexDirection: "column",
        gap: 20,
        flex: 1,
      }}>
      <TouchableOpacity
        style={{
          shadowColor: colors._black,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          padding: 14,
          backgroundColor: isDarkMode ? colors._black : colors._grey2,
          borderRadius: 8,
          flex: 1,
        }}
        onPress={onPress}
        disabled={
          status !== "not_buy_package" &&
          status !== "warning" &&
          status !== "installment"
        }>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}>
          <Text
            style={{
              fontSize: 12,
              fontFamily: fonts.primary[400],
              color:
                status === "active"
                  ? colors._green2
                  : status === "installment" ||
                    status === "pending" ||
                    status === "warning"
                  ? colors._gold3
                  : colors._red,
            }}>
            {message}
          </Text>
          {status === "not_buy_package" && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: colors._red,
              }}>
              Buy Now
            </Text>
          )}
          {status === "installment" && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: fonts.primary[400],
                color: colors._gold3,
              }}>
              Pay Now
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  teksCardMenu: (isDarkMode: boolean) =>
    ({
      color: isDarkMode ? colors._white : colors._black,
      fontFamily: fonts.primary[300],
      fontSize: 12,
    } as StyleProp<ViewStyle>),
  containerCardMenu: (isDarkMode: boolean) =>
    ({
      // backgroundColor: theme == true ? colors._black : colors._white,
      height: width / 6.5,
      width: width / 6.5,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      // shadowColor: colors._black,
      // shadowOffset: {
      //     width: 0,
      //     height: 0.5,
      // },
      // shadowOpacity: 0.2,
      // shadowRadius: 1,
      // elevation: 10,
    } as StyleProp<ViewStyle>),
  containerAvailablePT: (isDarkMode: boolean) => ({
    width: 150,
    height: 150,
    borderRadius: 12,
    backgroundColor: isDarkMode ? colors._black : colors._grey2,
    paddingBottom: 10,
    marginBottom: 10,
  }),
  teksAvailablePT: {
    fontSize: 12,
    fontFamily: fonts.primary[400],
    color: colors._white,
  },
  titleAvailablePT: (isDarkMode: boolean) =>
    ({
      fontSize: 14,
      fontFamily: fonts.primary[400],
      color: isDarkMode ? colors._white : colors._black,
      textAlign: "center",
    } as StyleProp<ViewStyle>),
  subtitleAvailablePT: (isDarkMode: boolean) =>
    ({
      fontSize: 12,
      fontFamily: fonts.primary[300],
      color: isDarkMode ? colors._white : colors._black,
      textAlign: "center",
    } as StyleProp<ViewStyle>),
  content: {
    backgroundColor: colors._white,
    height: 54,
    width: 54,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors._black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.16,
    shadowRadius: 6.68,
    elevation: 6,
  },
  teks: (isDarkMode: boolean) => ({
    fontFamily: fonts.primary[400],
    fontSize: 14,
    color: isDarkMode ? colors._white : colors._black,
  }),
  teks6: {
    fontSize: 18,
    fontFamily: fonts.primary[400],
    color: colors._white,
    textAlign: "center",
  },
  teks7: {
    fontSize: 14,
    fontFamily: fonts.primary[300],
    color: colors._white,
    textAlign: "center",
  },
  containerdua: {
    shadowOpacity: 1,
    elevation: 3,
    shadowColor: colors._white,
    alignItems: "center",
  },
  topsection: {
    width: "100%",
    height: 180,
  },
  container: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
    flex: 1,
  }),
  mainModal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  modalImage: {
    padding: 30,
    width: 250,
  },
  main: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black : colors._blue4,
  }),
  headerImage: {
    width: 48,
    height: 48,
    borderRadius: 75 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  UserPhoto: {
    padding: 12,
    backgroundColor: colors._blue4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  } as StyleProp<ViewStyle>,
  btnCheck: (isDarkMode: boolean) =>
    ({
      backgroundColor: isDarkMode ? colors._black : colors._white,
      padding: 16,
      width: "100%",
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: isDarkMode ? colors._white : colors._black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.16,
      shadowRadius: 6.68,
      elevation: 6,
    } as StyleProp<ViewStyle>),
  centeredView: {
    padding: 24,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
    backgroundColor: colors._black3,
  },
  modalView: {
    backgroundColor: colors._white,
    padding: 12,
    borderRadius: 20,
  },
  modalText: {
    fontSize: 18,
    color: colors._red,
    fontFamily: fonts.primary[400],
    textAlign: "center",
  },
  textStyle: {
    fontSize: 14,
    color: colors._red,
    fontFamily: fonts.primary[300],
    textAlign: "center",
  },
  textStyle2: {
    fontSize: 14,
    color: colors._black,
    fontFamily: fonts.primary[300],
    textAlign: "center",
  },
  textStyle3: {
    fontSize: 14,
    color: colors._black,
    fontFamily: fonts.primary[400],
    textAlign: "center",
  },
  textStyle4: {
    fontSize: 14,
    color: colors._white,
    fontFamily: fonts.primary[400],
    textAlign: "center",
  },
  btnYes: {
    backgroundColor: colors._grey2,
    padding: 12,
    width: "48%",
    borderRadius: 20,
  },
  btnCancel: {
    backgroundColor: colors._blue,
    padding: 12,
    width: "48%",
    borderRadius: 20,
  },
  btnBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notes: (isDarkMode: boolean) => ({
    fontFamily: fonts.primary[300],
    fontSize: 12,
    color: isDarkMode ? colors._white : colors._black,
    textAlign: "center",
    marginTop: 30,
  }),
  teksPaket: {
    color: colors._gold,
    fontSize: 16,
    fontFamily: fonts.primary[700],
  },
  indicator: {
    height: 4,
    width: 4,
    backgroundColor: colors._grey5,
    marginHorizontal: 2,
    borderRadius: 4,
  },
};
