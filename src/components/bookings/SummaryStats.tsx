// ─── Summary Stats ────────────────────────────────────────────────────────────
// Extracted from 3_bookingScreen.tsx (bookings feature). Copied verbatim; data
// now sourced from the mock layer.
import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { C, F } from './tokens';
import { styles } from './bookings.styles';
import { ALL_BOOKINGS } from '@/src/services/mock';

export const SummaryStats: React.FC = () => {
  const stats = [
    { label: "Total",     value: ALL_BOOKINGS.length,                                      icon: "receipt-outline",      color: C.blue   },
    { label: "Active",    value: ALL_BOOKINGS.filter(b => b.status === "ongoing").length,   icon: "radio-button-on",      color: C.green  },
    { label: "Upcoming",  value: ALL_BOOKINGS.filter(b => b.status === "upcoming").length,  icon: "time-outline",         color: C.amber  },
    { label: "Done",      value: ALL_BOOKINGS.filter(b => b.status === "completed").length, icon: "checkmark-circle",     color: C.purple },
  ];
  return (
    <View style={styles.statsRow}>
      {stats.map((s) => (
        <View key={s.label} style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: s.color + "18" }]}>
            <Ionicons name={s.icon as any} size={16} color={s.color} />
          </View>
          <Text style={[styles.statValue, { fontFamily: F.displayBold, color: s.color }]}>{s.value}</Text>
          <Text style={[styles.statLabel, { fontFamily: F.bodyRegular }]}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
};

export default SummaryStats;
