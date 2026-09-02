import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/theme';

export function ScreenHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: spacing(4), paddingBottom: spacing(3) },
  title: { fontSize: 24, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 13, color: colors.inkMuted, marginTop: spacing(1) },
});
