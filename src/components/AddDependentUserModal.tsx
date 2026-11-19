import { AddDependentRequest } from "@/services/dependent";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../constants/colors";

type AddDependentUserModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (body: AddDependentRequest) => Promise<void>;
  onAdded: () => void;
};

export function AddDependentUserModal({
  visible,
  onClose,
  onSubmit,
  onAdded,
}: AddDependentUserModalProps) {
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function close() {
    if (saving) return;
    setEmail("");
    setError("");
    onClose();
  }

  async function handleSubmit() {
    setError("");
    if (!email.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setSaving(true);
    try {
      const body = { DependentEmail: email };
      await onSubmit(body);
      setEmail("");
      setError("");
      onClose();
      onAdded();
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível adicionar o dependente",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar dependente</Text>
            <TouchableOpacity
              onPress={close}
              disabled={saving}
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={8}
            >
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.description}>
            Adicione alguém que já esteja cadastrado no aplicativo.
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.form}
          >
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email do usuário no aplicativo"
                autoCapitalize="words"
                maxLength={100}
                editable={!saving}
                returnKeyType="next"
              />
            </View>

            {error ? (
              <Text style={styles.error} accessibilityRole="alert">
                {error}
              </Text>
            ) : null}

            <TouchableOpacity
              style={[styles.submitButton, saving && styles.disabledButton]}
              activeOpacity={0.7}
              accessibilityRole="button"
              disabled={saving}
              onPress={handleSubmit}
            >
              {saving ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>
                  Adicionar dependente
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.7}
              accessibilityRole="button"
              disabled={saving}
              onPress={close}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(15, 23, 42, 0.48)",
  },
  card: {
    maxHeight: "90%",
    backgroundColor: colors.background,
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  title: { flex: 1, color: colors.text, fontSize: 20, fontWeight: "700" },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  form: { gap: 14, paddingTop: 18, paddingBottom: 4 },
  field: { gap: 6 },
  label: { color: colors.text, fontSize: 14, fontWeight: "600" },
  input: {
    minHeight: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
  },
  error: { color: colors.sos, fontSize: 14, fontWeight: "600" },
  submitButton: {
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
    marginTop: 4,
  },
  disabledButton: { opacity: 0.7 },
  submitButtonText: { color: colors.white, fontSize: 16, fontWeight: "700" },
  cancelButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: "600",
  },
});
