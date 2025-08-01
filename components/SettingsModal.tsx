import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { BlurView } from "expo-blur";
import { useRouter } from 'expo-router';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function SettingsModal({ visible, onClose, onLogout }: Props) {
    
    const { t, i18n } = useTranslation();
    const [showLangOptions, setShowLangOptions] = useState(false);
    const router = useRouter();

    const languages = [
        { code: "tr", label: "Türkçe", flag: "🇹🇷" },
        { code: "en", label: "English", flag: "🇬🇧" },
    ];

    const handleLanguageChange = (code: string) => {
        i18n.changeLanguage(code);
        setShowLangOptions(false);
    };

    const { user } = useUser();
    const deleteUserFromConvex = useMutation(api.users.deleteUser);

    const handleDeleteAccount = async () => {
    try {
        if (!user) return;

        await user.delete();

        setTimeout(async () => {
        await deleteUserFromConvex({ clerkId: user.id });
        router.replace("/(auth)/login");
        }, 300);

    } catch (err) {
        console.error("Error deleting account:", err);
    }
    };

    const confirmDelete = () => {
    Alert.alert(
        t("SettingsModal.deleteAccount"),
        t("SettingsModal.deleteAccountConfirmation"),
        [
        { text: t("SettingsModal.cancel"), style: "cancel" },
        { text: t("SettingsModal.delete"), style: "destructive", onPress: handleDeleteAccount },
        ]
    );
    };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <BlurView intensity={50} style={{ flex: 1 }}>
        <TouchableOpacity style={{ flex: 1 }} onPress={onClose} activeOpacity={1}>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: COLORS.background,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 24,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold", color: COLORS.white, marginBottom: 16 }}>
              {t("SettingsModal.settings")}
            </Text>

            {/* Dil Seç Butonu */}
            <View>
              <TouchableOpacity
                onPress={() => setShowLangOptions((prev) => !prev)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="language" size={22} color={COLORS.primary} />
                <Text style={{ marginLeft: 10, fontSize: 16, color: COLORS.white }}>
                  {t("SettingsModal.selectLanguage")}
                </Text>
                <Ionicons
                  name={showLangOptions ? "caret-up" : "caret-down"}
                  size={16}
                  color={COLORS.primary}
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>

              {showLangOptions && (
                <View style={{ backgroundColor: "#222", borderRadius: 8, marginTop: 4 }}>
                  {languages.map(({ code, label, flag }) => (
                    <TouchableOpacity
                      key={code}
                      onPress={() => handleLanguageChange(code)}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                      }}
                    >
                      <Text style={{ color: COLORS.primary, fontSize: 16 }}>
                        {flag} {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Çıkış Yap Butonu */}
            <TouchableOpacity
                onPress={onLogout}
                style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16 }}
                >
                <Ionicons name="log-out-outline" size={22} color="red" />
                <Text style={{ marginLeft: 12, color: "red", fontSize: 16 }}>{t("SettingsModal.logout")}</Text>
            </TouchableOpacity>

            {/* Hesap Sil Butonu */}
            <TouchableOpacity
                onPress={confirmDelete}
                style={{ flexDirection: "row", alignItems: "center", paddingVertical: 16 }}
                >
                <Ionicons name="trash-outline" size={22} color="red" />
                <Text style={{ marginLeft: 12, color: "red", fontSize: 16 }}>
                    {t("SettingsModal.deleteAccount")}
                </Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
}
