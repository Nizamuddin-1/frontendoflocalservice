// ─── Action Button ────────────────────────────────────────────────────────────
// Extracted from 3_bookingScreen.tsx (bookings feature).
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { C, F } from './tokens';
import { styles } from './bookings.styles';

export interface ActionBtnProps {
  label: string;
  icon: string;
  variant?: "primary" | "outline" | "ghost";
  onPress?: () => void;
}

export const ActionBtn: React.FC<ActionBtnProps> = ({ label, icon, variant = "outline", onPress }) => {
  const isPrimary = variant === "primary";
  const isGhost   = variant === "ghost";
  return (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        isPrimary && styles.actionBtnPrimary,
        isGhost   && styles.actionBtnGhost,
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={14}
        color={isPrimary ? "#FFF" : isGhost ? C.slate : C.navy}
        style={{ marginRight: 5 }}
      />
      <Text style={[
        styles.actionBtnText,
        { fontFamily: F.bodySemi },
        isPrimary && { color: "#FFF" },
        isGhost   && { color: C.slate },
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionBtn;
