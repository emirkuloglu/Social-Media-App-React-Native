import FollowListModal from "@/components/FollowListModal";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";
import SettingsModal from "@/components/SettingsModal";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";

export default function Profile() {
  const { t } = useTranslation();
  const { signOut, userId } = useAuth();
  const [showSettings, setShowSettings] = useState(false);

  // Aktif kullanıcı verisi
  const currentUser = useQuery(api.users.getUserByClerkId, userId ? { clerkId: userId } : "skip");

  // Profil sahibinin postları
  const profileUserPosts = useQuery(
    api.posts.getPostsByUser,
    currentUser ? { userId: currentUser._id } : "skip"
  );

  // Modalda gösterilecek kullanıcı ID ve o kullanıcının postları
  const [modalUserId, setModalUserId] = useState<Id<"users"> | null>(null);
  const [modalStartIndex, setModalStartIndex] = useState(0);
  const ITEM_HEIGHT = 700;
  const userPosts = useQuery(
    api.posts.getPostsByUser,
    modalUserId ? { userId: modalUserId } : "skip"
  );

  // Modal görünürlüğü
  const [showUserPostsModal, setShowUserPostsModal] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

const followers = useQuery(api.follows.getFollowers, currentUser?._id ? { userId: currentUser._id } : "skip") ?? [];
const following = useQuery(api.follows.getFollowing, currentUser?._id ? { userId: currentUser._id } : "skip") ?? [];

  // Profil düzenleme modali için state
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });

  const updateProfile = useMutation(api.users.updateProfile);

  useEffect(() => {
    if (currentUser) {
      setEditedProfile({
        fullname: currentUser.fullname || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    await updateProfile(editedProfile);
    setIsEditModalVisible(false);
  };

  if (!currentUser) return <Loader />;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>

        <View style={styles.headerLeft}>
          <Text style={styles.username}>{currentUser.username}</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => setShowSettings(true)}>
            <Ionicons name="settings-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          {/* AVATAR & STATS */}
          <View style={styles.avatarAndStats}>
            <View style={styles.avatarContainer}>
              <Image
                source={currentUser.image}
                style={styles.avatar}
                contentFit="cover"
                transition={200}
              />
            </View>

            <View style={styles.statsContainer}>

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.posts}</Text>
                <Text style={styles.statLabel}>{t("profile.posts")}</Text>
              </View>

              {/* Takipçi butonu */}
              <TouchableOpacity onPress={() => setShowFollowers(true)}>
                <Text style={styles.statNumber}>{currentUser.followers}</Text>
                <Text style={styles.statLabel}>{t("profile.followers")}</Text>
              </TouchableOpacity>

              {/* Takip edilen butonu */}
              <TouchableOpacity onPress={() => setShowFollowing(true)}>
                <Text style={styles.statNumber}>{currentUser.following}</Text>
                <Text style={styles.statLabel}>{t("profile.following")}</Text>
              </TouchableOpacity>

            </View>
          </View>

          <Text style={styles.name}>{currentUser.fullname}</Text>
          {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text style={styles.editButtonText}>{t("profile.editprofile")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Ionicons name="share-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {(!profileUserPosts || profileUserPosts.length === 0) && <NoPostsFound />}

        {/* Profil sahibinin gönderileri */}
        <FlatList
          data={(profileUserPosts || []).slice().reverse()}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.gridItem}
              onPress={() => {
                setModalUserId(item.userId);
                setModalStartIndex(index);
                setShowUserPostsModal(true);
              }}
            >
              <Image
                source={item.imageUrl}
                style={styles.gridImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id}
        />

      </ScrollView>

      {/* PROFİL DÜZENLEME MODALI */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t("profile.editprofile")}</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t("profile.name")}</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.fullname}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, fullname: text }))
                  }
                  placeholderTextColor={COLORS.grey}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t("profile.bio")}</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, bio: text }))
                  }
                  multiline
                  numberOfLines={4}
                  placeholderTextColor={COLORS.grey}
                />
              </View>

              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Text style={styles.saveButtonText}>{t("profile.savechanges")}</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>

      {/* KULLANICININ TÜM POSTLARINI GÖSTEREN MODAL */}
      <Modal
        visible={showUserPostsModal}
        animationType="slide"
        onRequestClose={() => setShowUserPostsModal(false)}
        transparent={false}
      >
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>

          <View style={[styles.header, { flexDirection: "row", alignItems: "center", padding: 16, paddingVertical: 20, paddingHorizontal: 16 }]}>
            <TouchableOpacity onPress={() => setShowUserPostsModal(false)}>
              <Ionicons name="arrow-back" size={30} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { flex: 1, textAlign: "justify", marginLeft:20, fontSize: 22 }]}>
              {t("profile.posts")}
            </Text>
          </View>
          
          <FlatList
            data={(userPosts || []).slice().reverse()}
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

      <FollowListModal
        visible={showFollowers}
        onClose={() => setShowFollowers(false)}
        data={followers}
        title={t("profile.followers")}
      />

      <FollowListModal
        visible={showFollowing}
        onClose={() => setShowFollowing(false)}
        data={following}
        title={t("profile.following")}
      />

      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onLogout={signOut}
      />

    </View>
  );
}

function NoPostsFound() {
  const { t } = useTranslation();
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons name="images-outline" size={48} color={COLORS.primary} />
      <Text style={{ fontSize: 20, color: COLORS.white }}>{t("profile.nopost")}</Text>
    </View>
  );
}
