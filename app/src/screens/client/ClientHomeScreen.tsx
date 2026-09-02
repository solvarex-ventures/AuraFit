import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';
import { COACHING_TIERS } from '@/data/mockData';

export default function ClientHomeScreen({ navigation }: { navigation: { navigate: (screen: string) => void } }) {
  const { user } = useAuth();
  const activeTier = COACHING_TIERS[0];
  const needsScreening = !user?.healthScreeningCompletedAt;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={`Welcome back, ${user?.name.split(' ')[0]}`} subtitle="Here's where your training stands today." />

        {needsScreening && (
          <Card style={styles.screeningCard} onPress={() => navigation.navigate('HealthScreening')}>
            <Text style={styles.screeningLabel}>ONE MINUTE, BEFORE YOUR FIRST PROGRAM</Text>
            <Text style={styles.screeningTitle}>Complete your health screening →</Text>
          </Card>
        )}

        <Card style={styles.heroCard}>
          <Text style={styles.heroLabel}>ACTIVE PLAN</Text>
          <Text style={styles.heroTitle}>{activeTier.name} Coaching</Text>
          <Text style={styles.heroBody}>{activeTier.description}</Text>
        </Card>

        <Text style={styles.sectionTitle}>Today</Text>
        <Card style={styles.row}>
          <Metric label="Next session" value="Squat — Day 3" />
          <Metric label="Deload week" value="No · Wk 2 of 4" />
        </Card>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.grid}>
          <ActionCard title="Upload a lift" desc="Get AI form-check feedback in minutes" />
          <ActionCard title="Ask the AI coach" desc="Macro, program & recovery questions" />
          <ActionCard title="Browse ebooks" desc="12-Week Template & more" />
          <ActionCard title="Book a call" desc="Single consultation or 1:1 coaching" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function ActionCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card style={styles.actionCard}>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionDesc}>{desc}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10) },
  screeningCard: { backgroundColor: colors.gold + '22', borderColor: colors.gold, marginBottom: spacing(4) },
  screeningLabel: { color: colors.gold, fontSize: 10.5, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  screeningTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  heroCard: { backgroundColor: colors.surfaceAlt, marginBottom: spacing(5) },
  heroLabel: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: spacing(1) },
  heroTitle: { color: colors.ink, fontSize: 20, fontWeight: '800', marginBottom: spacing(1) },
  heroBody: { color: colors.inkMuted, fontSize: 13, lineHeight: 18 },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700', marginBottom: spacing(2), marginTop: spacing(2) },
  row: { flexDirection: 'row', marginBottom: spacing(5) },
  metric: { flex: 1 },
  metricValue: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  metricLabel: { color: colors.inkMuted, fontSize: 12, marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(3) },
  actionCard: { width: '47%' },
  actionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  actionDesc: { color: colors.inkMuted, fontSize: 12, lineHeight: 16 },
});
