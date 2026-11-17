import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { Snackbar } from '../components/Snackbar';
import type { SnackbarSeverity } from '../components/Snackbar';
import { HealthProfileFields } from '../components/HealthProfileFields';
import { getProfile, updateProfile } from '../services/user';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [mobilityLevel, setMobilityLevel] = useState<number | null>(null);
  const [livesAlone, setLivesAlone] = useState<boolean | null>(null);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ text: string; severity: SnackbarSeverity } | null>(null);

  // Preenche o formulário com os dados atuais
  useEffect(() => {
    async function loadProfile() {
      try {
        const profile = await getProfile();
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phoneNumber);
        setAge(profile.age ? String(profile.age) : '');
        if (profile.healthProfile) {
          setMobilityLevel(profile.healthProfile.mobilityLevel);
          setLivesAlone(profile.healthProfile.livesAlone);
          setHealthConditions(profile.healthProfile.healthConditions);
        }
      } catch (e) {
        setSnackbar({ text: e instanceof Error ? e.message : 'Não foi possível carregar o perfil', severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSave() {
    setSnackbar(null);

    if (mobilityLevel === null || livesAlone === null) {
      setSnackbar({ text: 'Selecione seu nível de mobilidade e informe se mora sozinho(a).', severity: 'warning' });
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        name,
        age: Number(age),
        phoneNumber: phone,
        healthProfile: { mobilityLevel, livesAlone, healthConditions },
      });
      setSnackbar({ text: 'Perfil atualizado!', severity: 'success' });
      setTimeout(() => router.back(), 1200);
    } catch (e) {
      setSnackbar({ text: e instanceof Error ? e.message : 'Não foi possível salvar', severity: 'error' });
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Editar perfil</Text>
        <Text style={styles.subtitle}>Mantenha seus dados atualizados para um atendimento mais rápido.</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" />

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={[styles.input, styles.inputDisabled]} value={email} editable={false} />
        <Text style={styles.hint}>O e-mail não pode ser alterado.</Text>

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input} value={phone} onChangeText={setPhone}
          placeholder="(11) 90000-0000" keyboardType="phone-pad"
        />

        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input} value={age} onChangeText={setAge}
          placeholder="Sua idade" keyboardType="number-pad" maxLength={3}
        />

        <HealthProfileFields
          mobilityLevel={mobilityLevel}
          onChangeMobilityLevel={setMobilityLevel}
          livesAlone={livesAlone}
          onChangeLivesAlone={setLivesAlone}
          healthConditions={healthConditions}
          onChangeHealthConditions={setHealthConditions}
        />

        <TouchableOpacity
          style={[styles.button, saving && styles.buttonDisabled]}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Salvar alterações'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.linkText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>

      <Snackbar
        text={snackbar?.text ?? ''}
        severity={snackbar?.severity ?? 'info'}
        onDismiss={() => setSnackbar(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, position: 'relative' },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 24, paddingBottom: 40, gap: 8 },
  title: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 16, lineHeight: 23, color: colors.textSecondary, marginBottom: 8 },
  label: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 8 },
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14, fontSize: 17,
  },
  inputDisabled: { backgroundColor: colors.divider, color: colors.textSecondary },
  hint: { fontSize: 14, color: colors.textSecondary },
  button: {
    backgroundColor: colors.primary, borderRadius: 14, minHeight: 56,
    alignItems: 'center', justifyContent: 'center', marginTop: 24,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: '700' },
  link: { alignItems: 'center', padding: 16 },
  linkText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});