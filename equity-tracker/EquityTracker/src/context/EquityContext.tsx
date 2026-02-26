import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { EquityEntry, loadEntries, saveEntries, generateId } from '../utils/storage';

interface EquityContextType {
  entries: EquityEntry[];
  addEntry: (value: number, date: string, note?: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getCurrentEquity: () => number;
  getChangePercent: () => number;
}

const EquityContext = createContext<EquityContextType | undefined>(undefined);

export const EquityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<EquityEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const saved = await loadEntries();
      setEntries(saved.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    };
    loadData();
  }, []);

  const addEntry = async (value: number, date: string, note?: string) => {
    const newEntry: EquityEntry = {
      id: generateId(),
      value,
      date,
      note,
    };
    const updated = [...entries, newEntry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    setEntries(updated);
    await saveEntries(updated);
  };

  const deleteEntry = async (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await saveEntries(updated);
  };

  const getCurrentEquity = (): number => {
    if (entries.length === 0) return 0;
    return entries[entries.length - 1].value;
  };

  const getChangePercent = (): number => {
    if (entries.length < 2) return 0;
    const current = entries[entries.length - 1].value;
    const previous = entries[entries.length - 2].value;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <EquityContext.Provider
      value={{ entries, addEntry, deleteEntry, getCurrentEquity, getChangePercent }}
    >
      {children}
    </EquityContext.Provider>
  );
};

export const useEquity = (): EquityContextType => {
  const context = useContext(EquityContext);
  if (!context) {
    throw new Error('useEquity must be used within an EquityProvider');
  }
  return context;
};
