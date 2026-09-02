import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors, spacing } from '@/theme';

const CLIENTS = [
  { name: 'Rohit K.', tier: 'Foundation', nextCheckin: 'Fri' },
  { name: 'Priya S.', tier: 'Specialist', nextCheckin: 'Wed' },
  { name: 'Aman D.', tier: 'Foundation', nextCheckin: 'Mon' },
  { name: 'Sneha R.', tier: 'Foundation', nextCheckin: 'Thu' },
  { name: 'Karan M.', tier: 'Elite — Contest Prep', nextCheckin: 'Tue' },
];

export default function ClientListScreen({ navigation }: { navigation: { navigate: (screen: string, params?: object) => void } }) {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.content}>
        <ScreenHeader title="Clients" subtitle={`${CLIENTS.length} active`} />
        <FlatList
          data={CLIENTS}
          keyExtractor={(c) => c.name}
          contentContainerStyle={{ gap: spacing(3), paddingBottom: spacing(10) }}
          renderItem={({ item }) => (
            <Card style={styles.row} onPress={() => navigation.navigate('ClientDetail', { client: item })}>
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.tier}>{item.tier}</Text>
              </View>
              <Text style={styles.checkin}>Next: {item.nextCheckin}</Text>
            </Card>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, paddingHorizontal: spacing(5) },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  tier: { color: colors.inkMuted, fontSize: 12, marginTop: 2 },
  checkin: { color: colors.good, fontSize: 12, fontWeight: '600' },
});
