import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PriceTag } from '@/components/PriceTag';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';
import { startCheckout } from '@/services/paymentService';
import { useAuth } from '@/context/AuthContext';

const SLOTS = ['Tomorrow, 6:00 PM', 'Tomorrow, 8:00 PM', 'Thu, 7:00 AM', 'Thu, 6:30 PM'];
const CONSULT_PRICE_INR = 699;

export default function BookConsultationScreen() {
  const { token } = useAuth();
  const [slot, setSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!slot) return;
    setLoading(true);
    try {
      const result = await startCheckout({
        itemId: slot,
        itemLabel: `Consultation — ${slot}`,
        amountInr: CONSULT_PRICE_INR,
        kind: 'consultation',
        token,
      });
      if (result.success) {
        Alert.alert('Booked', `Your 45-minute consultation is confirmed for ${slot}.`);
        setSlot(null);
      }
    } catch (err) {
      Alert.alert('Checkout', (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Single consultation" subtitle="No subscription needed — a 45-minute diet or training audit." />

        <Card>
          <PriceTag amountInr={CONSULT_PRICE_INR} suffix="one-time, 45 min" />
        </Card>

        <Text style={styles.sectionTitle}>Choose a time</Text>
        <View style={styles.slots}>
          {SLOTS.map((s) => (
            <Text
              key={s}
              onPress={() => setSlot(s)}
              style={[styles.slot, slot === s && styles.slotActive]}
            >
              {s}
            </Text>
          ))}
        </View>

        <Button label={loading ? 'Booking…' : 'Confirm & pay'} onPress={confirm} loading={loading} disabled={!slot} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(4) },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  slots: { gap: spacing(2) },
  slot: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: spacing(3),
    paddingHorizontal: spacing(4),
    color: colors.inkMuted,
    fontSize: 14,
  },
  slotActive: { borderColor: colors.accent, color: colors.ink, backgroundColor: colors.surfaceAlt },
});
