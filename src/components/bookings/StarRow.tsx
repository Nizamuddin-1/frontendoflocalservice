// ─── StarRow ──────────────────────────────────────────────────────────────────
// Extracted from 3_bookingScreen.tsx (bookings feature).
import React from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface StarRowProps {
  rating: number;
}

export const StarRow: React.FC<StarRowProps> = ({ rating }) => (
  <View style={{ flexDirection: "row", gap: 2 }}>
    {[1,2,3,4,5].map((i) => (
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={13}
        color={i <= rating ? "#F59E0B" : "#CBD5E1"}
      />
    ))}
  </View>
);

export default StarRow;
