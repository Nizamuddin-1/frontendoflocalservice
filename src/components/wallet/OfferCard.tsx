// ─── Offer Card ───────────────────────────────────────────────────────────────
// Extracted from 4_walletScreen.tsx (wallet feature). Copied verbatim.
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { F } from './tokens';
import { styles } from './wallet.styles';
import type { Offer } from '@/src/types';

export interface OfferCardProps {
  offer: Offer;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <View style={[styles.offerCard, { borderLeftColor: offer.color }]}>
      <View style={[styles.offerCircle, { backgroundColor: offer.color + "14" }]} />
      <View style={styles.offerLeft}>
        <View style={[styles.offerIconWrap, { backgroundColor: offer.color + "1A" }]}>
          <MaterialCommunityIcons name={offer.icon as any} size={20} color={offer.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.offerTitle,    { fontFamily: F.displaySemi, color: offer.color }]}>{offer.title}</Text>
          <Text style={[styles.offerSubtitle, { fontFamily: F.bodyReg }]}>{offer.subtitle}</Text>
          <Text style={[styles.offerExpiry,   { fontFamily: F.bodyReg }]}>{offer.expiry}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.offerCodeBtn, { borderColor: offer.color + "55", backgroundColor: offer.color + "0D" }]}
        onPress={handleCopy}
        activeOpacity={0.75}
      >
        <Text style={[styles.offerCode, { fontFamily: F.bodySemi, color: offer.color }]}>
          {copied ? "Copied!" : offer.code}
        </Text>
        {!copied && <Ionicons name="copy-outline"  size={12} color={offer.color} style={{ marginLeft: 4 }} />}
        {copied  && <Ionicons name="checkmark"     size={12} color={offer.color} style={{ marginLeft: 4 }} />}
      </TouchableOpacity>
    </View>
  );
};

export default OfferCard;
