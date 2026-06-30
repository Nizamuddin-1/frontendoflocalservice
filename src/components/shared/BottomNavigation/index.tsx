// ─────────────────────────────────────────────────────────────────────────────
//  BottomNavigation — consumer 5-tab custom bottom bar
//  Extracted from app/consumer/src/screens/1_statsLanding.tsx
//  Tokens rewired to the unified theme. `surfaceRaised` → `surface`.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Colors as C, Fonts as F } from '../../../theme';

export type TabType = 'home' | 'services' | 'bookings' | 'wallet' | 'profile';

export interface BottomNavigationProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

interface TabConfig {
  key: TabType;
  label: string;
  activeIcon: string;
  inactiveIcon: string;
}

const TABS: TabConfig[] = [
  { key: 'home',     label: 'Home',         activeIcon: 'home',      inactiveIcon: 'home-outline'      },
  { key: 'services', label: 'Services',     activeIcon: 'construct', inactiveIcon: 'construct-outline' },
  { key: 'bookings', label: 'Bookings',     activeIcon: 'calendar',  inactiveIcon: 'calendar-outline'  },
  { key: 'wallet',   label: 'Transactions', activeIcon: 'wallet',    inactiveIcon: 'wallet-outline'    },
  { key: 'profile',  label: 'Profile',      activeIcon: 'person',    inactiveIcon: 'person-outline'    },
];

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabPress }) => (
  <View style={styles.bottomNav}>
    {TABS.map((tab) => {
      const isActive = activeTab === tab.key;
      return (
        <TouchableOpacity
          key={tab.key}
          style={styles.navItem}
          onPress={() => onTabPress(tab.key)}
          activeOpacity={0.7}
        >
          <View style={[styles.navIconWrapper, isActive && styles.navIconActive]}>
            <Ionicons
              name={isActive ? tab.activeIcon : tab.inactiveIcon}
              size={22}
              color={isActive ? C.terra : C.inkLight}
            />
          </View>
          <Text
            style={[
              styles.navLabel,
              { fontFamily: F.bodySemi },
              isActive && styles.navLabelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: C.surface, // was C.surfaceRaised (#FFFFFF)
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navIconWrapper: {
    padding: 6,
    borderRadius: 12,
  },
  navIconActive: {
    backgroundColor: C.terraLight,
  },
  navLabel: {
    fontSize: 10,
    color: C.inkLight,
  },
  navLabelActive: {
    color: C.terra,
  },
});

export default BottomNavigation;
