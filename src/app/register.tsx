import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Href, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { Snackbar } from '../components/Snackbar';
import { saveRegistrationDetails } from '../services/auth';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [age, setAge] = useState('');
  const [snackbarText, setSnackbarText] = useState('');

  function handleContinue() {
    setSnackbarText('');
    try {
      saveRegistrationDetails({
        name,
        email,
        phoneNumber: phone,
        password,
        age: Number(age),
      });
      router.push('/register-health' as Href);
    } catch (e) {
      setSnackbarText(e instanceof Error ? e.message : 'Não foi possível continuar o cadastro');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Leva menos de um minuto.</Text>

        <Text style={styles.label}>Nome completo</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Seu nome" />

        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input} value={email} onChangeText={setEmail}
          placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none"
        />

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input} value={phone} onChangeText={setPhone}
          placeholder="(11) 90000-0000" keyboardType="phone-pad"
        />

        <Text style={styles.label}>Idade</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          placeholder="Sua idade"
          keyboardType="number-pad"
          maxLength={3}
        />

        <Text style={styles.label}>Senha</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo de 6 caracteres"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            style={styles.passwordToggle}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
            onPress={() => setPasswordVisible((visible) => !visible)}
          >
            <Ionicons
              name={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() => router.back()}
        >
          <Text style={styles.linkText}>Já tenho conta</Text>
        </TouchableOpacity>
      </ScrollView>
      <Snackbar
        text={snackbarText}
        severity="error"
        onDismiss={() => setSnackbarText('')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, position: 'relative' },
  content: { padding: 24, gap: 8 },
  title: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 17, color: colors.textSecondary, marginBottom: 16 },
  label: { fontSize: 16, fontWeight: '600', color: colors.text, marginTop: 8 },
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 14, fontSize: 17,
  },
  passwordInputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingLeft: 14,
  },
  passwordInput: { flex: 1, paddingVertical: 14, fontSize: 17 },
  passwordToggle: {
    minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center',
  },
  button: {
    backgroundColor: colors.primary, borderRadius: 14, minHeight: 56,
    alignItems: 'center', justifyContent: 'center', marginTop: 24,
  },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: '700' },
  link: { alignItems: 'center', padding: 16 },
  linkText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});