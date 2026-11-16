import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../constants/colors';
import { logout } from '../../services/auth';
import { getProfile, UserProfile } from '../../services/user';
import { MOBILITY_LEVELS } from '../../constants/healthProfile';

function getMobilityLabel(level: number) {
  const found = MOBILITY_LEVELS.find((item) => item.value === level);
  if (!found) return 'Não informado';
  return found.title.split(' — ')[1] ?? found.title;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function handleLogout() {
    logout();
    router.replace('/');
  }

  const health = profile?.healthProfile;
  const profileData = profile
    ? [
        { label: 'Nome', value: profile.name },
        { label: 'E-mail', value: profile.email },
        { label: 'Telefone', value: profile.phoneNumber || '-' },
        { label: 'Idade', value: profile.age ? `${profile.age} anos` : '-' },
        { label: 'Mobilidade', value: health ? getMobilityLabel(health.mobilityLevel) : '-' },
        { label: 'Mora sozinho(a)?', value: health ? (health.livesAlone ? 'Sim' : 'Não') : '-' },
        {
          label: 'Condições de saúde',
          value: health?.healthConditions.length ? health.healthConditions.join(', ') : 'Nenhuma',
        },
      ]
    : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Meu perfil</Text>

        {/* <View style={styles.info}>
          <Text style={styles.infoText}>
            Seus dados ficam protegidos. O resgate só vê o necessário para te ajudar.
          </Text>
        </View> */}

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <View style={styles.list}>
            {profileData.map((item, i) => (
              <View key={item.label} style={[styles.row, i < profileData.length - 1 && styles.rowBorder]}>
                <Text style={styles.rowLabel}>{item.label}</Text>
                <Text style={styles.rowValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        )}

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
  error: { color: colors.sos, fontSize: 15, fontWeight: '600' },
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