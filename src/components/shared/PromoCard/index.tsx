// ─────────────────────────────────────────────────────────────────────────────
//  PromoCard — dark promotional banner card
//  Extracted from app/consumer/src/screens/1_statsLanding.tsx
//  Tokens rewired to the unified theme (Colors / Fonts).
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Fonts as F } from '../../../theme';
import type { Promo } from '../../../types';

export interface PromoCardProps {
  promo: Promo;
}

export const PromoCard: React.FC<PromoCardProps> = ({ promo }) => (
  <View style={[styles.promoCard, { backgroundColor: promo.darkBg }]}>
    {/* Background orbs */}
    <View style={[styles.promoOrb1, { backgroundColor: promo.accent + '40' }]} />
    <View style={[styles.promoOrb2, { backgroundColor: promo.accent + '18' }]} />

    <View style={styles.promoContent}>
      <View style={[styles.promoTag, { backgroundColor: promo.accent + '30', borderColor: promo.accent + '50' }]}>
        <Text style={[styles.promoTagText, { fontFamily: F.bodyBold, color: promo.accent }]}>
          {promo.tag}
        </Text>
      </View>
      <Text style={[styles.promoHeadline, { fontFamily: F.displayBold }]}>{promo.headline}</Text>
      <Text style={[styles.promoBody, { fontFamily: F.bodyReg }]}>{promo.body}</Text>
      <TouchableOpacity
        style={[styles.promoCTA, { backgroundColor: promo.accent }]}
        activeOpacity={0.85}
      >
        <Text style={[styles.promoCTAText, { fontFamily: F.bodySemi }]}>{promo.cta}</Text>
        <Ionicons name="arrow-forward" size={13} color="#FFF" style={{ marginLeft: 5 }} />
      </TouchableOpacity>
    </View>

    <View style={[styles.promoIconWrap, { backgroundColor: promo.accent + '28', borderColor: promo.accent + '40' }]}>
      <MaterialCommunityIcons name={promo.mcIcon as any} size={40} color={promo.accent} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  promoCard: {
    borderRadius: 24,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 14,
  },
  promoOrb1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -80,
    right: -40,
  },
  promoOrb2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    bottom: -60,
    left: -30,
  },
  promoContent: {
    flex: 1,
    paddingRight: 12,
    gap: 6,
  },
  promoTag: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    marginBottom: 2,
  },
  promoTagText: {
    fontSize: 9,
    letterSpacing: 0.8,
  },
  promoHeadline: {
    fontSize: 26,
    color: '#FFF',
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  promoBody: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 17,
  },
  promoCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 4,
  },
  promoCTAText: {
    fontSize: 12,
    color: '#FFF',
  },
  promoIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    borderWidth: 1,
  },
});

export default PromoCard;
