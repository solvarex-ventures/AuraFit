import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { PriceTag } from '@/components/PriceTag';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';
import { EBOOKS, EBOOK_BUNDLE_PRICE_INR } from '@/data/mockData';
import { startCheckout } from '@/services/paymentService';
import { useAuth } from '@/context/AuthContext';

export default function EbookStoreScreen() {
  const { token } = useAuth();
  const [buyingId, setBuyingId] = useState<string | null>(null);

  async function buy(id: string, title: string, amountInr: number, kind: 'ebook' | 'bundle' = 'ebook') {
    setBuyingId(id);
    try {
      const result = await startCheckout({ itemId: id, itemLabel: title, amountInr, kind, token });
      if (result.success) {
        Alert.alert('Purchase complete', `${title} unlocked. (Demo checkout — payment ${result.paymentId})`);
      }
    } catch (err) {
      Alert.alert('Checkout', (err as Error).message);
    } finally {
      setBuyingId(null);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title="Ebook store" subtitle="One-time purchase, instant PDF delivery." />

        <Card style={styles.bundleCard}>
          <Text style={styles.bundleLabel}>BEST VALUE</Text>
          <Text style={styles.bundleTitle}>Complete Bundle</Text>
          <Text style={styles.bundleDesc}>All three guides below, delivered together.</Text>
          <View style={styles.bundleFooter}>
            <PriceTag amountInr={EBOOK_BUNDLE_PRICE_INR} />
            <Button
              label={buyingId === 'bundle' ? 'Processing…' : 'Buy bundle'}
              onPress={() => buy('bundle', 'Complete Bundle', EBOOK_BUNDLE_PRICE_INR, 'bundle')}
              loading={buyingId === 'bundle'}
              variant="good"
            />
          </View>
        </Card>

        {EBOOKS.map((book) => (
          <Card key={book.id} style={styles.bookCard}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <Text style={styles.bookBlurb}>{book.blurb}</Text>
            <Text style={styles.bookMeta}>{book.pages} pages · {book.format}</Text>
            <View style={styles.bookFooter}>
              <PriceTag amountInr={book.priceInr} />
              <Button
                label={buyingId === book.id ? 'Processing…' : 'Buy now'}
                onPress={() => buy(book.id, book.title, book.priceInr)}
                loading={buyingId === book.id}
                variant="secondary"
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
  bundleCard: { backgroundColor: colors.surfaceAlt, borderColor: colors.gold },
  bundleLabel: { color: colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 4 },
  bundleTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', marginBottom: 4 },
  bundleDesc: { color: colors.inkMuted, fontSize: 13, marginBottom: spacing(3) },
  bundleFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bookCard: {},
  bookTitle: { color: colors.ink, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  bookBlurb: { color: colors.inkMuted, fontSize: 13, lineHeight: 18, marginBottom: 6 },
  bookMeta: { color: colors.inkMuted, fontSize: 11, marginBottom: spacing(3) },
  bookFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
