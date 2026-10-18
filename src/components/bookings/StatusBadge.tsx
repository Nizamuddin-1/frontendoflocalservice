// ─── Status Badge ─────────────────────────────────────────────────────────────
// Extracted from 3_bookingScreen.tsx. STATUS_CONFIG (presentation config) was a
// screen-local const; it lives here with the component that uses it. Values are
// copied verbatim from the original screen.
import React from 'react';
import { View, Text } from 'react-native';

import { F } from './tokens';
import { styles } from './bookings.styles';
import type { BookingStatus } from '@/src/types';

const STATUS_CONFIG: Record<BookingStatus, {
  label: string; bg: string; text: string; icon: string; dot: string;
}> = {
  ongoing:   { label: "Active",     bg: "#DCFCE7", text: "#15803D", icon: "radio-button-on",  dot: "#0AB87A" },
  upcoming:  { label: "Upcoming",   bg: "#DBEAFE", text: "#1D4ED8", icon: "time-outline",      dot: "#1A73E8" },
  completed: { label: "Completed",  bg: "#F0FDF4", text: "#166534", icon: "checkmark-circle",  dot: "#0AB87A" },
  cancelled: { label: "Cancelled",  bg: "#FEF2F2", text: "#991B1B", icon: "close-circle",      dot: "#EF4444" },
};

export interface StatusBadgeProps {
  status: BookingStatus;
}

const DEFAULT_STATUS_CONFIG = {
  label: "Unknown",
  bg: "#F3F4F6",
  text: "#4B5563",
  icon: "ellipse-outline",
  dot: "#9CA3AF",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || {
    ...DEFAULT_STATUS_CONFIG,
    label: typeof status === 'string' ? status : DEFAULT_STATUS_CONFIG.label,
  };
  return (
    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.statusText, { color: cfg.text, fontFamily: F.bodySemi }]}>{cfg.label}</Text>
    </View>
  );
};

export default StatusBadge;
