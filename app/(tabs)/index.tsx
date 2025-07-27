import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import StoriesSection from "@/components/Stories";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles/feed.styles";


export default function Index() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const posts = useQuery(api.posts.getFeedPosts);

  if (posts === undefined) return <Loader />;
  if (posts.length === 0) return <NoPostsFound />;

  // this does nothing
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("index.weirdo")}</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/notifications")}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListHeaderComponent={<StoriesSection />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  );
}


function NoPostsFound() {
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const router = useRouter();

  const onRefresh = () => {
    setRefreshing(true);
    setRefreshCount((prev) => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("index.weirdo")}</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/notifications")}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={<StoriesSection />}
        ListEmptyComponent={
          <View style={{ marginTop: 250, alignItems: "center" }}>
            <Text style={{ fontSize: 20, color: COLORS.primary }}>
              {t("index.nopost")}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: 60, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}