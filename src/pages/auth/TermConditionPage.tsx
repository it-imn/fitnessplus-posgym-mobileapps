import { Theme } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Header from "../../components/ui/Header";
import Gap from "../../components/ui/Gap";
import StatusBarComp from "../../components/ui/StatusBarComp";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ThemeType } from "../../lib/definition";
import { RootStackParamList } from "../../lib/routes";
import { colors, fonts } from "../../lib/utils";
const TermCondition = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, "TermCondition">) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <SafeAreaView style={styles.container(isDarkMode)}>
      <StatusBarComp />
      <Header teks="Term Condition" onPress={() => navigation.goBack()} />
      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.text(isDarkMode)}>
            These terms will automatically apply to you if you download or use
            the app, so be sure to properly read them carefully before using
            this app. The app, any component of the app, or our trademarks may
            not be copied or modified in any way. The program's source code
            cannot be attempted to be extracted, and creating derivative
            versions or translating the software into other languages is not
            permitted. Posgym Digital Asia Ltd. has ownership of the app and any
            associated trade names, copyright, database rights, and other
            intellectual property rights.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            Posgym Digital Asia Ltd. is dedicated to ensuring that the app is as
            beneficial and effective as possible. Because of this, we reserve
            the right to change and/or update the app or impose fees for using
            its features whenever deemed necessary. You will never be charged
            for the app or its services unless you are completely aware of what
            you are purchasing.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            In order to provide better services, the PosGym Member app store
            processes the personal data that you have submitted to us. You are
            responsible for keeping the app and your phone secure. In order to
            avoid software restrictions and limits imposed by your device's
            official operating system, we advise against jailbreaking or rooting
            your phone, as it may damage your phone's security measures, leave
            your device open to malware, viruses, and dangerous apps, and it may
            prevent the PosGym Member app from functioning properly.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            You should be informed that Posgym Digital Asia Ltd. does not accept
            liability for certain situations. The app will need to have an
            active internet connection for some of its features. If you don't
            have access to Wi-Fi or have used up all of your data allotment and
            need a connection, Posgym Digital Asia Ltd. is not responsible for
            the app not functioning properly. The connection can be Wi-Fi or
            provided by your mobile network carrier.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            Your contract terms with your mobile network carrier will still be
            in effect if you use the app outside of a Wi-Fi hotspot. As a
            result, you can incur additional fees from third parties or be
            charged by your mobile service provider for the cost of data for the
            time that you were connected and using the app. If you use the app
            outside of your home area (i.e., region or nation) without turning
            off data roaming, you agree to pay any associated fees as a
            condition of doing so, including roaming data fees. Please be aware
            that we presume you have permission from the bill payer to use the
            app if you are not the one paying the bill for the device on which
            you are using.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            In a similar manner, Posgym Digital Asia Ltd. cannot always be held
            accountable for how you use the software, such as you must make sure
            that your device is always powered on if you want to use the
            service; Posgym Digital Asia Ltd. cannot be held responsible if the
            battery dies and/or you are unable to turn the device on.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            When using the app, it's important to remember that although we make
            every effort to ensure that it is current and accurate at all times,
            we do rely on third parties to provide information to us so that we
            can make it available to you. This is relevant to Posgym Digital
            Asia Ltd.'s responsibility for your use of the app.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            Posgym Digital Asia Ltd. disclaims all responsibility for any direct
            or indirect losses you may incur as a result of depending solely on
            this app's functionality.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            We may upgrade the app in the future. The app is now accessible on
            Android & iOS., and if you wish to continue using the app, you'll
            need to download the updates because the requirements for both
            systems (and for any more systems we decide to make the app
            available to) may change. Posgym Digital Asia Ltd. does not
            guarantee that it will update the app frequently enough for it to be
            useful to you and/or compatible with the Android & iOS versions that
            you have set up on your device.
          </Text>
          <Gap height={12} />
          <Text style={styles.text(isDarkMode)}>
            We may decide to stop supplying the app, and we may terminate your
            use of it at any time without providing you with a notice of
            termination. Nevertheless, you agree to always accept updates to the
            application when given to you. Upon the event of termination, (a)
            the licenses and rights granted to you under these terms will
            terminate, unless we notify you otherwise; and (b) you must stop
            using the app and (if necessary) remove it from your device.
          </Text>
          <Gap height={12} />
          <Text style={styles.text2(isDarkMode)}>
            Term and Condition Modifications
          </Text>
          <Gap height={4} />
          <Text style={styles.text(isDarkMode)}>
            Our Terms and Conditions may occasionally be updated. As a result,
            you are urged to periodically check this page for updates. By
            publishing the updated Terms and Conditions on this website, we will
            let you know of any changes. These modifications take effect as soon
            as they are published on this page.
          </Text>
          <Gap height={12} />
          <Text style={styles.text2(isDarkMode)}>Message Us</Text>
          <Gap height={4} />
          <Text style={styles.text(isDarkMode)}>
            Please feel free to email us at info@PosGym.com if you have any
            questions or comments regarding our Terms and Conditions.{" "}
          </Text>
          <Gap height={12} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  container: (isDarkMode: boolean) => ({
    flex: 1,
    backgroundColor: isDarkMode ? colors._black2 : colors._white,
  }),
  content: {
    paddingHorizontal: 24,
  },
  text: (isDarkMode: boolean) =>
    ({
      fontSize: 14,
      color: isDarkMode ? colors._grey2 : colors._black,
      fontFamily: fonts.primary[300],
      lineHeight: 21,
      textAlign: "justify",
    } as StyleProp<ViewStyle>),
  text2: (isDarkMode: boolean) =>
    ({
      fontSize: 14,
      color: isDarkMode ? colors._grey2 : colors._black,
      fontFamily: fonts.primary[400],
      lineHeight: 21,
    } as StyleProp<ViewStyle>),
};

export default TermCondition;
