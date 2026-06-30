// ─── Avatar ───────────────────────────────────────────────────────────────────
// Extracted from 3_bookingScreen.tsx (bookings feature).
import React from 'react';
import { View, Text } from 'react-native';

import { F } from './tokens';
import { styles } from './bookings.styles';

export interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, color, size = 44 }) => (
  <View style={[styles.avatar, {
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: color + "22",
    borderColor: color + "55",
  }]}>
    <Text style={[styles.avatarText, { color, fontFamily: F.displaySemi, fontSize: size * 0.34 }]}>
      {initials}
    </Text>
  </View>
);

export default Avatar;
