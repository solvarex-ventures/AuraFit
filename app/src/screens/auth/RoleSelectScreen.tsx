import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import { colors, spacing } from '@/theme';
import { Role } from '@/types';

type Mode = 'signup' | 'login' | 'demo';

export default function RoleSelectScreen() {
  const { signUp, logIn, continueAsDemo, authError, restoringSession } = useAuth();
  const [mode, setMode] = useState<Mode>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('client');
  const [submitting, setSubmitting] = useState(false);

  if (restoringSession) {
    return (
      <SafeAreaView style={[styles.screen, styles.center]}>
        <ActivityIndicator color={colors.accent} />
      </SafeAreaView>
    );
  }

  async function submit() {
    setSubmitting(true);
    try {
      if (mode === 'signup') {
        await signUp({ name: name.trim(), email: email.trim(), password, role });
      } else if (mode === 'login') {
        await logIn({ email: email.trim(), password });
      }
    } catch {
      // authError is already set by the context; nothing else to do here.
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>AURAFIT</Text>
        <Text style={styles.title}>Train like it's personal.</Text>

        <View style={styles.tabRow}>
          <Tab label="Sign up" active={mode === 'signup'} onPress={() => setMode('signup')} />
          <Tab label="Log in" active={mode === 'login'} onPress={() => setMode('login')} />
        </View>

        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={colors.inkMuted}
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.inkMuted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password (min. 8 characters)"
          placeholderTextColor={colors.inkMuted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {mode === 'signup' && (
          <View style={styles.roleRow}>
            <RolePill label="I'm a Client" active={role === 'client'} onPress={() => setRole('client')} />
            <RolePill label="I'm a Trainer" active={role === 'trainer'} onPress={() => setRole('trainer')} />
          </View>
        )}

        {authError ? <Text style={styles.error}>{authError}</Text> : null}

        <Button
          label={submitting ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
          onPress={submit}
          loading={submitting}
          disabled={!email.trim() || !password || (mode === 'signup' && !name.trim())}
        />

        <Text style={styles.demoLink} onPress={() => setMode('demo')}>
          Try the demo instead — no account needed →
        </Text>

        {mode === 'demo' && (
          <View style={styles.demoBox}>
            <TextInput
              style={styles.input}
              placeholder="Any name for the demo"
              placeholderTextColor={colors.inkMuted}
              value={name}
              onChangeText={setName}
            />
            <View style={styles.roleRow}>
              <RolePill label="I'm a Client" active={role === 'client'} onPress={() => setRole('client')} />
              <RolePill label="I'm a Trainer" active={role === 'trainer'} onPress={() => setRole('trainer')} />
            </View>
            <Button
              label="Enter demo"
              variant="secondary"
              onPress={() => continueAsDemo(name.trim() || (role === 'client' ? 'Demo Client' : 'Demo Trainer'), role)}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Tab({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Text onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      {label}
    </Text>
  );
}

function RolePill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Text onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing(6), paddingVertical: spacing(10) },
  eyebrow: { color: colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 2, marginBottom: spacing(2) },
  title: { color: colors.ink, fontSize: 30, fontWeight: '800', marginBottom: spacing(5) },
  tabRow: { flexDirection: 'row', gap: spacing(2), marginBottom: spacing(5) },
  tab: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: spacing(2.5),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
  },
  tabActive: { backgroundColor: colors.surfaceAlt, borderColor: colors.ink, color: colors.ink },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing(4),
    paddingVertical: spacing(3),
    color: colors.ink,
    marginBottom: spacing(3),
    fontSize: 15,
  },
  roleRow: { flexDirection: 'row', gap: spacing(2), marginBottom: spacing(4) },
  pill: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: spacing(3),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.inkMuted,
    fontSize: 13,
    fontWeight: '700',
    overflow: 'hidden',
  },
  pillActive: { backgroundColor: colors.accent, borderColor: colors.accent, color: colors.accentInk },
  error: { color: colors.danger, fontSize: 13, marginBottom: spacing(3), lineHeight: 18 },
  demoLink: { color: colors.good, fontSize: 13, fontWeight: '600', textAlign: 'center', marginTop: spacing(5) },
  demoBox: { marginTop: spacing(4) },
});
