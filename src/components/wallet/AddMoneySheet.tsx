// ─── Add Money Sheet ──────────────────────────────────────────────────────────
// Extracted from 4_walletScreen.tsx (wallet feature). Copied verbatim; data
// (ADD_AMOUNTS) now sourced from the mock layer.
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { C, F } from './tokens';
import { styles } from './wallet.styles';
import { ADD_AMOUNTS } from '@/src/services/mock';

export interface AddMoneySheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (amt: number) => void;
}

export const AddMoneySheet: React.FC<AddMoneySheetProps> = ({ visible, onClose, onConfirm }) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 400, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,   duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.sheetOverlay, { opacity: fadeAnim }]}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sheetHandle} />

        <Text style={[styles.sheetTitle, { fontFamily: F.displaySemi }]}>Add Money to Wallet</Text>
        <Text style={[styles.sheetSub,   { fontFamily: F.bodyReg    }]}>Choose an amount to add</Text>

        <View style={styles.amountGrid}>
          {ADD_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[styles.amountPill, selected === amt && styles.amountPillActive]}
              onPress={() => setSelected(amt)}
              activeOpacity={0.75}
            >
              <Text style={[
                styles.amountPillText,
                { fontFamily: F.bodySemi },
                selected === amt && { color: "#FFF" },
              ]}>
                ₹{amt.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sheetSection, { fontFamily: F.bodySemi }]}>Pay via</Text>
        <View style={styles.payMethods}>
          {[
            { label: "UPI",         icon: "cellphone-nfc", color: "#4CAF50" },
            { label: "Card",        icon: "credit-card",   color: C.blue    },
            { label: "Net Banking", icon: "bank-outline",  color: C.purple  },
          ].map((m) => (
            <TouchableOpacity key={m.label} style={styles.payMethod} activeOpacity={0.75}>
              <View style={[styles.payMethodIcon, { backgroundColor: m.color + "18" }]}>
                <MaterialCommunityIcons name={m.icon as any} size={20} color={m.color} />
              </View>
              <Text style={[styles.payMethodLabel, { fontFamily: F.bodyMed }]}>{m.label}</Text>
              <Ionicons name="chevron-forward" size={14} color={C.slateLight} style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, !selected && { opacity: 0.45 }]}
          activeOpacity={selected ? 0.85 : 1}
          onPress={() => selected && onConfirm(selected)}
        >
          <Ionicons name="wallet-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={[styles.confirmBtnText, { fontFamily: F.bodySemi }]}>
            {selected ? `Add ₹${selected.toLocaleString()} to Wallet` : "Select an Amount"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default AddMoneySheet;
