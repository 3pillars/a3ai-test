import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useEquity } from '../context/EquityContext';

export const EquityCard: React.FC = () => {
  const { getCurrentEquity, getChangePercent, entries } = useEquity();
  
  const currentValue = getCurrentEquity();
  const changePercent = getChangePercent();
  const isPositive = changePercent >= 0;
  const hasData = entries.length > 0;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current Equity</Text>
      <Text style={styles.value}>
        {hasData ? formatCurrency(currentValue) : '--'}
      </Text>
      {hasData && (
        <View style={styles.changeContainer}>
          <Text style={[styles.change, { color: isPositive ? colors.profit : colors.loss }]}>
            {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
          </Text>
          <Text style={styles.changeLabel}> from last entry</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
  },
  changeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
