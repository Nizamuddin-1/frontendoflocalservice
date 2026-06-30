// ─── Animated Counter ─────────────────────────────────────────────────────────
// Extracted from 4_walletScreen.tsx (wallet feature). Copied verbatim.
import React, { useRef, useState, useEffect } from 'react';
import { Text, Animated } from 'react-native';

import { F } from './tokens';
import { styles } from './wallet.styles';

export interface AnimatedBalanceProps {
  target: number;
}

export const AnimatedBalance: React.FC<AnimatedBalanceProps> = ({ target }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: target,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    anim.addListener(({ value }) => setDisplay(Math.floor(value)));
    return () => anim.removeAllListeners();
  }, [target]);

  return (
    <Text style={[styles.balanceAmount, { fontFamily: F.displayBold }]}>
      ₹{display.toLocaleString("en-IN")}
    </Text>
  );
};

export default AnimatedBalance;
