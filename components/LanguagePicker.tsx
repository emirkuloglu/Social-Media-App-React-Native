import { COLORS } from "@/constants/theme";
import i18n from "@/i18n";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LanguagePicker() {
  const [visible, setVisible] = useState(false);

  const languages = [
    { code: "tr", label: "Türkçe" },
    { code: "en", label: "English" },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.button}>
        <View style={styles.iconRow}>
          <Ionicons name="language" size={24} color={COLORS.primary} />
          <Ionicons
            name="caret-down"
            size={16}
            color={COLORS.primary}
            style={{ marginTop: 6 }}
          />
        </View>
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)} />

        <View style={styles.menu}>
          {languages.map(({ code, label }) => (
            <TouchableOpacity
              key={code}
              onPress={() => changeLanguage(code)}
              style={styles.menuItem}
            >
              <Text style={styles.menuText}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1000,
  },
  button: {
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 10,
    borderRadius: 20,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    top: 60,
    right: 0,
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 8,
    width: 120,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});
