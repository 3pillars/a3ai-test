import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../theme/colors';
import { useEquity } from '../context/EquityContext';

const screenWidth = Dimensions.get('window').width;

type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

const timeRanges: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export const LineChartComponent: React.FC = () => {
  const { entries } = useEquity();
  const [selectedRange, setSelectedRange] = useState<TimeRange>('ALL');

  const getFilteredEntries = () => {
    if (entries.length === 0) return [];
    
    const now = new Date();
    let cutoffDate: Date | null = null;

    switch (selectedRange) {
      case '1D':
        cutoffDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
        break;
      case '1W':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3M':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1Y':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        return entries;
    }

    return entries.filter(e => new Date(e.date) >= cutoffDate!);
  };

  const filteredEntries = getFilteredEntries();

  if (filteredEntries.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.noData}>Add at least 2 entries to see the chart</Text>
      </View>
    );
  }

  const labels = filteredEntries.map((_, index) => {
    if (filteredEntries.length <= 7) {
      const date = new Date(filteredEntries[index].date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    if (index === 0 || index === filteredEntries.length - 1) {
      const date = new Date(filteredEntries[index].date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return '';
  });

  const data = filteredEntries.map(e => e.value);
  const minValue = Math.min(...data);
  const maxValue = Math.max(...data);
  const isPositive = data[data.length - 1] >= data[0];

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 0,
    color: (opacity = 1) => isPositive 
      ? `rgba(76, 175, 80, ${opacity})` 
      : `rgba(255, 82, 82, ${opacity})`,
    labelColor: () => colors.textSecondary,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: isPositive ? colors.profit : colors.loss,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.border,
      strokeWidth: 0.5,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.rangeContainer}>
        {timeRanges.map(range => (
          <TouchableOpacity
            key={range}
            style={[
              styles.rangeButton,
              selectedRange === range && styles.rangeButtonActive,
            ]}
            onPress={() => setSelectedRange(range)}
          >
            <Text
              style={[
                styles.rangeText,
                selectedRange === range && styles.rangeTextActive,
              ]}
            >
              {range}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <LineChart
        data={{
          labels,
          datasets: [{ data }],
        }}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        yAxisLabel="$"
        yAxisSuffix=""
        fromZero={false}
      />
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>${minValue.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>${maxValue.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Change</Text>
          <Text style={[styles.statValue, { color: isPositive ? colors.profit : colors.loss }]}>
            {isPositive ? '+' : ''}${(data[data.length - 1] - data[0]).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noData: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 40,
    fontSize: 14,
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  rangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  rangeButtonActive: {
    backgroundColor: colors.primary,
  },
  rangeText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  rangeTextActive: {
    color: colors.textPrimary,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
});
