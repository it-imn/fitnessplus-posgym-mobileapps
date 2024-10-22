import { useIsFocused } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import axios, { CancelToken } from "axios";
import React, { Fragment, useContext, useEffect, useState } from "react";
import {
  GestureResponderEvent,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
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
import { Button } from "../../components/ui/Button";
import { showMessage } from "react-native-flash-message";
import { useDebounce } from "use-debounce";
import { ImageNotFound } from "../../assets/index.js";

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
  const { openModal, closeModal } = useModalStore();

  const getAllClasses = async (token: CancelToken) => {
    setIsLoading(true);
    try {
      const { data } = await fetchAllClasses(token, debouncedText);
      if (data) {
        setClassStd(data);
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

  useEffect(() => {
    const source = axios.CancelToken.source();

    isFocused && getAllClasses(source.token);

    return () => {
      source.cancel("Cancelling in cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, debouncedText]);

  const onRefresh = React.useCallback(() => {
    const source = axios.CancelToken.source();

    getAllClasses(source.token);

    return () => {
      source.cancel("Cancelling in cleanup");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Input
            placeholder="Search Class"
            value={search}
            onChangeText={setSearch}
          />
          <Gap height={16} />
          <Text style={styles.sub(isDarkMode)}>Available Classes</Text>
          <Gap height={8} />
          {!isLoading && classStd.length === 0 ? (
            <View
              style={{
                flex: 1,
              }}>
              <NoData text="No classes available" />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
              }
              contentContainerStyle={{ gap: 12 }}>
              {classStd.map((data: ClassStd) => {
                return (
                  <View
                    key={data.id}
                    style={{
                      borderColor: isDarkMode ? colors._white : colors._black,
                      borderWidth: selectedId === data.id ? 2 : 0,
                      borderRadius: 12,
                    }}>
                    <CardClass
                      classStd={data}
                      onPress={() => {
                        setSelectedId(selectedId === data.id ? null : data.id);
                      }}
                    />
                  </View>
                );
              })}

              {/* <Text style={styles.sub(isDarkMode)}>Special Classes</Text>
              <Gap height={8} />
              {classSpl.map((data: any, index: number) => {
                const params = {
                  id: data.id,
                  class_name: data.class_name,
                  class_image: data.class_image,
                  class_price: data.class_total_price,
                  class_desc: data.class_desc,
                  instructure_name: data.instructure_name,
                  instructure_image: data.instructure_image,
                  quota: data.quota,
                  periode: data.periode,
                  schedule: data.schedule,
                  video_link: data.video_link,
                  document_link: data.document_link,
                  available_seat: data.available_seat,
                  map_seat: data.map_seat,
                  package_installments: data.package_installments,
                  type_class: 'SC',
                  index: index,
                  isDarkMode: isDarkMode,
                };
                return (
                  <CardClassSpecial
                    isDarkMode={isDarkMode}
                    key={data.id}
                    class_name={data.class_name}
                    instructure_name={data.instructure_name}
                    instructure_image={data.instructure_image}
                    quota={data.quota}
                    periode={data.periode}
                    schedule={data.schedule}
                    class_image={data.class_image}
                    class_price={data.class_price}
                    class_desc={data.class_desc}
                    video_link={data.video_link}
                    document_link={data.document_link}
                    class_disc={data.class_disc}
                    class_disc_percent={data.class_disc_percent}
                    class_total_price={data.class_total_price}
                    available_seat={data.available_seat}
                    map_seat={data.map_seat}
                    package_installments={data.package_installments}
                    dp_fixed_price={data.package_installments.dp_fixed_price}
                    dp_percentage={data.package_installments.dp_percentage}
                    onPress={() => navigation.navigate('DetailClass', params)}
                  />
                );
              })}
              {classSpl.length === 0 && (
                <Text style={styles.notes(isDarkMode)}>
                  Special class not available
                </Text>
              )} */}
            </ScrollView>
          )}
          <Gap height={16} />

          <Button
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
        <Text style={styles.teks2CardClass(isDarkMode)}>
          Opened at: {classStd.opened_at_local}
        </Text>
        <Text style={styles.teks2CardClass(isDarkMode)}>
          Closed at: {classStd.date_class_local}
        </Text>
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
    color: isDarkMode ? colors._white : colors._black,
    fontFamily: fonts.primary[200],
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
