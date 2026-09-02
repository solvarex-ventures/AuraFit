import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { submitHealthScreening } from '@/services/authApi';

// A PAR-Q-style pre-activity health screen — required before a client's
// first program, per the blueprint's liability-mitigation note. Every
// competitor reviewed in the blueprint (Fittr, HealthifyMe, Fitelo) carries
// something equivalent; skipping it is real legal exposure for a coaching
// business, not just a UX nicety.
const QUESTIONS: { key: string; label: string }[] = [
  { key: 'hasHeartCondition', label: 'Has a doctor ever said you have a heart condition?' },
  { key: 'hasChestPainDuringActivity', label: 'Do you feel chest pain during physical activity?' },
  { key: 'hasChestPainAtRest', label: 'Have you had chest pain in the past month while not active?' },
  { key: 'hasBalanceOrConsciousnessIssues', label: 'Do you lose balance or consciousness due to dizziness?' },
  { key: 'hasBoneOrJointProblem', label: 'Do you have a bone or joint problem that could worsen with exercise?' },
  { key: 'isOnBloodPressureOrHeartMeds', label: 'Are you currently prescribed medication for blood pressure or a heart condition?' },
  { key: 'hasOtherReasonNotToExercise', label: 'Is there any other reason you should not start an exercise program?' },
];

export default function HealthScreeningScreen({ navigation }: { navigation: { goBack: () => void } }) {
  const { token, isDemo, markHealthScreeningComplete, refreshUser } = useAuth();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const answeredAll = QUESTIONS.every((q) => answers[q.key] !== undefined);
  const anyYes = QUESTIONS.some((q) => answers[q.key] === true);

  async function submit() {
    setSubmitting(true);
    try {
      if (isDemo || !token) {
        markHealthScreeningComplete();
      } else {
        await submitHealthScreening(token, { ...answers, notes });
        await refreshUser();
      }
      Alert.alert(
        anyYes ? 'Screening received' : 'You are clear to start',
        anyYes
          ? 'Thanks — because you flagged at least one item, your coach will follow up before assigning your first program.'
          : 'No flags raised. Your coach can assign your first program.',
        [{ text: 'Done', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert('Could not submit', (err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Health screening"
          subtitle="Quick PAR-Q-style check before your first program — answer honestly, it takes under a minute."
        />

        {QUESTIONS.map((q) => (
          <Card key={q.key} style={styles.qCard}>
            <Text style={styles.qLabel}>{q.label}</Text>
            <View style={styles.answerRow}>
              <Text
                onPress={() => setAnswers((a) => ({ ...a, [q.key]: false }))}
                style={[styles.answerPill, answers[q.key] === false && styles.answerPillActiveGood]}
              >
                No
              </Text>
              <Text
                onPress={() => setAnswers((a) => ({ ...a, [q.key]: true }))}
                style={[styles.answerPill, answers[q.key] === true && styles.answerPillActiveWarn]}
              >
                Yes
              </Text>
            </View>
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Anything else your coach should know?</Text>
        <TextInput
          style={styles.notes}
          placeholder="Optional — injuries, surgeries, current limitations…"
          placeholderTextColor={colors.inkMuted}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <Button label={submitting ? 'Submitting…' : 'Submit screening'} onPress={submit} loading={submitting} disabled={!answeredAll} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(3) },
  qCard: { gap: spacing(2) },
  qLabel: { color: colors.ink, fontSize: 13.5, lineHeight: 18 },
  answerRow: { flexDirection: 'row', gap: spacing(2) },
  answerPill: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: spacing(2),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
  },
  answerPillActiveGood: { backgroundColor: colors.good, borderColor: colors.good, color: colors.accentInk },
  answerPillActiveWarn: { backgroundColor: colors.danger, borderColor: colors.danger, color: colors.accentInk },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700', marginTop: spacing(2) },
  notes: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing(4),
    color: colors.ink,
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
