import FollowListModal from "@/components/FollowListModal";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function UserProfileScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const profile = useQuery(api.users.getUserProfile, { id: id as Id<"users"> });
  const posts = useQuery(api.posts.getPostsByUser, { userId: id as Id<"users"> });
  const isFollowing = useQuery(api.users.isFollowing, { followingId: id as Id<"users"> });

  const toggleFollow = useMutation(api.users.toggleFollow);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/(tabs)");
  };

  //Modal ve modalda gösterilecek Takipçi-Takip index'i
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  const followers = useQuery(api.follows.getFollowers, profile ? { userId: profile._id } : "skip") ?? [];
  const following = useQuery(api.follows.getFollowing, profile ? { userId: profile._id } : "skip") ?? [];

  // Modal ve modalda gösterilecek post index'i
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Post tam ekran yüksekliği, kendi Post bileşenine göre ayarla
  const ITEM_HEIGHT = 700; 

  if (profile === undefined || posts === undefined || isFollowing === undefined) return <Loader />;

  const handlePostPress = (index: number) => {
    setModalStartIndex(index);
    setShowPostModal(true);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index, animated: false });
    }, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={30} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.username}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <Image
              source={profile.image}
              style={styles.avatar}
              contentFit="cover"
              cachePolicy="memory-disk"
            />

            <View style={styles.statsContainer}>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.posts}</Text>
                <Text style={styles.statLabel}>{t("[id].posts")}</Text>
              </View>

              <TouchableOpacity onPress={() => setShowFollowers(true)} style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>{t("[id].followers")}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowFollowing(true)} style={styles.statItem}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>{t("[id].following")}</Text>
              </TouchableOpacity>

            </View>
          </View>

          <Text style={styles.name}>{profile.fullname}</Text>
          {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? t("[id].following") : t("[id].follow")}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.postsGrid}>
          {posts.length === 0 ? (
            <View style={styles.noPostsContainer}>
              <Ionicons name="images-outline" size={48} color={COLORS.grey} />
              <Text style={styles.noPostsText}>{t("[id].noposts")}</Text>
            </View>
          ) : (
            <FlatList
              data={(posts || []).slice().reverse()}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={styles.gridItem}
                  onPress={() => handlePostPress(index)}
                >
                  <Image
                    source={item.imageUrl}
                    style={styles.gridImage}
                    contentFit="cover"
                    transition={200}
                    cachePolicy="memory-disk"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>
      </ScrollView>

      {/* POSTLARI FULLSCREEN MODALDA GÖSTERME */}
      <Modal
        visible={showPostModal}
        animationType="slide"
        onRequestClose={() => setShowPostModal(false)}
        transparent={false}
      >
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={[styles.header, { flexDirection: "row", alignItems: "center", padding: 16, paddingVertical: 20, paddingHorizontal: 16 }]}>
            <TouchableOpacity onPress={() => setShowPostModal(false)}>
              <Ionicons name="arrow-back" size={30} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { flex: 1, textAlign: "justify", marginLeft:20, fontSize: 22 }]}>
              {t("[id].posts")}
            </Text>
          </View>

          <FlatList
            data={(posts || []).slice().reverse()}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <Post post={item} />}
            contentContainerStyle={{ paddingBottom: 60 }}
            showsVerticalScrollIndicator={false}
            initialScrollIndex={modalStartIndex}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
          />
        </View>
      </Modal>


      {/* TAKİPÇİ-TAKİP MODALI */}
      <FollowListModal
        visible={showFollowers}
        onClose={() => setShowFollowers(false)}
        data={followers}
        title="Followers"
      />

      <FollowListModal
        visible={showFollowing}
        onClose={() => setShowFollowing(false)}
        data={following}
        title="Following"
      />
    </View>
  );
}
