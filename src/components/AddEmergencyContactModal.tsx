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
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants/colors";
import type { NewEmergencyContact } from "../services/contact";
import { isValidPhoneNumber } from "../utils/validation";

type AddEmergencyContactModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (contact: NewEmergencyContact) => Promise<void>;
  onAdded: () => void;
};

export function AddEmergencyContactModal({
  visible,
  onClose,
  onSubmit,
  onAdded,
}: AddEmergencyContactModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function close() {
    if (saving) return;
    setName("");
    setDescription("");
    setPhoneNumber("");
    setError("");
    onClose();
  }

  async function handleSubmit() {
    setError("");
    if (!name.trim() || !description.trim() || !phoneNumber.trim()) {
      setError("Preencha todos os campos.");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setError("Informe um telefone válido com DDD.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        phonenumber: phoneNumber.trim(),
      });
      setName("");
      setDescription("");
      setPhoneNumber("");
      setError("");
      onClose();
      onAdded();
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Não foi possível adicionar o contato de emergência",
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
            <Text style={styles.title}>Adicionar contato de emergência</Text>
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
            Adicione alguém que possa receber alertas e ajudar você.
          </Text>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.form}
          >
            <View style={styles.field}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nome do contato"
                autoCapitalize="words"
                maxLength={100}
                editable={!saving}
                returnKeyType="next"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Relação com você</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="Ex.: Familiar, vizinho"
                autoCapitalize="sentences"
                maxLength={100}
                editable={!saving}
                returnKeyType="next"
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="(11) 99999-9999"
                keyboardType="phone-pad"
                autoComplete="tel"
                maxLength={20}
                editable={!saving}
                returnKeyType="done"
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
                <Text style={styles.submitButtonText}>Adicionar contato</Text>
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
