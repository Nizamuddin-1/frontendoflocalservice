// ─────────────────────────────────────────────────────────────────────────────
//  ServiceTile — service category tile (4-up grid)
//  Extracted from app/consumer/src/screens/1_statsLanding.tsx
//  Tokens rewired to the unified theme. `canvas` → `canvasLight` (#FFFFFF).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { Colors as C, Fonts as F } from '../../../theme';
import type { ServiceCategory } from '../../../types';

const { width } = Dimensions.get('window');

export interface ServiceTileProps {
  item: ServiceCategory;
  index: number;
}

export const ServiceTile: React.FC<ServiceTileProps> = ({ item, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = 100 + index * 45;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 380, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 16, bounciness: 3, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const tileW = (width - 48 - 12) / 4;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        width: tileW,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() =>
          Animated.spring(scaleAnim, { toValue: 0.91, useNativeDriver: true, speed: 60 }).start()
        }
        onPressOut={() =>
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start()
        }
        style={styles.serviceTile}
      >
        <View
          style={[
            styles.serviceIconBox,
            { backgroundColor: item.bg, borderColor: item.color + '28' },
          ]}
        >
          <Ionicons name={item.icon as any} size={23} color={item.color} />
          <View style={[styles.serviceProBadge, { backgroundColor: item.color }]}>
            <Text style={[styles.serviceProCount, { fontFamily: F.bodyBold }]}>
              {item.proCount}
            </Text>
          </View>
        </View>
        <Text style={[styles.serviceName, { fontFamily: F.bodyMed }]} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  serviceTile: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 3,
  },
  serviceIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    position: 'relative',
  },
  serviceProBadge: {
    position: 'absolute',
    top: -5,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: C.canvasLight, // was C.canvas (#FFFFFF on screen 1)
    paddingHorizontal: 3,
  },
  serviceProCount: {
    fontSize: 8,
    color: '#FFF',
  },
  serviceName: {
    fontSize: 11,
    color: C.inkMid,
    textAlign: 'center',
    lineHeight: 15,
  },
});

export default ServiceTile;
