import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";
import type { Dependent } from "../services/dependent";

type DependentCardProps = {
  dependent: Dependent;
  status?: string;
};

export function DependentCard({ dependent, status }: DependentCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.name}>{dependent.name}</Text>
        <Text style={styles.age}>{dependent.age} anos</Text>
      </View>
      {status ? (
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  details: { flex: 1, gap: 3 },
  name: { color: colors.text, fontSize: 16, fontWeight: "700" },
  age: { color: colors.textSecondary, fontSize: 14 },
  statusBadge: {
    maxWidth: "45%",
    borderRadius: 20,
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: { color: "#166534", fontSize: 12, fontWeight: "700" },
});
