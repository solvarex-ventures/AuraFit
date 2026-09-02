import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

export function PriceTag({ amountInr, suffix }: { amountInr: number; suffix?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.price}>₹{amountInr.toLocaleString('en-IN')}</Text>
      {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  price: { fontSize: 20, fontWeight: '700', color: colors.ink },
  suffix: { fontSize: 12, color: colors.inkMuted },
});
