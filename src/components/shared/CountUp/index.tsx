// ─────────────────────────────────────────────────────────────────────────────
//  CountUp — animated number roll-up
//  Extracted verbatim from app/consumer/src/screens/1_statsLanding.tsx
//  Renders inside a <Text>; returns a fragment of formatted digits.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';

export interface CountUpProps {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  prefix = '',
  suffix = '',
  duration = 900,
  delay = 0,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: to,
        duration,
        useNativeDriver: false,
      }).start();
    }, delay);
    const listener = anim.addListener(({ value }) => setDisplayed(Math.round(value)));
    return () => {
      clearTimeout(timer);
      anim.removeListener(listener);
    };
  }, [to]);

  return <>{`${prefix}${displayed.toLocaleString('en-IN')}${suffix}`}</>;
};

export default CountUp;
