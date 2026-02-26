# Equity Tracker App Specification

## 1. Project Overview
- **Project Name**: EquityTracker
- **Bundle Identifier**: com.equitytracker.app
- **Core Functionality**: Track portfolio equity value over time with interactive charts
- **Target Users**: Individual investors and traders
- **iOS Version Support**: iOS 13.0+

## 2. UI/UX Specification

### Screen Structure
1. **Dashboard Screen** (Home)
   - Current equity value display
   - Daily/weekly/monthly change
   - Interactive line chart
   - Quick stats cards

2. **History Screen**
   - Full-screen chart view
   - Time range selector (1D, 1W, 1M, 3M, 1Y, ALL)
   - Transaction history list

3. **Add Entry Screen** (Modal)
   - Input for equity value
   - Date picker
   - Notes field
   - Save button

### Navigation Structure
- Bottom Tab Navigation
  - Dashboard (home icon)
  - History (chart icon)
  - Add Entry (plus icon)

### Visual Design
- **Primary Color**: #1E3A5F (Deep Navy)
- **Secondary Color**: #4CAF50 (Profit Green)
- **Accent Color**: #FF5252 (Loss Red)
- **Background**: #0D1B2A (Dark Blue-Black)
- **Card Background**: #1B2838 (Dark Slate)
- **Text Primary**: #FFFFFF
- **Text Secondary**: #8892A0

### Typography
- **Font Family**: System default (San Francisco on iOS)
- **Large Numbers**: 36px, Bold
- **Headings**: 20px, SemiBold
- **Body**: 16px, Regular
- **Caption**: 12px, Regular

### Components
1. **EquityCard**: Shows current value with change percentage
2. **LineChart**: Interactive chart using react-native-chart-kit
3. **TimeRangeSelector**: Horizontal button group for chart periods
4. **EntryListItem**: Row showing date, value, change
5. **InputField**: Styled text input for values

## 3. Functionality Specification

### Core Features
1. **Track Equity**
   - Add new equity entries with value and date
   - View current equity and historical values
   - Automatic calculation of gains/losses

2. **Visualize Progress**
   - Line chart showing equity over time
   - Multiple time range views
   - Visual profit/loss indicators

3. **History Management**
   - View all past entries
   - Delete entries if needed

### Data Handling
- Local storage using AsyncStorage
- Data structure:
```json
{
  "entries": [
    {
      "id": "uuid",
      "value": 50000,
      "date": "2026-02-17",
      "note": "Initial balance"
    }
  ]
}
```

### State Management
- React Context for global state
- useState for local component state

## 4. Technical Specification

### Required Packages
- react-native-chart-kit (charts)
- react-native-svg (chart dependency)
- @react-navigation/native (navigation)
- @react-navigation/bottom-tabs (tab navigation)
- @react-native-async-storage/async-storage (local data)
- react-native-screens (navigation dependency)
- react-native-safe-area-context (safe area handling)

### Asset Requirements
- No custom images needed (using system icons)

### Project Structure
```
EquityTracker/
├── src/
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── AddEntryScreen.tsx
│   ├── components/
│   │   ├── EquityCard.tsx
│   │   ├── LineChartComponent.tsx
│   │   ├── TimeRangeSelector.tsx
│   │   └── EntryListItem.tsx
│   ├── context/
│   │   └── EquityContext.tsx
│   ├── utils/
│   │   └── storage.ts
│   └── theme/
│       └── colors.ts
├── App.tsx
└── index.js
```
