import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEquity } from '../context/EquityContext';
import { colors } from '../theme/colors';

export const AddEntryScreen: React.FC = () => {
  const { addEntry, entries } = useEquity();
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');

  const handleSave = async () => {
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numValue) || numValue <= 0) {
      Alert.alert('Invalid Value', 'Please enter a valid positive number');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    await addEntry(numValue, today, note || undefined);
    
    setValue('');
    setNote('');
    Alert.alert('Success', 'Entry added successfully!');
  };

  const lastValue = entries.length > 0 ? entries[entries.length - 1].value : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Add Equity Entry</Text>
          
          {lastValue && (
            <View style={styles.lastValueContainer}>
              <Text style={styles.lastValueLabel}>Last recorded value</Text>
              <Text style={styles.lastValue}>
                ${lastValue.toLocaleString()}
              </Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Equity Value ($)</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={setValue}
              placeholder="Enter amount"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Note (optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              value={note}
              onChangeText={setNote}
              placeholder="Add a note..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Entry</Text>
          </TouchableOpacity>

          <Text style={styles.dateText}>
            Date: {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  lastValueContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  lastValueLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  lastValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noteInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.profit,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
  dateText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});
