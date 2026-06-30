// ─── Stars ────────────────────────────────────────────────────────────────────
// Extracted from 2_servicesScreen.tsx (services feature).
import React from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface StarsProps {
  rating: number;
  size?: number;
}

export const Stars: React.FC<StarsProps> = ({ rating, size = 11 }) => (
  <View style={{ flexDirection: "row", gap: 1.5 }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <Ionicons
        key={i}
        name={i <= Math.floor(rating) ? "star" : i - 0.5 <= rating ? "star-half" : "star-outline"}
        size={size}
        color={i <= Math.floor(rating) ? "#D4A853" : "#D4CCBF"}
      />
    ))}
  </View>
);

export default Stars;
