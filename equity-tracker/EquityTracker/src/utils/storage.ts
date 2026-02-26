import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EquityEntry {
  id: string;
  value: number;
  date: string;
  note?: string;
}

const STORAGE_KEY = 'equity_entries';

export const saveEntries = async (entries: EquityEntry[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving entries:', error);
  }
};

export const loadEntries = async (): Promise<EquityEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading entries:', error);
    return [];
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
