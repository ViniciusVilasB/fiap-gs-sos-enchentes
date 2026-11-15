import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

type SnackbarProps = {
  text: string;
  severity: SnackbarSeverity;
  onDismiss: () => void;
  duration?: number;
};

const severityStyles = {
  success: { backgroundColor: colors.snackbarSuccess, color: colors.snackbarText },
  error: { backgroundColor: colors.snackbarError, color: colors.snackbarText },
  warning: { backgroundColor: colors.snackbarWarning, color: colors.snackbarWarningText },
  info: { backgroundColor: colors.snackbarInfo, color: colors.snackbarText },
};

export function Snackbar({ text, severity, onDismiss, duration = 4000 }: SnackbarProps) {
  useEffect(() => {
    if (!text) {
      return;
    }

    const timeout = setTimeout(onDismiss, duration);
    return () => clearTimeout(timeout);
  }, [text, duration, onDismiss]);

  if (!text) {
    return null;
  }

  const appearance = severityStyles[severity];

  return (
    <View
      style={[styles.container, { backgroundColor: appearance.backgroundColor }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={[styles.text, { color: appearance.color }]}>{text}</Text>
      <TouchableOpacity
        style={styles.dismiss}
        onPress={onDismiss}
        accessibilityRole="button"
        accessibilityLabel="Fechar mensagem"
        hitSlop={8}
      >
        <Text style={[styles.dismissText, { color: appearance.color }]}>Fechar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  text: { flex: 1, fontSize: 15, fontWeight: '600', lineHeight: 21 },
  dismiss: { paddingVertical: 4, paddingLeft: 4 },
  dismissText: { fontSize: 14, fontWeight: '700' },
});
