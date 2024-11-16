import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Platform, StatusBar, View } from "react-native";
import ThemeProvider from "./contexts/ThemeContext";
import FlashMessage from "react-native-flash-message";
import GlobalModal from "./components/Modal";
import Router from "./lib/routers";

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
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
