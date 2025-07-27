import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

export default function ImageSourceModal({ visible, onClose, onSelect }: {
  visible: boolean;
  onClose: () => void;
  onSelect: (source: "camera" | "gallery") => void;
}) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>{t("ImageSourceModal.selectsource")}</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onSelect("camera");
                onClose();
              }}
            >
              <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
              <Text style={styles.text}>{t("ImageSourceModal.camera")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                onSelect("gallery");
                onClose();
              }}
            >
              <Ionicons name="images-outline" size={20} color={COLORS.primary} />
              <Text style={styles.text}>{t("ImageSourceModal.gallery")}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={styles.cancelText}>{t("ImageSourceModal.cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: COLORS.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.white,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    color: COLORS.white,
  },
  cancel: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    color: COLORS.grey,
    fontSize: 16,
  },
});
