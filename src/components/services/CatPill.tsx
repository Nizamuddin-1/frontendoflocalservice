// ─── Category Pill ────────────────────────────────────────────────────────────
// Extracted from 2_servicesScreen.tsx (services feature).
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';

import { C, F } from './tokens';
import { styles } from './services.styles';
import { CategoryIcon } from '@/src/components/shared/CategoryIcon';
import type { Category } from '@/src/types';

export interface CatPillProps {
  cat: any; // Supports both Category and ServiceCategory
  active: boolean;
  onPress: () => void;
}

export const CatPill: React.FC<CatPillProps> = ({ cat, active, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 60 }),
      Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 50 }),
    ]).start();
    onPress();
  };
  
  const label = cat.label || cat.name;
  const icon = cat.ionIcon || cat.icon;
  const count = cat.count ?? cat.proCount ?? 0;
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.catPill, active ? { backgroundColor: C.ink, borderColor: C.ink } : { borderColor: C.rule }]}
        onPress={tap}
        activeOpacity={0.85}
      >
        <View style={[styles.catPillIcon, { backgroundColor: active ? "rgba(255,255,255,0.14)" : cat.bg }]}>
          <CategoryIcon name={icon} size={13} color={active ? "#FFF" : cat.color} />
        </View>
        <Text style={[styles.catPillLabel, { fontFamily: active ? F.bodySemi : F.bodyMed, color: active ? "#FFF" : C.inkMid }]}>
          {label}
        </Text>
        {count > 0 && !active && (
          <Text style={[styles.catPillCount, { fontFamily: F.bodyReg }]}>{count}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CatPill;
