// ─── Loyalty Points Bar ───────────────────────────────────────────────────────
// Extracted from 5_profileScreen.tsx (profile feature). Copied verbatim.
import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { C, F } from './tokens';
import { styles } from './profile.styles';

export interface LoyaltyBarProps {
  points: number;
}

export const LoyaltyBar: React.FC<LoyaltyBarProps> = ({ points }) => {
  const barAnim = useRef(new Animated.Value(0)).current;
  const nextMilestone = 1500;
  const pct = Math.min((points / nextMilestone) * 100, 100);

  useEffect(() => {
    Animated.timing(barAnim, { toValue: pct, duration: 1400, useNativeDriver: false }).start();
  }, []);

  const barWidth = barAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.loyaltyCard}>
      {/* BG decoration */}
      <View style={styles.loyaltyCircle} />

      <View style={styles.loyaltyTop}>
        <View style={styles.loyaltyLeft}>
          <View style={styles.loyaltyIconWrap}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={C.goldLight} />
          </View>
          <View>
            <Text style={[styles.loyaltyTitle, { fontFamily: F.displaySemi }]}>Loyalty Points</Text>
            <Text style={[styles.loyaltySub,   { fontFamily: F.bodyReg    }]}>
              {nextMilestone - points} pts to Platinum
            </Text>
          </View>
        </View>
        <Text style={[styles.loyaltyPoints, { fontFamily: F.displayBold }]}>
          {points.toLocaleString()}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.loyaltyBarTrack}>
        <Animated.View style={[styles.loyaltyBarFill, { width: barWidth }]} />
        {/* Milestone marker */}
        <View style={[styles.loyaltyMilestone, { left: "50%" }]}>
          <View style={styles.loyaltyMilestoneDot} />
          <Text style={[styles.loyaltyMilestoneLabel, { fontFamily: F.bodyReg }]}>750</Text>
        </View>
      </View>

      <View style={styles.loyaltyBarLabels}>
        <Text style={[styles.loyaltyBarLabel, { fontFamily: F.bodyReg }]}>0</Text>
        <Text style={[styles.loyaltyBarLabelMid, { fontFamily: F.bodySemi }]}>
          {points.toLocaleString()} pts
        </Text>
        <Text style={[styles.loyaltyBarLabel, { fontFamily: F.bodyReg }]}>{nextMilestone}</Text>
      </View>
    </View>
  );
};

export default LoyaltyBar;
