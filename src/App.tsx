import {
  NavigationContainer,
  NavigationContainerRef,
  useNavigationContainerRef,
} from "@react-navigation/native";
import React, { useEffect } from "react";
import { Platform, StatusBar, View } from "react-native";
import ThemeProvider from "./contexts/ThemeContext";
import FlashMessage from "react-native-flash-message";
import GlobalModal from "./components/Modal";
import Router from "./lib/routers";
import { RootStackParamList } from "./lib/routes";
import { unauthorizedInterceptor } from "./lib/axios";

export default function App(): React.JSX.Element {
  const navigationRef = useNavigationContainerRef()


  useEffect(() => {
    unauthorizedInterceptor(navigationRef);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <ThemeProvider>
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
      </ThemeProvider>
    </NavigationContainer>
  );
}
