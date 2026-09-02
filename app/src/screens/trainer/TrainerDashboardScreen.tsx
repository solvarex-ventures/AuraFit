import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';
import { fetchFlaggedFormChecks, StoredFormCheck } from '@/services/formCheckApi';
import { isServerConfigured } from '@/services/api';

// Mock fallback so this screen still demos meaningfully without a database
// configured — matches the shape ReviewFormCheckScreen expects.
const MOCK_FLAGGED: StoredFormCheck[] = [
  {
    id: 'mock_1',
    client_id: 'mock_client_1',
    client_name: 'Rohit K.',
    lift: 'Squat',
    video_url: null,
    ai_provider: 'gemini-2.5-flash',
    overall_note: 'DEMO — knee valgus flagged with medium confidence, worth a coach look.',
    faults: [{ timestampSec: 2, label: 'Knee valgus on ascent', detail: 'Knees drift inward past 0:02.', severity: 'warning' }],
    coach_reviewed_at: null,
    coach_note: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mock_2',
    client_id: 'mock_client_2',
    client_name: 'Priya S.',
    lift: 'Deadlift',
    video_url: null,
    ai_provider: 'gemini-2.5-flash',
    overall_note: "DEMO — client marked \"not sure about this\" on their own upload, escalated automatically.",
    faults: [{ timestampSec: 4, label: 'Hip-shoot at lockoff', detail: 'Hips rise faster than the bar near lockout.', severity: 'info' }],
    coach_reviewed_at: null,
    coach_note: null,
    created_at: new Date().toISOString(),
  },
];

export default function TrainerDashboardScreen({ navigation }: { navigation: { navigate: (screen: string, params?: object) => void } }) {
  const { user, token, isDemo } = useAuth();
  const [flagged, setFlagged] = useState<StoredFormCheck[]>(MOCK_FLAGGED);
  const [loading, setLoading] = useState(isServerConfigured());

  const load = useCallback(async () => {
    if (!isServerConfigured() || isDemo) {
      setFlagged(MOCK_FLAGGED);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const result = await fetchFlaggedFormChecks(token);
      setFlagged(result.length ? result : MOCK_FLAGGED);
    } catch {
      setFlagged(MOCK_FLAGGED);
    } finally {
      setLoading(false);
    }
  }, [token, isDemo]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={`Coach console — ${user?.name}`} subtitle="Client load, pending reviews, and this month's payout." />

        <View style={styles.statRow}>
          <Stat label="Active clients" value="5 / 5" />
          <Stat label="To review" value={String(flagged.length)} />
          <Stat label="Avg. rating" value="5.0" />
        </View>

        <Text style={styles.sectionTitle}>Flagged for your review</Text>
        {loading ? (
          <ActivityIndicator color={colors.accent} />
        ) : (
          flagged.map((fc) => (
            <Card key={fc.id} style={styles.reviewCard} onPress={() => navigation.navigate('ReviewFormCheck', { formCheck: fc })}>
              <Text style={styles.reviewLift}>{fc.lift} — {fc.client_name ?? 'Client'}</Text>
              <Text style={styles.reviewNote} numberOfLines={2}>{fc.overall_note}</Text>
              <Text style={styles.reviewCta}>Review →</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(4) },
  statRow: { flexDirection: 'row', gap: spacing(3) },
  stat: { flex: 1, alignItems: 'center', paddingVertical: spacing(4) },
  statValue: { color: colors.ink, fontSize: 20, fontWeight: '800' },
  statLabel: { color: colors.inkMuted, fontSize: 11, marginTop: 4, textAlign: 'center' },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  reviewCard: { gap: 4 },
  reviewLift: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  reviewNote: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
  reviewCta: { color: colors.accent, fontSize: 12, fontWeight: '700', marginTop: 4 },
});
