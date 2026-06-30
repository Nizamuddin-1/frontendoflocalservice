// ─── Trust Strip (services variant) ──────────────────────────────────────────
// Extracted from 2_servicesScreen.tsx. Data-driven version (TRUST_FEATURES),
// distinct from the compact home TrustStrip in components/shared.
import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { F } from './tokens';
import { styles } from './services.styles';
import { TRUST_FEATURES } from '@/src/services/mock';

export const TrustStrip: React.FC = () => (
  <View style={styles.trustStrip}>
    {TRUST_FEATURES.map((f, i) => (
      <React.Fragment key={f.label}>
        <View style={styles.trustItem}>
          <View style={[styles.trustIconWrap, { backgroundColor: f.color + "18" }]}>
            <Ionicons name={f.icon as any} size={14} color={f.color} />
          </View>
          <View style={styles.trustTextWrap}>
            <Text style={[styles.trustValue, { fontFamily: F.displaySemi, color: f.color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {f.value}
            </Text>
            <Text style={[styles.trustLabel, { fontFamily: F.bodyReg }]} numberOfLines={1}>{f.label}</Text>
          </View>
        </View>
        {i < TRUST_FEATURES.length - 1 && <View style={styles.trustDivider} />}
      </React.Fragment>
    ))}
  </View>
);

export default TrustStrip;
