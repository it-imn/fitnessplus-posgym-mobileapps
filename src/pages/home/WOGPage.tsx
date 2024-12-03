import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import Header from "../../components/ui/Header";
import { IWOG } from "../../lib/definition";
import { fetchCountWOG } from "../../services/who-on-gym";
import { showMessage } from "react-native-flash-message";
import Loading from "../../components/ui/Loading";
import Gap from "../../components/ui/Gap";
import {
  Clock4Icon,
  ContactIcon,
  ContactRoundIcon,
  DumbbellIcon,
  MailIcon,
  PhoneIcon,
  UsersIcon,
} from "lucide-react-native";
import moment from "moment";

const width = Dimensions.get("window").width;

export const WOG = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "WOG">) => {
  const { isDarkMode } = useContext(ThemeContext);

  const [countWOG, setCountWOG] = useState<IWOG | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCountWOG = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchCountWOG();
      setCountWOG(data);
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
    getCountWOG();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="Who's On Gym" onPress={() => navigation.goBack()} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 24,
        }}>
        <Text
          style={{
            color: isDarkMode ? colors._white : colors._black2,
            fontFamily: fonts.primary[400],
            fontSize: 12,
          }}>
          {countWOG?.date}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 24,
        }}>
        <View
          style={{
            width: width / 5,
            backgroundColor: isDarkMode ? colors._black : colors._white,
            alignItems: "center",
            padding: 10,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 1,
          }}>
          <Text
            style={{
              fontFamily: fonts.primary[700],
              color: isDarkMode ? colors._white : colors._black2,
              fontSize: 12,
            }}>
            {countWOG?.count_member}
          </Text>
          <Gap height={4} />
          <UsersIcon
            size={16}
            color={isDarkMode ? colors._white : colors._black2}
          />
          <Gap height={4} />
          <Text
            style={{
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._grey4,
              fontSize: 10,
            }}>
            Member
          </Text>
        </View>
        <View
          style={{
            width: width / 5,
            backgroundColor: isDarkMode ? colors._black : colors._white,
            alignItems: "center",
            padding: 10,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 1,
          }}>
          <Text
            style={{
              fontFamily: fonts.primary[700],
              color: isDarkMode ? colors._white : colors._black2,
              fontSize: 12,
            }}>
            {countWOG?.count_personal_trainer}
          </Text>
          <Gap height={4} />
          <DumbbellIcon
            size={16}
            color={isDarkMode ? colors._white : colors._black2}
          />
          <Gap height={4} />
          <Text
            style={{
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._grey4,
              fontSize: 10,
            }}>
            Trainer
          </Text>
        </View>
        <View
          style={{
            width: width / 5,
            backgroundColor: isDarkMode ? colors._black : colors._white,
            alignItems: "center",
            padding: 10,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 1,
          }}>
          <Text
            style={{
              fontFamily: fonts.primary[700],
              color: isDarkMode ? colors._white : colors._black2,
              fontSize: 12,
            }}>
            {countWOG?.count_instructor}
          </Text>
          <Gap height={4} />
          <ContactIcon
            size={16}
            color={isDarkMode ? colors._white : colors._black2}
          />
          <Gap height={4} />
          <Text
            style={{
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._grey4,
              fontSize: 10,
            }}>
            Instructure
          </Text>
        </View>
        <View
          style={{
            width: width / 5,
            backgroundColor: isDarkMode ? colors._black : colors._white,
            alignItems: "center",
            padding: 10,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 1,
          }}>
          <Text
            style={{
              fontFamily: fonts.primary[700],
              color: isDarkMode ? colors._white : colors._black2,
              fontSize: 12,
            }}>
            {countWOG?.count_operational}
          </Text>
          <Gap height={4} />
          <ContactRoundIcon
            size={16}
            color={isDarkMode ? colors._white : colors._black2}
          />
          <Gap height={4} />
          <Text
            style={{
              fontFamily: fonts.primary[300],
              color: isDarkMode ? colors._white : colors._grey4,
              fontSize: 10,
            }}>
            Operational
          </Text>
        </View>
      </View>
      <Gap height={16} />
      <View
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          paddingVertical: 10,
          paddingHorizontal: 24,
        }}>
        <Text
          style={{
            color: isDarkMode ? colors._white : colors._black2,
            fontFamily: fonts.primary[400],
            fontSize: 12,
          }}>
          Users
        </Text>
      </View>
      <FlatList
        style={{ paddingHorizontal: 24, flex: 1 }}
        refreshing={isLoading}
        onRefresh={() => {}}
        // onEndReached={handleEndReached}
        data={countWOG?.cico}
        renderItem={({ item }) => (
          <MemberCard
            name={item.user.name}
            image={item.user.image_thumbnail}
            status={item.status}
            time={
              item.status === "CHECKIN" ? item.checkinTime : item.checkoutTime
            }
            onPress={() => {}}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<NoData text="No Data Available" />}
      />

      {isLoading && <Loading />}
    </SafeAreaView>
  );
};

const MemberCard = ({
  name,
  status,
  time,
  image,
  onPress,
}: {
  name: string;
  status: string;
  time: string;
  image: string;
  onPress: () => void;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Fragment>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: "row",
          padding: 12,
          borderRadius: 12,
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
        }}>
        <View
          style={{ flexDirection: "row", alignItems: "center", flexShrink: 1 }}>
          <Image
            source={{ uri: image }}
            style={{
              width: 50,
              height: 50,
              borderWidth: 0.5,
              borderColor: isDarkMode ? colors._grey4 : colors._grey3,
              borderRadius: 50,
            }}
          />
          <Gap width={16} />
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              flexShrink: 1,
            }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: fonts.primary[600],
                color: isDarkMode ? colors._white : colors._black,
              }}>
              {name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._grey4 : colors._grey3,
                }}>
                {status}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}>
              <Clock4Icon
                size={12}
                color={isDarkMode ? colors._grey4 : colors._grey3}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: fonts.primary[400],
                  color: isDarkMode ? colors._grey4 : colors._grey3,
                }}>
                {moment(time).format("HH:mm")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{ width: "100%", height: 1, backgroundColor: colors._grey3 }}
      />
    </Fragment>
  );
};
