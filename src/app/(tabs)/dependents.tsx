import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddDependentUserModal } from "../../components/AddDependentUserModal";
import { DependentCard } from "../../components/DependentCard";
import { colors } from "../../constants/colors";
import type { Dependent } from "../../services/dependent";
import { addDependentUser, getDependents } from "../../services/dependent";

export default function Dependents() {
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      setLoading(true);
      setError("");

      getDependents()
        .then((data) => {
          if (active) setDependents(data);
        })
        .catch((e: unknown) => {
          if (active) {
            setError(
              e instanceof Error
                ? e.message
                : "Não foi possível carregar os dependentes",
            );
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, []),
  );

  function refreshDependents() {
    getDependents()
      .then(setDependents)
      .catch((e: unknown) => {
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível carregar os dependentes",
        );
      });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>Dependentes</Text>
          <Text style={styles.subtitle}>
            Quem você cuida e como cada um está agora.
          </Text>
        </View>

        <MockMap />

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            accessibilityLabel="Carregando dependentes"
          />
        ) : error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : dependents.length > 0 ? (
          <View style={styles.dependentList}>
            {dependents.map((dependent, index) => (
              <DependentCard
                key={`${dependent.name}-${dependent.age}-${index}`}
                dependent={dependent}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>Nenhum dependente cadastrado.</Text>
        )}

        <TouchableOpacity
          style={[styles.addButton && styles.addButtonDisabled]}
          disabled={loading}
          accessibilityRole="button"
          accessibilityState={{ disabled: loading }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ Adicionar dependente</Text>
        </TouchableOpacity>
      </ScrollView>
      {modalVisible ? (
        <AddDependentUserModal
          visible
          onClose={() => setModalVisible(false)}
          onSubmit={addDependentUser}
          onAdded={refreshDependents}
        />
      ) : null}
    </SafeAreaView>
  );
}

function MockMap() {
  return (
    <View
      style={styles.map}
      accessibilityRole="image"
      accessibilityLabel="Mapa ilustrativo com localizações de exemplo"
    >
      <View style={styles.streetHorizontal} />
      <View style={styles.streetDiagonal} />
      <View style={styles.streetCrossing} />
      <View style={[styles.mapMarker, styles.markerFirst]}>
        <Text style={styles.markerText}>A</Text>
      </View>
      <View style={[styles.mapMarker, styles.markerSecond]}>
        <Text style={styles.markerText}>B</Text>
      </View>
      <View style={styles.mapFooter}>
        <Text style={styles.mapLabel}>Localização - exemplo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 14 },
  heading: { gap: 4, marginBottom: 2 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  map: {
    height: 190,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
  },
  streetHorizontal: {
    position: "absolute",
    top: "38%",
    left: "-5%",
    width: "110%",
    height: 18,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "-7deg" }],
  },
  streetDiagonal: {
    position: "absolute",
    top: "-30%",
    left: "48%",
    width: 18,
    height: "105%",
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "12deg" }],
  },
  streetCrossing: {
    position: "absolute",
    top: "47%",
    left: "-4%",
    width: "58%",
    height: 12,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "-7deg" }],
  },
  mapMarker: {
    position: "absolute",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 18,
    backgroundColor: "#15803D",
  },
  markerFirst: { top: "22%", right: "24%" },
  markerSecond: { top: "54%", left: "25%", backgroundColor: colors.sos },
  markerText: { color: colors.white, fontSize: 13, fontWeight: "700" },
  mapFooter: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    height: 46,
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "rgba(147, 197, 253, 0.75)",
  },
  mapLabel: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: colors.textSection,
    fontSize: 12,
    fontWeight: "600",
  },
  dependentList: { gap: 10 },
  empty: { color: colors.textSecondary, fontSize: 15, paddingVertical: 12 },
  error: { color: colors.sos, fontSize: 15, fontWeight: "600" },
  addButton: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  addButtonDisabled: { opacity: 0.55 },
  addButtonText: { color: colors.textSection, fontSize: 14, fontWeight: "600" },
});
