import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';
import { apiBaseUrl, isServerConfigured } from '@/services/api';

interface ConfigStatus {
  database: boolean;
  gemini: boolean;
  openai: boolean;
  razorpay: boolean;
  razorpayWebhook: boolean;
  auth: boolean;
}

export default function SettingsScreen() {
  const [status, setStatus] = useState<ConfigStatus | null>(null);
  const [notifyFormCheck, setNotifyFormCheck] = useState(true);
  const [notifyCoachMessages, setNotifyCoachMessages] = useState(true);

  useEffect(() => {
    if (!isServerConfigured()) return;
    fetch(`${apiBaseUrl()}/config/status`)
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Settings" />

        <Text style={styles.sectionTitle}>Notifications</Text>
        <Card style={{ gap: spacing(3) }}>
          <ToggleRow label="AI form-check results" value={notifyFormCheck} onChange={setNotifyFormCheck} />
          <ToggleRow label="Coach messages & reviews" value={notifyCoachMessages} onChange={setNotifyCoachMessages} />
        </Card>
        <Text style={styles.hint}>Preferences here are stored on-device only in this build — wire them to push tokens once notifications are added.</Text>

        <Text style={styles.sectionTitle}>Integration status</Text>
        <Card style={{ gap: spacing(2) }}>
          {!isServerConfigured() ? (
            <Text style={styles.hint}>No server configured — the whole app is running in demo mode. Set EXPO_PUBLIC_API_BASE_URL to check real status.</Text>
          ) : !status ? (
            <Text style={styles.hint}>Could not reach {apiBaseUrl()}/config/status.</Text>
          ) : (
            <>
              <StatusRow label="Database" ok={status.database} />
              <StatusRow label="Gemini AI" ok={status.gemini} />
              <StatusRow label="OpenAI (fallback)" ok={status.openai} />
              <StatusRow label="Razorpay payments" ok={status.razorpay} />
              <StatusRow label="Razorpay webhook" ok={status.razorpayWebhook} />
              <StatusRow label="Account auth" ok={status.auth} />
            </>
          )}
        </Card>

        <Text style={styles.sectionTitle}>Legal</Text>
        <Card style={{ gap: 6 }}>
          <Text style={styles.legalLink}>Privacy policy (DPDP Act 2023 / 2025 Rules)</Text>
          <Text style={styles.legalLink}>Refund policy</Text>
          <Text style={styles.legalLink}>Medical & fitness disclaimer</Text>
        </Card>
        <Text style={styles.hint}>These link out to real policy pages once published on the marketing website — see the /website package.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.accent, false: colors.border }} />
    </View>
  );
}

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={styles.statusRow}>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text style={[styles.statusValue, { color: ok ? colors.good : colors.inkMuted }]}>{ok ? 'Live' : 'Not configured'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(3) },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700', marginTop: spacing(2) },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleLabel: { color: colors.ink, fontSize: 13.5 },
  hint: { color: colors.inkMuted, fontSize: 11.5, lineHeight: 16 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between' },
  statusLabel: { color: colors.ink, fontSize: 13 },
  statusValue: { fontSize: 12, fontWeight: '700' },
  legalLink: { color: colors.accent, fontSize: 13, fontWeight: '600' },
});
