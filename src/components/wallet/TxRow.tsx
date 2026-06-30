// ─── Transaction Row ──────────────────────────────────────────────────────────
// Extracted from 4_walletScreen.tsx. TX_TYPE_CONFIG / TX_STATUS_CONFIG
// (presentation config) were screen-local consts; they live here with the
// component that uses them. Copied verbatim.
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { C, F } from './tokens';
import { styles } from './wallet.styles';
import type { Transaction, TxType, TxStatus } from '@/src/types';

const TX_TYPE_CONFIG: Record<TxType, { sign: string; color: string; tint: string }> = {
  credit:   { sign: "+", color: C.green,  tint: C.greenTint  },
  debit:    { sign: "−", color: C.red,    tint: C.redTint    },
  refund:   { sign: "+", color: C.teal,   tint: C.tealTint   },
  cashback: { sign: "+", color: C.gold,   tint: C.amberTint  },
};

const TX_STATUS_CONFIG: Record<TxStatus, { label: string; color: string; bg: string }> = {
  success: { label: "Success", color: "#15803D", bg: "#DCFCE7" },
  pending: { label: "Pending", color: "#92400E", bg: "#FEF9C3" },
  failed:  { label: "Failed",  color: "#991B1B", bg: "#FEE2E2" },
};

export interface TxRowProps {
  tx: Transaction;
}

export const TxRow: React.FC<TxRowProps> = ({ tx }) => {
  const tc = TX_TYPE_CONFIG[tx.type];
  const sc = TX_STATUS_CONFIG[tx.status];

  return (
    <TouchableOpacity
      style={[styles.txRow, { borderLeftColor: tx.iconColor }]}
      activeOpacity={0.7}
    >
      <View style={[styles.txBgCircle, { backgroundColor: tx.iconColor + "12" }]} />
      <View style={styles.txLeft}>
        <View style={[styles.txIconWrap, { backgroundColor: tx.iconColor + "1A" }]}>
          <MaterialCommunityIcons name={tx.icon as any} size={20} color={tx.iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.txTitle, { fontFamily: F.displaySemi }]} numberOfLines={1}>{tx.title}</Text>
          <Text style={[styles.txSub,   { fontFamily: F.bodyReg }]} numberOfLines={1}>{tx.subtitle}</Text>
          <View style={styles.txMeta}>
            <Ionicons name="time-outline" size={11} color={C.slateLight} />
            <Text style={[styles.txDate, { fontFamily: F.bodyReg }]}>{" "}{tx.date} · {tx.time}</Text>
            {tx.status !== "success" && (
              <View style={[styles.txStatusChip, { backgroundColor: sc.bg }]}>
                <Text style={[styles.txStatusText, { color: sc.color, fontFamily: F.bodySemi }]}>{sc.label}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={[styles.txAmountBadge, {
        borderColor: tc.color + "55",
        backgroundColor: tc.tint,
      }]}>
        <Text style={[styles.txAmountSign, { fontFamily: F.bodySemi, color: tc.color }]}>{tc.sign}</Text>
        <Text style={[styles.txAmount,     { fontFamily: F.displaySemi, color: tc.color }]}>
          ₹{tx.amount.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TxRow;
