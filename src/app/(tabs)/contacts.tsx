import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddEmergencyContactModal } from "../../components/AddEmergencyContactModal";
import { colors } from "../../constants/colors";
import { EmergencyContactCard } from "../../components/EmergencyContactCard";
import {
  addEmergencyContact,
  getEmergencyContacts,
} from "../../services/contact";
import type { EmergencyContact } from "../../services/contact";

const MAX_CONTACTS = 3;

export default function Contacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      setLoading(true);
      setError("");

      getEmergencyContacts()
        .then((data) => {
          if (active) setContacts(data);
        })
        .catch((e: unknown) => {
          if (active) {
            setError(
              e instanceof Error
                ? e.message
                : "Não foi possível carregar os contatos de emergência",
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

  function refreshContacts() {
    getEmergencyContacts()
      .then(setContacts)
      .catch((e: unknown) => {
        setError(
          e instanceof Error
            ? e.message
            : "Não foi possível carregar os contatos de emergência",
        );
      });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>Contatos de emergência</Text>
          <Text style={styles.subtitle}>
            Quando você aperta o SOS, eles recebem um aviso com a sua localização.
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            accessibilityLabel="Carregando contatos de emergência"
          />
        ) : error ? (
          <Text style={styles.error} accessibilityRole="alert">
            {error}
          </Text>
        ) : (
          <View style={styles.contactList}>
            {contacts.map((contact) => (
              <EmergencyContactCard key={contact.id} contact={contact} />
            ))}
            {contacts.length === 0 ? (
              <Text style={styles.empty}>
                Nenhum contato de emergência cadastrado.
              </Text>
            ) : null}
          </View>
        )}

        <TouchableOpacity
          style={[styles.addButton, contacts.length >= MAX_CONTACTS && styles.addButtonDisabled]}
          disabled={loading || contacts.length >= MAX_CONTACTS}
          accessibilityRole="button"
          accessibilityState={{ disabled: loading || contacts.length >= MAX_CONTACTS }}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>
            + Adicionar contato ({Math.min(contacts.length, MAX_CONTACTS)} de{" "}
            {MAX_CONTACTS})
          </Text>
        </TouchableOpacity>

        <View style={styles.note}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={styles.noteText}>
            Se a internet cair, o aviso vai por SMS assim que houver sinal.
          </Text>
        </View>
      </ScrollView>

      {modalVisible ? (
        <AddEmergencyContactModal
          visible
          onClose={() => setModalVisible(false)}
          onSubmit={addEmergencyContact}
          onAdded={refreshContacts}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 12 },
  heading: { gap: 4, marginBottom: 2 },
  title: { fontSize: 22, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
  contactList: { gap: 10 },
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
  note: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: colors.infoBackground,
    borderRadius: 12,
    padding: 12,
  },
  noteText: { flex: 1, color: colors.infoText, fontSize: 13, lineHeight: 18 },
});
