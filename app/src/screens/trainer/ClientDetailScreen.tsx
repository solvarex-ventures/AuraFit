import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';

interface ClientSummary {
  name: string;
  tier: string;
  nextCheckin: string;
}

// A lightweight client-record view. Phase 2 of the roadmap (the marketplace
// opening to other trainers) is where this grows into a full CRM — purchase
// history, message log, program editor. For now it's the honest MVP: the
// roster info you already have, laid out so it's easy to extend.
export default function ClientDetailScreen({ route }: any) {
  const client = route.params.client as ClientSummary;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={client.name} subtitle={client.tier} />

        <Card style={{ gap: spacing(2) }}>
          <Row label="Coaching tier" value={client.tier} />
          <Row label="Next check-in" value={client.nextCheckin} />
        </Card>

        <Text style={styles.sectionTitle}>Quick actions</Text>
        <View style={styles.actions}>
          <Card style={styles.actionCard}>
            <Text style={styles.actionTitle}>Message on WhatsApp</Text>
            <Text style={styles.actionDesc}>Opens your usual channel — not wired to an API in this scaffold.</Text>
          </Card>
          <Card style={styles.actionCard}>
            <Text style={styles.actionTitle}>Update program</Text>
            <Text style={styles.actionDesc}>Program editor is a Phase 2 build — see the blueprint roadmap.</Text>
          </Card>
        </View>

        <Card style={styles.note}>
          <Text style={styles.noteText}>
            Flagged form-checks from this client appear on your Dashboard tab under "Flagged for your review" —
            tap one there to see the AI analysis and leave a note.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(4) },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: colors.inkMuted, fontSize: 13 },
  rowValue: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  actions: { gap: spacing(3) },
  actionCard: { gap: 4 },
  actionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  actionDesc: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
  note: { backgroundColor: colors.surfaceAlt },
  noteText: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
});
