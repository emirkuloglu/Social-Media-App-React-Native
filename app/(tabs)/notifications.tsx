import { Loader } from "@/components/Loader";
import Notification from "@/components/Notification";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/notification.styles";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TouchableOpacity, View } from "react-native";


export default function Notifications() {
  const { t } = useTranslation();
  const router = useRouter();
  const notifications = useQuery(api.notifications.getNotifications);

  if (notifications === undefined) return <Loader />;
  if (notifications.length === 0) return <NoNotificationsFound />;

  return (

    <>
      <Stack.Screen
        options={{
          title: "Notifications",
          headerShown: false,
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
        }}
      />

      <View style={styles.container}>
        <View style={[styles.header, { flexDirection: "row", alignItems: "center" }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center", marginRight: 28 }}>
            <Text style={{ fontSize: 20, fontFamily: "JetBrainsMono-Medium", color: COLORS.white }}>{t("notifications.notification")}</Text>
          </View>
        </View>

        <FlatList
          data={notifications}
          renderItem={({ item }) => <Notification notification={item} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </>
  );
}

function NoNotificationsFound() {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, styles.centered]}>
      <Ionicons name="notifications-outline" size={48} color={COLORS.primary} />
      <Text style={{ fontSize: 20, color: COLORS.white }}>{t("notifications.nonotification")}</Text>
    </View>
  );
}