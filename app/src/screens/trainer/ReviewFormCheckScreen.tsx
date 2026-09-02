import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { reviewFormCheck, StoredFormCheck } from '@/services/formCheckApi';

export default function ReviewFormCheckScreen({ route, navigation }: any) {
  const formCheck = route.params.formCheck as StoredFormCheck;
  const { token } = useAuth();
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function markReviewed() {
    setSubmitting(true);
    try {
      await reviewFormCheck(token, formCheck.id, note.trim());
      Alert.alert('Marked reviewed', 'The client will see your note on their Progress screen.', [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Could not submit', (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader title={formCheck.lift} subtitle={`Submitted by ${formCheck.client_name ?? 'client'}`} />

        <Card style={{ gap: spacing(3) }}>
          <Text style={styles.aiProvider}>Analyzed by {formCheck.ai_provider ?? 'AI'}</Text>
          <Text style={styles.overallNote}>{formCheck.overall_note}</Text>
          {formCheck.faults.map((f, i) => (
            <View key={i} style={styles.fault}>
              <Text style={styles.faultTime}>0:{String(f.timestampSec).padStart(2, '0')}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.faultLabel}>{f.label}</Text>
                <Text style={styles.faultDetail}>{f.detail}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Your note to the client</Text>
        <TextInput
          style={styles.notes}
          placeholder="e.g. Agree with the AI on knee valgus — cue wider stance next session."
          placeholderTextColor={colors.inkMuted}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <Button label={submitting ? 'Submitting…' : 'Mark reviewed'} onPress={markReviewed} loading={submitting} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(4) },
  aiProvider: { color: colors.good, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  overallNote: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
  fault: { flexDirection: 'row', gap: spacing(3), borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing(3) },
  faultTime: { color: colors.gold, fontSize: 13, fontWeight: '700', width: 40 },
  faultLabel: { color: colors.ink, fontSize: 13.5, fontWeight: '700' },
  faultDetail: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17, marginTop: 2 },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  notes: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing(4),
    color: colors.ink,
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
