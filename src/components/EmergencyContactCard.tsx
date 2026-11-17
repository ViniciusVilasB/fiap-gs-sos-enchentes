import { Alert, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import type { EmergencyContact } from "../services/contact";

type EmergencyContactCardProps = {
  contact: EmergencyContact;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function EmergencyContactCard({ contact }: EmergencyContactCardProps) {
  async function callContact() {
    const phoneNumber = contact.phonenumber.replace(/[^\d+]/g, "");

    try {
      await Linking.openURL(`tel:${phoneNumber}`);
    } catch {
      Alert.alert(
        "Não foi possível iniciar a ligação",
        "Verifique se este dispositivo pode fazer chamadas.",
      );
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.avatar} accessible={false}>
        <Text style={styles.initials}>{getInitials(contact.name)}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.name} numberOfLines={1}>
          {contact.name}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {contact.description}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.callButton}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Ligar para ${contact.name}`}
        onPress={callContact}
      >
        <Ionicons name="call" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBEAFE",
  },
  initials: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  details: { flex: 1, gap: 2 },
  name: { color: colors.text, fontSize: 14, fontWeight: "700" },
  description: { color: colors.textSecondary, fontSize: 12 },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.infoBackground,
  },
});
