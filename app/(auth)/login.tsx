import { COLORS } from "@/constants/theme";
import i18n from "@/i18n";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Image, Text, TouchableOpacity, View } from "react-native";


export default function login() {
  const { t } = useTranslation();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });

      if (setActive && createdSessionId) {
        setActive({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (error) {
      console.error("OAuth error:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* BRAND SECTION */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
          <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>

        <TouchableOpacity onPress={() => i18n.changeLanguage("tr")}>
          <Text>Türkçe</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => i18n.changeLanguage("en")}>
          <Text>English</Text>
        </TouchableOpacity>


        <Text style={styles.appName}>{t("login.appName")}</Text>
        <Text style={styles.tagline}>{t("login.tagline")}</Text>
      </View>

      {/* ILLUSTRATION */}
      <View style={styles.illustrationContainer}>
        <Image
          source={require("../../assets/images/auth-bg-2.jpg")}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>

      {/* LOGIN SECTION */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="logo-google" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>{t("login.continueWithGoogle")}</Text>
        </TouchableOpacity>

        <Text style={styles.termsText}>{t("login.termsAndPrivacy")}</Text>
      </View>
    </View>
  );
}