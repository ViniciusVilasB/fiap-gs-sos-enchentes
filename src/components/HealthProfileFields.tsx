import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { HEALTH_CONDITIONS, MOBILITY_LEVELS } from '../constants/healthProfile';

type HealthProfileFieldsProps = {
  mobilityLevel: number | null;
  onChangeMobilityLevel: (value: number) => void;
  livesAlone: boolean | null;
  onChangeLivesAlone: (value: boolean) => void;
  healthConditions: string[];
  onChangeHealthConditions: (value: string[]) => void;
};

export function HealthProfileFields({
  mobilityLevel,
  onChangeMobilityLevel,
  livesAlone,
  onChangeLivesAlone,
  healthConditions,
  onChangeHealthConditions,
}: HealthProfileFieldsProps) {
  function toggleCondition(condition: string) {
    onChangeHealthConditions(
      healthConditions.includes(condition)
        ? healthConditions.filter((item) => item !== condition)
        : [...healthConditions, condition],
    );
  }

  return (
    <>
      <Text style={styles.label}>Qual é seu nível de mobilidade?</Text>
      {MOBILITY_LEVELS.map((level) => {
        const selected = mobilityLevel === level.value;
        return (
          <TouchableOpacity
            key={level.value}
            style={[styles.option, selected && styles.optionSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChangeMobilityLevel(level.value)}
            activeOpacity={0.75}
          >
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>{level.title}</Text>
              <Text style={styles.optionDescription}>{level.description}</Text>
            </View>
            <View style={[styles.radio, selected && styles.radioSelected]} />
          </TouchableOpacity>
        );
      })}

      <Text style={styles.label}>Você mora sozinho(a)?</Text>
      <View style={styles.booleanOptions}>
        {[
          { value: true, label: 'Sim' },
          { value: false, label: 'Não' },
        ].map((option) => {
          const selected = livesAlone === option.value;
          return (
            <TouchableOpacity
              key={option.label}
              style={[styles.booleanOption, selected && styles.optionSelected]}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChangeLivesAlone(option.value)}
              activeOpacity={0.75}
            >
              <Text style={[styles.booleanText, selected && styles.selectedText]}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Condições de saúde</Text>
      <Text style={styles.hint}>Selecione todas as opções que se aplicam. (Opcional)</Text>
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
              <Text style={[styles.conditionText, selected && styles.selectedText]}>
                {selected ? '✓  ' : ''}
                {condition}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 17, fontWeight: '700', color: colors.text, marginTop: 16, marginBottom: 4 },
  hint: { fontSize: 14, color: colors.textSecondary, marginBottom: 4 },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14, gap: 12,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.infoBackground },
  optionText: { flex: 1, gap: 4 },
  optionTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  optionDescription: { color: colors.textSecondary, fontSize: 14, lineHeight: 19 },
  radio: { width: 20, height: 20, borderWidth: 2, borderColor: colors.border, borderRadius: 10 },
  radioSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  booleanOptions: { flexDirection: 'row', gap: 12 },
  booleanOption: {
    flex: 1, minHeight: 50, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 12,
  },
  booleanText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  selectedText: { color: colors.primary },
  conditions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  condition: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 20,
    backgroundColor: colors.white, paddingHorizontal: 14, paddingVertical: 10,
  },
  conditionSelected: { borderColor: colors.primary, backgroundColor: colors.infoBackground },
  conditionText: { color: colors.textSecondary, fontSize: 14, fontWeight: '600' },
});