import { useCallback, useState } from 'react';
import {
  ActivityIndicator, FlatList, Linking, RefreshControl,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { colors } from '../constants/colors';
import { logout } from '../services/auth';
import { getRescueQueue, RescueSummary } from '../services/admin';
import { formatPhoneNumber } from '../utils/format';

const priorityStyles = {
  Alta: { background: colors.priorityHighBackground, text: colors.priorityHighText, border: colors.priorityHighBorder },
  Média: { background: colors.priorityMediumBackground, text: colors.priorityMediumText, border: colors.priorityMediumBorder },
  Baixa: { background: colors.priorityLowBackground, text: colors.priorityLowText, border: colors.border },
};

export default function RescueQueue() {
  const router = useRouter();
  const [queue, setQueue] = useState<RescueSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function loadQueue() {
    try {
      const data = await getRescueQueue();
      setQueue(data);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Não foi possível carregar a fila');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadQueue();
    }, []),
  );

  function handleRefresh() {
    setRefreshing(true);
    loadQueue();
  }

  function handleLogout() {
    logout();
    router.replace('/');
  }

  function renderItem({ item }: { item: RescueSummary }) {
    const style = priorityStyles[item.priority] ?? priorityStyles.Baixa;
    const isLow = item.priority === 'Baixa';

    return (
      <View style={[styles.card, { borderColor: style.border, borderWidth: isLow ? 1 : 2 }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.details}>
              {item.age} anos{item.phoneNumber ? ` · ${formatPhoneNumber(item.phoneNumber)}` : ''}
            </Text>
          </View>
          <Text style={[styles.badge, { backgroundColor: style.background, color: style.text }]}>
            {item.priority.toUpperCase()} · {item.score}
          </Text>
        </View>

        {item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.map((tag) => (
              <Text key={tag} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        )}

        {!isLow && item.phoneNumber ? (
          <TouchableOpacity
            style={styles.callButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Ligar para ${item.name}`}
            onPress={() => Linking.openURL(`tel:${item.phoneNumber}`)}
          >
            <Text style={styles.callButtonText}>Ligar</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>EQUIPE DE RESGATE</Text>
            <Text style={styles.title}>Fila de resgate</Text>
          </View>
          <TouchableOpacity
            style={styles.logout}
            activeOpacity={0.7}
            accessibilityRole="button"
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
        {!loading && !error ? (
          <Text style={styles.subtitle}>
            Ordenada por prioridade · {queue.length} {queue.length === 1 ? 'pessoa' : 'pessoas'}
          </Text>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loading} size="large" color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item) => String(item.userId)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma pessoa cadastrada ainda.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 14, gap: 8,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { fontSize: 12, fontWeight: '800', letterSpacing: 1, color: colors.primary },
  title: { fontSize: 26, fontWeight: '700', color: colors.text },
  subtitle: { fontSize: 14, color: colors.textSecondary },
  logout: {
    minHeight: 44, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1,
    borderColor: colors.border, justifyContent: 'center',
  },
  logoutText: { color: colors.sos, fontSize: 15, fontWeight: '600' },
  loading: { marginTop: 40 },
  error: { color: colors.sos, fontSize: 15, fontWeight: '600', padding: 20 },
  empty: { color: colors.textSecondary, fontSize: 15, textAlign: 'center', marginTop: 24 },
  list: { padding: 16, gap: 10 },
  card: { backgroundColor: colors.white, borderRadius: 16, padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  cardInfo: { flex: 1, gap: 2 },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  details: { fontSize: 13, color: colors.textSecondary },
  badge: {
    fontSize: 13, fontWeight: '800', paddingVertical: 5, paddingHorizontal: 10,
    borderRadius: 999, overflow: 'hidden',
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: {
    backgroundColor: colors.tagBackground, color: colors.textSection, fontSize: 12, fontWeight: '600',
    paddingVertical: 4, paddingHorizontal: 9, borderRadius: 999, overflow: 'hidden',
  },
  callButton: {
    minHeight: 44, borderRadius: 12, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  callButtonText: { color: colors.white, fontSize: 15, fontWeight: '600' },
});