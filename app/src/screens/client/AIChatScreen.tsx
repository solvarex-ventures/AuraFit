import React, { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/theme';
import { ChatMessage } from '@/types';
import { sendChatMessage } from '@/services/aiService';
import { useAuth } from '@/context/AuthContext';

const STARTER: ChatMessage = {
  id: 'starter',
  role: 'assistant',
  text:
    "I'm your AI coach — ask about macros, deloads, or why a lift felt off today. I route simple questions to a fast, cheap model and hand complex programming questions to a stronger one.",
};

export default function AIChatScreen() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([STARTER]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: 'user', text };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setSending(true);
    try {
      const reply = await sendChatMessage({ history: messages, message: text, token });
      setMessages((m) => [...m, reply]);
    } finally {
      setSending(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.bubble, item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant]}>
              <Text style={item.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAssistant}>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask about macros, deloads, form…"
            placeholderTextColor={colors.inkMuted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={send}
          />
          <Button label={sending ? '…' : 'Send'} onPress={send} loading={sending} disabled={!input.trim()} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  list: { padding: spacing(5), gap: spacing(3) },
  bubble: { maxWidth: '85%', borderRadius: 14, padding: spacing(3.5) },
  bubbleUser: { backgroundColor: colors.accent, alignSelf: 'flex-end' },
  bubbleAssistant: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignSelf: 'flex-start' },
  bubbleTextUser: { color: colors.accentInk, fontSize: 14, lineHeight: 19 },
  bubbleTextAssistant: { color: colors.ink, fontSize: 14, lineHeight: 19 },
  inputRow: {
    flexDirection: 'row',
    gap: spacing(2),
    padding: spacing(4),
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing(4),
    color: colors.ink,
    fontSize: 14,
  },
});
