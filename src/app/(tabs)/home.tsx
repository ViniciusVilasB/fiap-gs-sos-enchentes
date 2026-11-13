import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { getLoggedUser } from '../../services/auth';

const emergencyNumbers = [
  { name: 'SAMU', number: '192' },
  { name: 'Bombeiros', number: '193' },
  { name: 'Defesa Civil', number: '199' },
  { name: 'Polícia', number: '190' },
];

export default function Home() {
  const [sosSent, setSosSent] = useState(false);
  const firstName = getLoggedUser()?.name.split(' ')[0] ?? 'visitante';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.greetingSmall}>SOS Enchentes</Text>
        <Text style={styles.greeting}>Olá, {firstName}</Text>

        {/* <View style={styles.alert}>
          <Text style={styles.alertLevel}>AVISO</Text>
          <Text style={styles.alertTitle}>Sua rua está em alerta</Text>
          <Text style={styles.alertDescription}>Fique em um lugar seguro e mantenha o celular por perto.</Text>
        </View> */}

        <TouchableOpacity
          style={styles.sos}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Pedir ajuda agora"
          onPress={() => setSosSent(true)}
        >
          <Text style={styles.sosTitle}>SOS</Text>
          <Text style={styles.sosText}>
            {sosSent ? 'Pedido enviado! A ajuda está a caminho.' : 'Pedir ajuda agora'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.section}>Ligar com um toque</Text>
        <View style={styles.grid}>
          {emergencyNumbers.map((item) => (
            <TouchableOpacity
              key={item.number}
              style={styles.card}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Ligar para ${item.name}, ${item.number}`}
              onPress={() => Linking.openURL(`tel:${item.number}`)}
            >
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardNumber}>{item.number}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  greetingSmall: { fontSize: 15, color: colors.textSecondary },
  greeting: { fontSize: 26, fontWeight: '700', color: colors.text, marginTop: -12 },
  alert: {
    backgroundColor: colors.alertBackground, borderColor: colors.alertBorder, borderWidth: 2,
    borderRadius: 16, padding: 18, gap: 8,
  },
  alertLevel: { fontSize: 14, fontWeight: '800', letterSpacing: 1, color: colors.alertText },
  alertTitle: { fontSize: 22, fontWeight: '700', color: colors.alertTitle },
  alertDescription: { fontSize: 15, color: colors.alertDescription },
  sos: {
    backgroundColor: colors.sos, borderRadius: 20, minHeight: 120,
    alignItems: 'center', justifyContent: 'center', padding: 16,
  },
  sosTitle: { color: colors.white, fontSize: 40, fontWeight: '800', letterSpacing: 3 },
  sosText: { color: colors.white, fontSize: 17, fontWeight: '600', textAlign: 'center' },
  section: { fontSize: 16, fontWeight: '600', color: colors.textSection },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '48%', backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1,
    borderRadius: 14, padding: 14, minHeight: 72,
  },
  cardName: { fontSize: 15, fontWeight: '600', color: colors.text },
  cardNumber: { fontSize: 22, fontWeight: '700', color: colors.primary },
});