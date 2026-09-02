import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';
import { EXERCISE_FAULT_LIBRARY } from '@/data/mockData';
import { requestFormCheck } from '@/services/aiService';
import { FormCheckResult } from '@/types';
import { useAuth } from '@/context/AuthContext';

const LIFTS = Object.keys(EXERCISE_FAULT_LIBRARY);

export default function FormCheckScreen() {
  const { token } = useAuth();
  const [lift, setLift] = useState(LIFTS[0]);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FormCheckResult | null>(null);

  async function pickVideo() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });
    if (!picked.canceled && picked.assets[0]) {
      setVideoUri(picked.assets[0].uri);
      setResult(null);
    }
  }

  async function analyze() {
    if (!videoUri) return;
    setAnalyzing(true);
    try {
      const res = await requestFormCheck({ lift, videoUri, token });
      setResult(res);
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="AI form-check"
          subtitle="Upload a set. Gemini's multimodal model flags faults with timestamps — the feature none of the competitors ship."
        />

        <Text style={styles.sectionTitle}>Which lift?</Text>
        <View style={styles.liftRow}>
          {LIFTS.map((l) => (
            <Text key={l} onPress={() => setLift(l)} style={[styles.liftPill, lift === l && styles.liftPillActive]}>
              {l}
            </Text>
          ))}
        </View>

        <Card style={styles.uploadCard}>
          {videoUri ? (
            <Text style={styles.uploadedText}>Video selected ✓{'\n'}{videoUri.split('/').pop()}</Text>
          ) : (
            <Text style={styles.uploadedText}>No video selected yet.</Text>
          )}
          <Button label={videoUri ? 'Choose a different video' : 'Upload a lift video'} onPress={pickVideo} variant="secondary" />
        </Card>

        <Button
          label={analyzing ? 'Analyzing…' : 'Run AI form-check'}
          onPress={analyze}
          loading={analyzing}
          disabled={!videoUri}
        />

        {result && (
          <Card style={styles.resultCard}>
            <Text style={styles.resultProvider}>Analyzed by {result.aiProvider}</Text>
            <Text style={styles.resultNote}>{result.overallNote}</Text>
            {result.faults.map((f, i) => (
              <View key={i} style={styles.fault}>
                <Text style={styles.faultTime}>0:{String(f.timestampSec).padStart(2, '0')}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.faultLabel}>{f.label}</Text>
                  <Text style={styles.faultDetail}>{f.detail}</Text>
                </View>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: spacing(5), paddingBottom: spacing(10), gap: spacing(4) },
  sectionTitle: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  liftRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing(2) },
  liftPill: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: spacing(2),
    paddingHorizontal: spacing(3.5),
    color: colors.inkMuted,
    fontSize: 12.5,
    overflow: 'hidden',
  },
  liftPillActive: { backgroundColor: colors.accent, borderColor: colors.accent, color: colors.accentInk },
  uploadCard: { alignItems: 'center', gap: spacing(3) },
  uploadedText: { color: colors.inkMuted, fontSize: 12.5, textAlign: 'center' },
  resultCard: { backgroundColor: colors.surfaceAlt, gap: spacing(3) },
  resultProvider: { color: colors.good, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  resultNote: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17 },
  fault: { flexDirection: 'row', gap: spacing(3), borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing(3) },
  faultTime: { color: colors.gold, fontSize: 13, fontWeight: '700', width: 40 },
  faultLabel: { color: colors.ink, fontSize: 13.5, fontWeight: '700' },
  faultDetail: { color: colors.inkMuted, fontSize: 12.5, lineHeight: 17, marginTop: 2 },
});
