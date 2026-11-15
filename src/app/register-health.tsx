import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { SnackbarSeverity } from "../components/Snackbar";
import { Snackbar } from "../components/Snackbar";
import { colors } from "../constants/colors";
import { HEALTH_CONDITIONS, MOBILITY_LEVELS } from "../constants/healthProfile";
import { register } from "../services/auth";

export default function RegisterHealth() {
  const router = useRouter();
  const [mobilityLevel, setMobilityLevel] = useState<number | null>(null);
  const [livesAlone, setLivesAlone] = useState<boolean | null>(null);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{
    text: string;
    severity: SnackbarSeverity;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleCondition(condition: string) {
    setHealthConditions((current) =>
      current.includes(condition)
        ? current.filter((item) => item !== condition)
        : [...current, condition],
    );
  }

  async function handleRegister() {
    setSnackbar(null);
    if (mobilityLevel === null || livesAlone === null) {
      setSnackbar({
        text: "Selecione seu nível de mobilidade e informe se mora sozinho(a).",
        severity: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      await register({ mobilityLevel, livesAlone, healthConditions });
      router.replace({ pathname: "/", params: { registered: "true" } });
    } catch (e) {
      setSnackbar({
        text:
          e instanceof Error
            ? e.message
            : "Não foi possível concluir o cadastro",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.step}>ETAPA 2 DE 2</Text>
        <Text style={styles.title}>Perfil de saúde</Text>
        <Text style={styles.subtitle}>
          Essas informações ajudam a priorizar o atendimento em uma emergência.
        </Text>

        <Text style={styles.label}>Qual é seu nível de mobilidade?</Text>
        {MOBILITY_LEVELS.map((level) => {
          const selected = mobilityLevel === level.value;
          return (
            <TouchableOpacity
              key={level.value}
              style={[styles.option, selected && styles.optionSelected]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => setMobilityLevel(level.value)}
              activeOpacity={0.75}
            >
              <View style={styles.optionText}>
                <Text style={styles.optionTitle}>{level.title}</Text>
                <Text style={styles.optionDescription}>
                  {level.description}
                </Text>
              </View>
              <View style={[styles.radio, selected && styles.radioSelected]} />
            </TouchableOpacity>
          );
        })}

        <Text style={styles.label}>Você mora sozinho(a)?</Text>
        <View style={styles.booleanOptions}>
          {[
            { value: true, label: "Sim" },
            { value: false, label: "Não" },
          ].map((option) => {
            const selected = livesAlone === option.value;
            return (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.booleanOption,
                  selected && styles.optionSelected,
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => setLivesAlone(option.value)}
                activeOpacity={0.75}
              >
                <Text
                  style={[styles.booleanText, selected && styles.selectedText]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Condições de saúde</Text>
        <Text style={styles.hint}>
          Selecione todas as opções que se aplicam. (Opcional)
        </Text>
        <View style={styles.conditions}>
          {HEALTH_CONDITIONS.map((condition) => {
            const selected = healthConditions.includes(condition);
            return (
              <TouchableOpacity
                key={condition}
                style={[styles.condition, selected && styles.conditionSelected]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                onPress={() => toggleCondition(condition)}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.conditionText,
                    selected && styles.selectedText,
                  ]}
                >
                  {selected ? "✓  " : ""}
                  {condition}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Cadastrando..." : "Concluir cadastro"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.back}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.backText}>Voltar aos dados pessoais</Text>
        </TouchableOpacity>
      </ScrollView>
      <Snackbar
        text={snackbar?.text ?? ""}
        severity={snackbar?.severity ?? "info"}
        onDismiss={() => setSnackbar(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: "relative",
  },
  content: { padding: 24, gap: 8 },
  step: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  title: { fontSize: 30, fontWeight: "800", color: colors.text },
  subtitle: {
    fontSize: 16,
    lineHeight: 23,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  label: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginTop: 16,
    marginBottom: 4,
  },
  hint: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    gap: 12,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.infoBackground,
  },
  optionText: { flex: 1, gap: 4 },
  optionTitle: { color: colors.text, fontSize: 15, fontWeight: "700" },
  optionDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 19,
  },
  radio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
  },
  radioSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  booleanOptions: { flexDirection: "row", gap: 12 },
  booleanOption: {
    flex: 1,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  booleanText: { color: colors.text, fontSize: 16, fontWeight: "600" },
  selectedText: { color: colors.primary },
  conditions: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  condition: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  conditionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.infoBackground,
  },
  conditionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: "700" },
  back: { alignItems: "center", padding: 16 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: "600" },
});
