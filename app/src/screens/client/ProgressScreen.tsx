import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { fetchMyFormChecks, StoredFormCheck } from '@/services/formCheckApi';
import { isServerConfigured } from '@/services/api';

export default function ProgressScreen() {
  const { token, isDemo } = useAuth();
  const [items, setItems] = useState<StoredFormCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyFormChecks(token);
      setItems(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.content}>
        <ScreenHeader title="Progress" subtitle="Every lift you've submitted for AI form-check, in one timeline." />

        {!isServerConfigured() || isDemo ? (
          <Card style={styles.notice}>
            <Text style={styles.noticeText}>
              {isDemo
                ? "You're in demo mode, so history isn't saved between sessions. Sign up for a real account to keep a persistent log."
                : 'No server configured yet — this screen will show real history once /server is deployed with DATABASE_URL set.'}
            </Text>
          </Card>
        ) : null}

        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing(6) }} />
        ) : error ? (
          <Card><Text style={styles.errorText}>{error}</Text></Card>
        ) : items.length === 0 ? (
          <Card><Text style={styles.emptyText}>No form-checks submitted yet — upload a lift from the Form Check tab.</Text></Card>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(i) => i.id}
            contentContainerStyle={{ gap: spacing(3), paddingBottom: spacing(10) }}
            renderItem={({ item }) => (
              <Card style={{ gap: 4 }}>
                <View style={styles.row}>
                  <Text style={styles.lift}>{item.lift}</Text>
                  <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString('en-IN')}</Text>
                </View>
                <Text style={styles.note}>{item.overall_note}</Text>
                <Text style={styles.faultCount}>{item.faults.length} fault{item.faults.length === 1 ? '' : 's'} flagged</Text>
                {item.coach_reviewed_at ? (
                  <Text style={styles.coachTag}>✓ Reviewed by coach{item.coach_note ? `: ${item.coach_note}` : ''}</Text>
                ) : (
                  <Text style={styles.pendingTag}>Awaiting coach review</Text>
                )}
              </Card>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: spacing(5), gap: spacing(4) },
  notice: { backgroundColor: colors.surfaceAlt },
  noticeText: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
  errorText: { color: colors.danger, fontSize: 13 },
  emptyText: { color: colors.inkMuted, fontSize: 13 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  lift: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  date: { color: colors.inkMuted, fontSize: 12 },
  note: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
  faultCount: { color: colors.gold, fontSize: 12, fontWeight: '600' },
  coachTag: { color: colors.good, fontSize: 12, fontWeight: '600' },
  pendingTag: { color: colors.inkMuted, fontSize: 12 },
});
