import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { getLoggedUser, logout } from '../../services/auth';

export default function Profile() {
  const router = useRouter();
  const user = getLoggedUser();

  const profileData = [
    { label: 'Nome', value: user?.name ?? '-' },
    { label: 'E-mail', value: user?.email ?? '-' },
    { label: 'Idade', value: '78 anos' },
    { label: 'Mobilidade', value: 'Usa cadeira de rodas' },
    { label: 'Saúde', value: 'Pressão alta' },
    { label: 'Mora sozinha?', value: 'Sim' },
  ];

  function handleLogout() {
    logout();
    router.replace('/');
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meu perfil</Text>

        {/* <View style={styles.info}>
          <Text style={styles.infoText}>
            Seus dados ficam protegidos. O resgate só vê o necessário para te ajudar.
          </Text>
        </View> */}

        <View style={styles.list}>
          {profileData.map((item, i) => (
            <View key={item.label} style={[styles.row, i < profileData.length - 1 && styles.rowBorder]}>
              <Text style={styles.rowLabel}>{item.label}</Text>
              <Text style={styles.rowValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.logout}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, gap: 16 },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  info: { backgroundColor: colors.infoBackground, borderRadius: 12, padding: 14 },
  infoText: { fontSize: 14, color: colors.infoText },
  list: { backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  row: { paddingVertical: 14, paddingHorizontal: 16, gap: 2 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowLabel: { fontSize: 13, color: colors.textSecondary },
  rowValue: { fontSize: 17, fontWeight: '600', color: colors.text },
  logout: {
    minHeight: 52, borderRadius: 14, borderWidth: 1, borderColor: colors.sos,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  logoutText: { color: colors.sos, fontSize: 17, fontWeight: '700' },
});