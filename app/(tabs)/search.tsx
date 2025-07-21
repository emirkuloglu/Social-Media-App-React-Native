import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/notification.styles";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Search() {

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <View style={[styles.container, styles.centered]}>
        <Ionicons name="search" size={48} color={COLORS.primary} />
        <Text style={{ fontSize: 20, color: COLORS.white }}>No search yet</Text>
      </View>
    </View>
  );
}