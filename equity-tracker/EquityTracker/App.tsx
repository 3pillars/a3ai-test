import React from 'react';
import { StatusBar, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EquityProvider } from './src/context/EquityContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { AddEntryScreen } from './src/screens/AddEntryScreen';
import { colors } from './src/theme/colors';

const Tab = createBottomTabNavigator();

const TabIconText: React.FC<{ children: string }> = ({ children }) => (
  <Text style={{ fontSize: 20 }}>{children}</Text>
);

const AppContent: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            paddingTop: 8,
            paddingBottom: 8,
            height: 60,
          },
          tabBarActiveTintColor: colors.profit,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: () => <TabIconText>📊</TabIconText>,
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddEntryScreen}
          options={{
            tabBarLabel: 'Add Entry',
            tabBarIcon: () => <TabIconText>➕</TabIconText>,
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            tabBarLabel: 'History',
            tabBarIcon: () => <TabIconText>📈</TabIconText>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <EquityProvider>
        <AppContent />
      </EquityProvider>
    </SafeAreaProvider>
  );
};

export default App;
