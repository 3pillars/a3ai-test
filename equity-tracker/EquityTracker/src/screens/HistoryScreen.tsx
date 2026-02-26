import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EntryListItem } from '../components/EntryListItem';
import { useEquity } from '../context/EquityContext';
import { colors } from '../theme/colors';

export const HistoryScreen: React.FC = () => {
  const { entries, deleteEntry } = useEquity();

  const sortedEntries = [...entries].reverse();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {sortedEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No entries yet</Text>
          <Text style={styles.emptySubtext}>
            Add your first equity value to start tracking
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <EntryListItem
              entry={item}
              previousEntry={sortedEntries[index + 1]}
              onDelete={deleteEntry}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },
});
