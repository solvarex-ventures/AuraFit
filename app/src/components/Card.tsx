import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewProps } from 'react-native';
import { colors, radius, spacing } from '@/theme';

interface Props extends ViewProps {
  onPress?: () => void;
}

export function Card({ style, children, onPress, ...rest }: Props) {
  if (onPress) {
    return (
      <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.75} {...rest}>
        {children}
      </TouchableOpacity>
    );
  }
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing(4),
  },
});
