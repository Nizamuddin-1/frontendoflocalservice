// ─── Animated Header Avatar ───────────────────────────────────────────────────
// Extracted from 5_profileScreen.tsx (profile feature). Copied verbatim.
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { C, F } from './tokens';
import { styles } from './profile.styles';

export interface HeroAvatarProps {
  name: string;
  tier: string;
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({ name, tier }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <View style={styles.heroAvatarWrap}>
      {/* Outer pulse ring */}
      <Animated.View style={[styles.avatarRingOuter, { transform: [{ scale: pulseAnim }] }]} />
      {/* Inner ring */}
      <View style={styles.avatarRingInner} />
      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Text style={[styles.avatarInitials, { fontFamily: F.displayBold }]}>{initials}</Text>
      </View>
      {/* Edit Badge */}
      <TouchableOpacity style={styles.avatarEditBadge} activeOpacity={0.8}>
        <Ionicons name="camera" size={12} color="#FFF" />
      </TouchableOpacity>
      {/* Gold tier badge */}
      <View style={styles.tierBadge}>
        <MaterialCommunityIcons name="crown" size={9} color={C.heroTop} />
        <Text style={[styles.tierBadgeText, { fontFamily: F.bodyBold }]}>{tier}</Text>
      </View>
    </View>
  );
};

export default HeroAvatar;
