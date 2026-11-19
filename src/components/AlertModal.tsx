import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import type { Alert } from '../services/alerts';

type AlertModalProps = {
  alert: Alert | null;
  onSafe: () => void;
  onNeedHelp: () => void;
};

export function AlertModal({ alert, onSafe, onNeedHelp }: AlertModalProps) {
  if (!alert) return null;

  const distance = alert.distanceCm != null ? ` (a ${alert.distanceCm} cm do sensor)` : '';

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onSafe}>
      <View style={styles.backdrop}>
        <View style={styles.sheet} accessibilityRole="alert">
          <Text style={styles.label}>ALERTA DE ENCHENTE</Text>
          <Text style={styles.title}>Você está bem?</Text>
          <Text style={styles.message}>
            A água chegou a um nível perigoso na sua rua{distance}. Procure um lugar alto.
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.safe]}
            activeOpacity={0.7}
            accessibilityRole="button"
            onPress={onSafe}
          >
            <Text style={styles.buttonText}>Estou bem</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.help]}
            activeOpacity={0.7}
            accessibilityRole="button"
            onPress={onNeedHelp}
          >
            <Text style={styles.buttonText}>Preciso de ajuda</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.62)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36, gap: 14,
  },
  label: { fontSize: 14, fontWeight: '800', letterSpacing: 1, color: colors.alertText },
  title: { fontSize: 30, fontWeight: '800', color: colors.text },
  message: { fontSize: 16, lineHeight: 22, color: colors.textSecondary },
  button: { minHeight: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  safe: { backgroundColor: '#15803D' },
  help: { backgroundColor: colors.sos },
  buttonText: { color: colors.white, fontSize: 19, fontWeight: '700' },
});