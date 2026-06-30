// ─────────────────────────────────────────────────────────────────────────────
//  PulsingDot — animated "live" indicator dot
//  Extracted verbatim from app/consumer/src/screens/1_statsLanding.tsx
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';

export interface PulsingDotProps {
  color: string;
}

export const PulsingDot: React.FC<PulsingDotProps> = ({ color }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.6, duration: 700, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1,   duration: 700, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0,   duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        }}
      />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
    </View>
  );
};

export default PulsingDot;
