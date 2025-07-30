import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type FollowListModalProps = {
  visible: boolean;
  onClose: () => void;
  data: any[];
  title: string;
};

export default function FollowListModal({
  visible,
  onClose,
  data,
  title,
}: FollowListModalProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const { t } = useTranslation();

  const filteredData = useMemo(() => {
    const keyword = search.toLowerCase();
    return data.filter((item) =>
      item?.username?.toLowerCase().includes(keyword)
    );
  }, [search, data]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView
          intensity={50}
          tint="dark"
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: COLORS.background,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingTop: 16,
                maxHeight: "75%",
                height: "75%",
                flexShrink: 0,
                flexGrow: 0,
              }}
            >
              {/* Header */}
              <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginBottom:20 }}>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="arrow-back" size={33} color={COLORS.white} />
                </TouchableOpacity>
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 20,
                    fontWeight: "bold",
                    marginLeft: 12,
                  }}
                >
                  {title}
                </Text>
              </View>

              <View style={{ position: "relative", marginHorizontal: 15 }}>

                <Ionicons name="search" size={30} color={COLORS.grey} style={{ position: "absolute", left: 5, top: 20 }} />
                
                <TextInput
                  placeholder={t("FollowListModal.placeholder")}
                  placeholderTextColor={COLORS.grey}
                  value={search}
                  onChangeText={setSearch}
                  style={{
                    backgroundColor: "#222",
                    color: COLORS.white,
                    padding: 15,
                    borderRadius: 15,
                    marginBottom: 12,
                    marginTop:10,
                    marginLeft:40
                  }}
                />

              </View>

              {/* Liste */}
              <FlatList
                data={filteredData}
                keyExtractor={(item) => item?._id ?? ""}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={() => (
                  <View style={{ marginTop: 48, alignItems: "center" }}>
                    <Ionicons name="people-outline" size={40} color={COLORS.grey} />
                    <Text style={{ color: COLORS.grey, marginTop: 8 }}>
                      {title 
                        === t("FollowListModal.followers")
                        ? t("FollowListModal.nofollowersyet")
                        : t("FollowListModal.nofollowsyet")}
                    </Text>
                  </View>
                )}
                renderItem={({ item }) =>
                  item ? (
                    <TouchableOpacity
                      onPress={() => {
                        onClose();
                        setTimeout(() => {
                          router.push(`/user/${item._id}`);
                        }, 250);
                      }}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#1E1E1E",
                        borderRadius: 12,
                        padding: 12,
                        marginBottom: 12,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          marginRight: 12,
                          backgroundColor: "#333",
                        }}
                      />
                      <Text style={{ color: COLORS.white, fontSize: 16 }}>
                        {item.username}
                      </Text>
                    </TouchableOpacity>
                  ) : null
                }
              />
            </View>
          </TouchableWithoutFeedback>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
