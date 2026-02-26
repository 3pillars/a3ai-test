import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { EquityEntry } from '../utils/storage';

interface EntryListItemProps {
  entry: EquityEntry;
  previousEntry?: EquityEntry;
  onDelete: (id: string) => void;
}

export const EntryListItem: React.FC<EntryListItemProps> = ({ 
  entry, 
  previousEntry, 
  onDelete 
}) => {
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const change = previousEntry
    ? ((entry.value - previousEntry.value) / previousEntry.value) * 100
    : 0;
  const isPositive = change >= 0;

  return (
    <View style={styles.container}>
      <View style={styles.leftContent}>
        <Text style={styles.date}>{formatDate(entry.date)}</Text>
        {entry.note && <Text style={styles.note}>{entry.note}</Text>}
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.value}>{formatCurrency(entry.value)}</Text>
        {previousEntry && (
          <Text style={[styles.change, { color: isPositive ? colors.profit : colors.loss }]}>
            {isPositive ? '+' : ''}{change.toFixed(2)}%
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(entry.id)}
      >
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  leftContent: {
    flex: 1,
  },
  date: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
  },
  note: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  rightContent: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  value: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  change: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.loss,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
