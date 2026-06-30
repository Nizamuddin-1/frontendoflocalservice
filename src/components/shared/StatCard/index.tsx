// ─────────────────────────────────────────────────────────────────────────────
//  StatCard — animated stat tile (2-up grid)
//  Extracted from app/consumer/src/screens/1_statsLanding.tsx
//  Tokens rewired to the unified theme (Colors / Fonts).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Colors as C, Fonts as F } from '../../../theme';
import type { StatItem } from '../../../types';

const { width } = Dimensions.get('window');

export interface StatCardProps {
  item: StatItem;
  index: number;
}

export const StatCard: React.FC<StatCardProps> = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = 200 + index * 70;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 4, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Animated.View
      style={[
        styles.statCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.statCardInner}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {/* Accent stripe */}
        <View style={[styles.statAccentStripe, { backgroundColor: item.color }]} />

        <View style={[styles.statIconWrap, { backgroundColor: item.bg }]}>
          <Ionicons name={item.icon as any} size={18} color={item.color} />
        </View>

        <Text style={[styles.statValue, { fontFamily: F.displayBold, color: item.color }]}>
          {item.value}
          {item.subValue && (
            <Text style={[styles.statSubValue, { fontFamily: F.displayReg, color: C.inkLight }]}>
              {item.subValue}
            </Text>
          )}
        </Text>
        <Text style={[styles.statLabel, { fontFamily: F.bodyMed }]}>{item.label}</Text>

        <View style={styles.statTrendRow}>
          <Ionicons
            name={item.trendPositive ? 'trending-up' : 'alert-circle-outline'}
            size={10}
            color={item.trendPositive ? C.sage : C.amber}
          />
          <Text
            style={[
              styles.statTrend,
              { fontFamily: F.bodyReg, color: item.trendPositive ? C.sage : C.amber },
            ]}
            numberOfLines={1}
          >
            {'  '}{item.trend}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    width: (width - 42) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.ruleLight,
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
    backgroundColor: C.surface,
  },
  statCardInner: {
    padding: 16,
    gap: 6,
  },
  statAccentStripe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    letterSpacing: -0.6,
  },
  statSubValue: {
    fontSize: 14,
  },
  statLabel: {
    fontSize: 12,
    color: C.inkLight,
  },
  statTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statTrend: {
    fontSize: 10,
    flexShrink: 1,
  },
});

export default StatCard;
