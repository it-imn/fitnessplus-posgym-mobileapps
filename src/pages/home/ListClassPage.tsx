import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios, { CancelToken } from "axios";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import { Input } from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import NoData from "../../components/ui/NoData";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ClassStd } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
import { fetchAllClasses } from "../../services/class";
import { useModalStore } from "../../stores/useModalStore";
import { Button, ButtonColor } from "../../components/ui/Button";
import { showMessage } from "react-native-flash-message";
import { useDebounce } from "use-debounce";
import { ImageNotFound } from "../../assets";
import { DoorClosedIcon, DoorOpenIcon } from "lucide-react-native";

const Class = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "Class">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [classStd, setClassStd] = useState<ClassStd[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedText] = useDebounce(search, 500);
  const isFocused = useIsFocused();
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const { openModal, closeModal } = useModalStore();

  const getAllClasses = async (
    _page: number,
    _search: string,
    token?: CancelToken,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchAllClasses(
        { page: _page, search: _search },
        { cancelToken: token },
      );
      if (data) {
        setClassStd(prev => [...prev, ...data]);

        setHasNextPage(hasNext);
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

  // Handle search input change directly
  const handleSearchChange = (text: string) => {
    console.log("search");
    setSearch(text);
  };

  // Handle pagination when reaching the end of the list
  const handleEndReached = async () => {
    if (!hasNextPage || isLoading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    getAllClasses(nextPage, debouncedText);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setClassStd([]);

    getAllClasses(1, debouncedText);
  }, [debouncedText]);

  return (
    <>
      <SafeAreaView style={styles.container(isDarkMode)}>
        <StatusBarComp />
        <Header teks="Classes" onPress={() => navigation.goBack()} />
        <View
          style={{
            paddingHorizontal: 24,
            flex: 1,
          }}>
          <TextInput
            onChangeText={handleSearchChange}
            value={search}
            placeholder={"Search class"}
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
          <FlatList
            refreshing={isLoading}
            onRefresh={() => {
              console.log("refresh");
              setPage(1);
              setClassStd([]);

              getAllClasses(1, debouncedText);
            }}
            onEndReached={handleEndReached}
            data={classStd}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  borderColor: isDarkMode ? colors._white : colors._black,
                  borderWidth: selectedId === item.id ? 2 : 0,
                  borderRadius: 12,
                }}>
                <CardClass
                  classStd={item}
                  onPress={() => {
                    setSelectedId(selectedId === item.id ? null : item.id);
                  }}
                />
              </View>
            )}
            ListEmptyComponent={<NoData text="No Data Available" />}
          />
          <Gap height={16} />

          <ButtonColor
            backColor={colors._blue2}
            textColor={colors._white}
            teks={selectedId === null ? "Select a class first" : "View Detail"}
            onPress={() => {
              if (selectedId === null) {
                openModal({
                  children: (
                    <Fragment>
                      <Image
                        src={ImageNotFound}
                        style={{
                          width: 150,
                          height: 150,
                          alignSelf: "center",
                        }}
                      />
                      <Gap height={16} />
                      <Text
                        style={{
                          fontFamily: fonts.primary[400],
                          fontSize: 16,
                          color: isDarkMode ? colors._white : colors._black,
                          textAlign: "center",
                        }}>
                        Please select a class first
                      </Text>
                      <Gap height={16} />
                      <TouchableOpacity
                        style={{
                          alignSelf: "center",
                          backgroundColor: colors._red,
                          padding: 12,
                          borderRadius: 8,
                        }}
                        onPress={() => closeModal()}>
                        <Text
                          style={{
                            color: colors._white,
                            fontFamily: fonts.primary[400],
                            fontSize: 16,
                          }}>
                          Okay
                        </Text>
                      </TouchableOpacity>
                    </Fragment>
                  ),
                });
                return;
              }
              navigation.navigate("DetailClass", {
                id: selectedId || 0,
              });
              setSelectedId(null);
            }}
          />
          <Gap height={16} />
        </View>
        {isLoading && <Loading />}
      </SafeAreaView>
    </>
  );
};

const CardClass = ({
  classStd,
  onPress,
}: {
  classStd: ClassStd;
  onPress?: (event: GestureResponderEvent) => void;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={styles.containerCardClass(isDarkMode)}
      onPress={onPress}>
      <Image
        source={{
          uri: classStd.image,
        }}
        height={32}
        width={32}
        borderRadius={16}
      />
      {/* <Text style={styles.teks(isDarkMode)}>{class_name}</Text> */}
      <Gap width={8} />
      <View
        style={{
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "space-between",
        }}>
        <Text style={styles.teksCardClass(isDarkMode)}>
          {classStd.class_name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}>
          <DoorOpenIcon
            size={12}
            color={isDarkMode ? colors._grey4 : colors._grey3}
          />
          <Text style={styles.teks2CardClass(isDarkMode)}>
            {classStd.opened_at_local}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}>
          <DoorClosedIcon
            size={12}
            color={isDarkMode ? colors._grey4 : colors._grey3}
          />
          <Text style={styles.teks2CardClass(isDarkMode)}>
            {classStd.date_class_local}
          </Text>
        </View>
      </View>
      <Text style={styles.teks3CardClass(isDarkMode)}>
        {classStd.count_member || 0}/{classStd.quota || 0}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  teksCardClass: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontFamily: fonts.primary[300],
    fontSize: 18,
  }),
  teks2CardClass: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._grey4 : colors._grey3,
    fontFamily: fonts.primary[400],
    fontSize: 12,
  }),
  teks3CardClass: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    fontFamily: fonts.primary[400],
    fontSize: 18,
  }),
  containerCardClass: (isDarkMode: boolean) =>
    ({
      borderRadius: 12,
      backgroundColor: isDarkMode ? colors._black : colors._grey2,
      padding: 12,
      flexDirection: "row",
      alignItems: "center",
    } as StyleProp<ViewStyle>),
  scrolll: {
    flexWrap: "wrap",
    flexDirection: "row",
    padding: 10,
  },
  container: (isDarkMode: boolean) => ({
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
    flex: 1,
  }),
  sub: (isDarkMode: boolean) => ({
    fontFamily: fonts.primary[400],
    fontSize: 16,
    color: isDarkMode ? colors._white : colors._black,
  }),
  notes: (isDarkMode: boolean) =>
    ({
      fontFamily: fonts.primary[300],
      fontSize: 12,
      color: isDarkMode ? colors._white : colors._black,
      textAlign: "center",
    } as StyleProp<ViewStyle>),
};

export default Class;
