import {
  NavigationContainer,
  NavigationContainerRef,
  useNavigationContainerRef,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Platform, StatusBar, View } from "react-native";
import ThemeProvider from "./contexts/ThemeContext";
import FlashMessage from "react-native-flash-message";
import GlobalModal from "./components/Modal";
import Router from "./lib/routers";
import { RootStackParamList } from "./lib/routes";
import { unauthorizedInterceptor } from "./lib/axios";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  setNotificationsHandler,
} from "./lib/notification";
import messaging from "@react-native-firebase/messaging";

setNotificationsHandler();

export default function App() {
  const [headLess, setIsHeadless] = useState(
    Platform.OS === "ios" ? true : false,
  );

  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    unauthorizedInterceptor(navigationRef);

    if (Platform.OS === "ios") {
      messaging()
        .getIsHeadless()
        .then(isHeadless => {
          setIsHeadless(isHeadless);
        });
    }
  }, []);

  return headLess ? null : (
    <NavigationContainer ref={navigationRef}>
      <ThemeProvider>
        <GestureHandlerRootView>
          <Router />
          <FlashMessage
            position="top"
            floating={true}
            animated={true}
            duration={3000}
            style={{
              marginTop: Platform.OS === "ios" ? 16 : StatusBar.currentHeight,
            }}
          />
          <GlobalModal />
        </GestureHandlerRootView>
      </ThemeProvider>
    </NavigationContainer>
  );
}
