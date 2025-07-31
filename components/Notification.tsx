import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/notification.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { formatDistanceToNow, Locale } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const localeMap: { [key: string]: Locale } = {
  en: enUS,
  tr: tr,
};

export default function Notification({ notification }: any) {
  const { t, i18n } = useTranslation();
  const languageCode = i18n.language.split("-")[0];
  const currentLocale = localeMap[languageCode] || enUS;
  const deleteNotification = useMutation(api.notifications.deleteNotification);

  const senderExists = !!notification.sender?._id;

  return (
    <View style={styles.notificationItem}>
      <View style={styles.notificationContent}>
        {senderExists ? (
          <Link href={`/user/${notification.sender._id}`} asChild>
            <TouchableOpacity style={styles.avatarContainer}>
              <Image
                source={notification.sender.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.iconBadge}>
                {notification.type === "like" ? (
                  <Ionicons name="heart" size={14} color={COLORS.primary} />
                ) : notification.type === "follow" ? (
                  <Ionicons name="person-add" size={14} color={COLORS.primary} />
                ) : (
                  <Ionicons name="chatbubble" size={14} color={COLORS.primary} />
                )}
              </View>
            </TouchableOpacity>
          </Link>
        ) : (
          <View
            style={[
              styles.avatarContainer,
              { opacity: 0.5 }, // Silinmiş kullanıcı için yarı saydam
            ]}
          >
            <Image
              source={require('@/assets/images/default_avatar.png')}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.iconBadge}>
              {notification.type === "like" ? (
                <Ionicons name="heart" size={14} color={COLORS.primary} />
              ) : notification.type === "follow" ? (
                <Ionicons name="person-add" size={14} color={COLORS.primary} />
              ) : (
                <Ionicons name="chatbubble" size={14} color={COLORS.primary} />
              )}
            </View>
          </View>
        )}

        <View style={styles.notificationInfo}>
          {senderExists ? (
            <Link href={`/user/${notification.sender._id}`} asChild>
              <TouchableOpacity>
                <Text style={styles.username}>{notification.sender.username}</Text>
              </TouchableOpacity>
            </Link>
          ) : (
            <Text style={[styles.username, { opacity: 0.5 }]}>Silinmiş Kullanıcı</Text>
          )}

          <Text style={styles.action} numberOfLines={2} ellipsizeMode="tail">
            {notification.type === "follow"
              ? t("Notification.startedfollowingyou")
              : notification.type === "like"
              ? t("Notification.likedyourpost")
              : t("Notification.commented") + `"${notification.comment}"`}
          </Text>
          <Text style={styles.timeAgo}>
            {formatDistanceToNow(notification._creationTime, {
              addSuffix: true,
              locale: currentLocale,
            })}
          </Text>
        </View>
      </View>

      {notification.post && (
        <Image
          source={notification.post.imageUrl}
          style={styles.postImage}
          contentFit="cover"
          transition={200}
        />
      )}

      <TouchableOpacity
        onPress={() => deleteNotification({ id: notification._id })}
        style={{
          position: "absolute",
          top: 1,
          right: -7,
          padding: 1,
          zIndex: 10,
        }}
      >
        <Ionicons name="close-circle" size={20} color="#888" />
      </TouchableOpacity>
    </View>
  );
}
