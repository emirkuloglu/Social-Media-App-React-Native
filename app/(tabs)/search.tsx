import SearchBar from "@/components/SearchBar";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/notification.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "expo-router";
import debounce from "lodash.debounce";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function Search() {

  const { t } = useTranslation();
  const router = useRouter();
  const { userId } = useAuth();

  const addProfileVisit = useMutation(api.profileVisits.addProfileVisit);
  const visitedProfiles = useQuery(api.profileVisits.getProfileVisits, {visitorClerkId: userId!,});
  const deleteVisit = useMutation(api.profileVisits.deleteProfileVisit);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const debouncedSetQuery = useMemo(
    () =>
      debounce((text: string) => {
        setDebouncedQuery(text);
      }, 500),
    []
  );



  useEffect(() => {
    debouncedSetQuery(query);
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [query]);
  

  const users = useQuery(
    api.users.searchUsers,
    debouncedQuery.length > 0 ? { query: debouncedQuery } : "skip"
  );

  // Kendini sonuçlardan çıkar
  const filteredUsers = (users || []).filter(u => u.clerkId !== userId);




  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("search.search")}</Text>
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={t("search.placeholder")}
      />


      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 24, marginBottom: 8, marginLeft: 16 }}>
        <Ionicons name="time-outline" size={18} color="#aaa" style={{ marginRight: 6 }} />
        <Text style={{ color: "#aaa", fontSize: 16 }}>{t("search.recents")}</Text>
      </View>



      {visitedProfiles && visitedProfiles.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, marginTop: 12 }}>
          {visitedProfiles.slice(0, 10).map((item) => (
            <View
              key={item._id}
              style={{
                position: "relative",
                backgroundColor: "#1e1e1e",
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 24,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 3,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => router.push(`/user/${item.visitedUserId}`)}
                style={{ flexDirection: "row", alignItems: "center", maxWidth: 150 }}
              >
                <Image
                  source={{ uri: item.visitedImage }}
                  style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }}
                />
                <Text numberOfLines={1} style={{ color: "#fff", fontSize: 14 }}>
                  {item.visitedUsername}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteVisit({ id: item._id })}
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  backgroundColor: "black",
                  borderRadius: 10,
                  width: 20,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                <Ionicons name="close-circle-outline" size={18} color="grey" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}




      {query.length === 0 ? (
        <View style={[styles.container, styles.centered]}>
          <Ionicons name="search" size={48} color={COLORS.primary} />
          <Text style={{ fontSize: 20, color: COLORS.white }}>
            {t("search.nosearch")}
          </Text>
        </View>
      ) : filteredUsers.length === 0 ? (
        <Text
          style={{
            color: COLORS.white,
            textAlign: "center",
            marginTop: 20,
            fontSize: 16,
          }}
        >
          {t("search.noresults")}
        </Text>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={async () => {
                await addProfileVisit({
                  visitorClerkId: userId!,
                  visitedUserId: item._id,
                  visitedUsername: item.username,
                  visitedFullname: item.fullname,
                  visitedImage: item.image,
                });

                router.push(`/user/${item._id}`);
              }}
              style={{flexDirection: "row", alignItems: "center", padding: 15}}>

              <Image
                source={{uri: item.image || "https://default-avatar.com/img.png"}}
                style={{ width: 60, height: 60, borderRadius: 35, marginRight: 10 }}
              />

              <View>
                <Text style={{ color: COLORS.white, fontSize: 15 }}>{item.username}</Text>
                <Text style={{ color: COLORS.grey, fontSize: 13 }}>{item.fullname}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {debouncedQuery.length > 0 && !users && (
        <Text
          style={{
            color: COLORS.white,
            textAlign: "center",
            marginTop: 20,
            fontSize: 16,
          }}
        >
          {t("search.loading")}
        </Text>
      )}
    </View>
  );
}
