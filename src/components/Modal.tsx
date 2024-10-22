import React, { Fragment, useContext } from "react";
import { Modal, Text, View, TouchableOpacity } from "react-native";
import { useModalStore } from "../stores/useModalStore";
import { ThemeContext } from "../contexts/ThemeContext";
import { colors, fonts } from "../lib/utils";
import Gap from "./ui/Gap";

export default function GlobalModal() {
  const { isOpen, children, closeModal } = useModalStore();
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={() => closeModal()}>
      <View
        style={{
          padding: 24,
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: colors._black3,
        }}>
        <View
          style={{
            backgroundColor: isDarkMode ? colors._black : colors._white,
            padding: 12,
            borderRadius: 8,
          }}>
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function errorModal(message: string, isDarkMode: boolean) {
  useModalStore.getState().openModal({
    children: (
      <Fragment>
        <Text
          style={{
            fontFamily: fonts.primary[400],
            fontSize: 16,
            color: isDarkMode ? colors._white : colors._black,
            textAlign: "center",
          }}>
          {message}
        </Text>
        <Gap height={16} />
        <TouchableOpacity
          style={{
            alignSelf: "center",
            backgroundColor: colors._red,
            padding: 12,
            borderRadius: 8,
          }}
          onPress={() => {
            useModalStore.getState().closeModal();
          }}>
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
}
