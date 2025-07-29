import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

type FollowListModalProps = {
  visible: boolean;
  onClose: () => void;
  data: any[]; // Takipçi veya takip edilen listesi
  title: string;
};

export default function FollowListModal({ visible, onClose, data, title }: FollowListModalProps) {
  const router = useRouter();

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, backgroundColor: COLORS.background, paddingTop: 60 }}>
        <TouchableOpacity onPress={onClose} style={{ padding: 16 }}>
          <Ionicons name="arrow-back" size={30} color={COLORS.white} />
        </TouchableOpacity>

        <Text
          style={{
            color: COLORS.white,
            fontSize: 20,
            fontWeight: "bold",
            paddingHorizontal: 16,
            marginBottom: 12,
          }}
        >
          {title}
        </Text>

        <FlatList
          data={data}
          keyExtractor={(item) => item?._id ?? ""}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={() => (
            <Text style={{ color: COLORS.grey, textAlign: "center", marginTop: 32 }}>
              {title === "Followers" ? "Henüz takipçi yok" : "Henüz takip ettiği kimse yok"}
            </Text>
          )}
          renderItem={({ item }) =>
            item ? (
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  router.push(`/user/${item._id}`);
                }}
                style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
              >
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
                />
                <Text style={{ color: COLORS.white, fontSize: 16 }}>{item.username}</Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
    </Modal>
  );
}
