import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  GestureResponderEvent,
  Image,
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../lib/routes";
import { Theme } from "@react-navigation/native";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IBranch, ThemeType } from "../../lib/definition";
import { colors, fonts } from "../../lib/utils";
import { fetchBranchesWithGym } from "../../services/gym";
import { useSignUpStore } from "../../stores/useSignUpStore";
import { showMessage } from "react-native-flash-message";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { useDebounce } from "use-debounce";
import NoData from "../../components/ui/NoData";

const SelectBranch = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "SelectBranch">) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const gymId = useSignUpStore(state => state.signUpReq.gym_id);
  const updateSignUpReq = useSignUpStore(state => state.update);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [debouncedText] = useDebounce(search, 500);

  const [isLoading, setIsLoading] = useState(false);

  const getBranch = async (
    _page: number,
    _search: string,
    signal: AbortSignal,
  ) => {
    setIsLoading(true);
    try {
      const { data, hasNext } = await fetchBranchesWithGym(
        gymId,
        { page: _page, search: _search },
        { signal },
      );
      if (data) {
        setBranches(prev => [...prev, ...data]);

        setHasNextPage(hasNext);
      }
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

    const ctrl = new AbortController();

    getBranch(nextPage, debouncedText, ctrl.signal);
  };

  // Fetch
  useEffect(() => {
    console.log("fetch");
    setPage(1);
    setBranches([]);

    const ctrl = new AbortController();

    getBranch(1, debouncedText, ctrl.signal);

    return () => {
      ctrl.abort();
    };
  }, [debouncedText]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? colors._black2 : colors._white,
      }}>
      <StatusBarComp />
      <Header teks="SELECT BRANCH" onPress={() => navigation.goBack()} />
      <View style={styles.container}>
        <Text style={styles.teks2(isDarkMode)}>
          Select branch you want to register
        </Text>
        <Gap height={20} />
        <TextInput
          onChangeText={handleSearchChange}
          value={search}
          placeholder={"Search branch"}
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
          style={{ flex: 1 }}
          onRefresh={() => {
            console.log("refresh");
            setPage(1);
            setBranches([]);

            const ctrl = new AbortController();
            getBranch(1, debouncedText, ctrl.signal);
          }}
          onEndReached={handleEndReached}
          data={branches}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <CardSelectBranch
              key={item.id}
              branch_name={item.name}
              branch_image={item.image}
              onPress={() => {
                updateSignUpReq({
                  branch_id: item.id,
                  branch_name: item.name,
                });
                navigation.navigate("SignConfirmation");
              }}
            />
          )}
          ListEmptyComponent={<NoData text="No Data Available" />}
        />
      </View>
    </SafeAreaView>
  );
};

const CardSelectBranch = ({
  onPress,
  branch_name,
  branch_image,
}: {
  onPress: (e: GestureResponderEvent) => void;
  branch_name: string;
  branch_image: string;
}) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: isDarkMode ? colors._black : colors._grey2,
        borderRadius: 10,
        marginBottom: 8,
        padding: 16,
      }}
      onPress={onPress}>
      <Image
        source={{ uri: branch_image }}
        style={{ width: 30, height: 30, borderRadius: 10 }}
      />
      <Gap width={10} />
      <Text
        style={{
          color: isDarkMode ? colors._white : colors._black,
          fontFamily: fonts.primary[400],
          fontSize: 14,
        }}>
        {branch_name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 24,
  },
  teks2: (isDarkMode: boolean) => ({
    color: isDarkMode ? colors._white : colors._black,
    marginBottom: 5,
    fontSize: 16,
    fontFamily: fonts.primary[400],
  }),
};

export default SelectBranch;
