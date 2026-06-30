// ─────────────────────────────────────────────────────────────────────────────
//  TrustStrip — horizontal trust/credibility badges
//  Extracted from app/consumer/src/screens/1_statsLanding.tsx (home variant).
//  NOTE: screen 2 (services) has a richer TrustStrip driven by TRUST_FEATURES
//        data + the `Feature` type. That variant can be consolidated later;
//        this is the compact home version with 3 inline items.
//  Tokens rewired to the unified theme (Colors / Fonts).
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Colors as C, Fonts as F } from '../../../theme';

const ITEMS = [
  { icon: 'shield-checkmark', label: '1,200+ Verified Pros', color: C.sage   },
  { icon: 'star',             label: '4.7★ Avg Rating',      color: C.gold   },
  { icon: 'flash',            label: '18 min Avg Response',  color: C.cobalt },
];

export const TrustStrip: React.FC = () => (
  <View style={styles.trustStrip}>
    {ITEMS.map((t) => (
      <View key={t.label} style={styles.trustItem}>
        <View style={[styles.trustIcon, { backgroundColor: t.color + '18' }]}>
          <Ionicons name={t.icon as any} size={14} color={t.color} />
        </View>
        <Text style={[styles.trustLabel, { fontFamily: F.bodyMed }]} numberOfLines={1}>
          {t.label}
        </Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  trustStrip: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: C.ruleLight,
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  trustItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    overflow: 'hidden',
    paddingHorizontal: 4,
  },
  trustIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  trustLabel: {
    fontSize: 10,
    color: C.inkMid,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
});

export default TrustStrip;
