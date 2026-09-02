import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PriceTag } from '@/components/PriceTag';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';
import { COACHING_TIERS } from '@/data/mockData';
import { startCheckout } from '@/services/paymentService';
import { useAuth } from '@/context/AuthContext';

export default function CoachingScreen() {
  const { token } = useAuth();
  const [subscribingId, setSubscribingId] = useState<string | null>(null);

  async function subscribe(id: string, name: string, priceInr: number, billing: 'per month' | 'per 12-week cycle') {
    setSubscribingId(id);
    try {
      const result = await startCheckout({ itemId: id, itemLabel: name, amountInr: priceInr, kind: 'coaching', billing, token });
      if (result.success) {
        Alert.alert('You are in', `${name} coaching confirmed. Your coach will message you to schedule the first call.`);
      }
    } catch (err) {
      Alert.alert('Checkout', (err as Error).message);
    } finally {
      setSubscribingId(null);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="1:1 Coaching" subtitle="Bodybuilding, powerlifting & weightlifting — every price published up front." />

        {COACHING_TIERS.map((tier) => (
          <Card key={tier.id} style={styles.card}>
            <Text style={styles.discipline}>{tier.discipline.toUpperCase()}</Text>
            <Text style={styles.name}>{tier.name}</Text>
            <Text style={styles.desc}>{tier.description}</Text>
            <View style={styles.features}>
              {tier.features.map((f) => (
                <Text key={f} style={styles.feature}>· {f}</Text>
              ))}
            </View>
            <View style={styles.footer}>
              <PriceTag amountInr={tier.priceInr} suffix={tier.billing} />
              <Button
                label={subscribingId === tier.id ? 'Processing…' : 'Start coaching'}
                onPress={() => subscribe(tier.id, tier.name, tier.priceInr, tier.billing)}
                loading={subscribingId === tier.id}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(4) },
  card: {},
  discipline: { color: colors.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 4 },
  name: { color: colors.ink, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  desc: { color: colors.inkMuted, fontSize: 13, lineHeight: 18, marginBottom: spacing(3) },
  features: { gap: 3, marginBottom: spacing(4) },
  feature: { color: colors.inkMuted, fontSize: 12.5 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
