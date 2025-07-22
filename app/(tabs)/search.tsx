import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notification.styles";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function Search() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("search.search")}</Text>
      </View>

      <View style={[styles.container, styles.centered]}>
        <Ionicons name="search" size={48} color={COLORS.primary} />
        <Text style={{ fontSize: 20, color: COLORS.white }}>{t("search.nosearch")}</Text>
      </View>
    </View>
  );
}