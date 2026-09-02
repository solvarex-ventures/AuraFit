import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';

const ROWS = [
  { label: 'Foundation coaching (4 clients)', amount: 12000 },
  { label: 'Specialist coaching (1 client)', amount: 6000 },
  { label: 'Single consultations (3)', amount: 2097 },
];

export default function EarningsScreen() {
  const gross = ROWS.reduce((sum, r) => sum + r.amount, 0);
  const commission = 0; // Phase 1: you are the platform, no marketplace commission on your own coaching
  const net = gross - commission;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Earnings" subtitle="This month, before app-store/payment processing fees." />

        <Card style={{ gap: spacing(3) }}>
          {ROWS.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text style={styles.rowLabel}>{r.label}</Text>
              <Text style={styles.rowValue}>₹{r.amount.toLocaleString('en-IN')}</Text>
            </View>
          ))}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Net this month</Text>
            <Text style={styles.totalValue}>₹{net.toLocaleString('en-IN')}</Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.noteTitle}>Phase 2 note</Text>
          <Text style={styles.noteBody}>
            Once the marketplace opens to other trainers, this screen also shows the platform's 25% commission line for
            clients they bring in — your own founder coaching stays commission-free.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(4) },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: colors.inkMuted, fontSize: 13 },
  rowValue: { color: colors.ink, fontSize: 13, fontWeight: '600' },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing(3) },
  totalLabel: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  totalValue: { color: colors.good, fontSize: 16, fontWeight: '800' },
  noteTitle: { color: colors.ink, fontSize: 13, fontWeight: '700', marginBottom: 6 },
  noteBody: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
});
