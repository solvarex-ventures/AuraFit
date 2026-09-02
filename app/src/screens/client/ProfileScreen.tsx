import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Profile" />
        <Card style={{ gap: spacing(2) }}>
          <Row label="Name" value={user?.name ?? '—'} />
          <Row label="Role" value={user?.role ?? '—'} />
          <Row label="Email" value={user?.email ?? '—'} />
          <Row label="Discipline" value={user?.discipline ?? 'Not set'} />
        </Card>
        <Card>
          <Text style={styles.privacyTitle}>Data & privacy</Text>
          <Text style={styles.privacyBody}>
            Uploaded lift videos are stored privately and only ever served through short-lived signed URLs.
            Health-screening consent (DPDP Act 2023 / 2025 Rules) is collected at signup in the production build.
          </Text>
        </Card>
        <Button label="Sign out" onPress={signOut} variant="secondary" />
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
  rowValue: { color: colors.ink, fontSize: 13, fontWeight: '600', textTransform: 'capitalize' },
  privacyTitle: { color: colors.ink, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  privacyBody: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
});
