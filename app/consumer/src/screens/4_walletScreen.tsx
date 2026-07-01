/**
 * WalletScreen.tsx — LocalFix Consumer App
 *
 * Phase 3 (modularization): the inline components (AnimatedBalance, AddMoneySheet,
 * SpendSummary, OfferCard, TxRow), the TX config maps, design tokens, types, mock
 * data and the shared StyleSheet were extracted to src/. This screen now composes
 * the wallet feature components. UI & behavior unchanged.
 *   • Components / styles / tokens → @/src/components/wallet
 *   • Mock data                    → @/src/services/mock
 *   • Types                        → @/src/types
 */

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  C,
  F,
  styles,
  SpendSummary,
  OfferCard,
  TxRow,
  AddMoneySheet,
} from "@/src/components/wallet";
import { OFFERS, TX_TIME_TABS } from "@/src/services/mock";
import { useAppSelector, useAppDispatch } from "@/src/redux/store";
import { fetchWallet, addMoney } from "@/src/redux/actions/appActions";
import type { Transaction } from "@/src/types";

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function WalletScreen() {
  const dispatch = useAppDispatch();
  const { balance, transactions, isLoading } = useAppSelector((s) => s.consumer.wallet);
  const [showAddSheet, setShowAddSheet]   = useState(false);
  const [txTimeFilter, setTxTimeFilter]   = useState("all");
  const [activeSection, setActiveSection] = useState<"transactions" | "offers">("transactions");

  useEffect(() => {
    if (transactions.length === 0) {
      dispatch(fetchWallet());
    }
  }, [dispatch, transactions.length]);

  // time-based filter: match against tx.date field
  const filteredTx = txTimeFilter === "all"
    ? transactions
    : transactions.filter(t => t.date === txTimeFilter);

  const handleAddMoney = (amt: number) => {
    dispatch(addMoney(amt));
    setShowAddSheet(false);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >
        {/* ── Sticky Header ── */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { fontFamily: F.displaySemi }]}>My Transactions</Text>

        </View>

        {/* ── Consumer Transaction Stats Card ── */}
        <View style={styles.section}>
          <SpendSummary />
        </View>

        {/* ── Segment Toggle ── */}
        <View style={styles.section}>
          <View style={styles.segmentRow}>
            {(["transactions", "offers"] as const).map((seg) => (
              <TouchableOpacity
                key={seg}
                style={[styles.segmentBtn, activeSection === seg && styles.segmentBtnActive]}
                onPress={() => setActiveSection(seg)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={seg === "transactions" ? "receipt-outline" : "pricetag-outline"}
                  size={15}
                  color={activeSection === seg ? "#FFF" : C.slate}
                  style={{ marginRight: 6 }}
                />
                <Text style={[
                  styles.segmentText,
                  { fontFamily: F.bodySemi },
                  activeSection === seg && { color: "#FFF" },
                ]}>
                  {seg === "transactions" ? "Transactions" : "Offers & Rewards"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Transactions ── */}
        {activeSection === "transactions" && (
          <View style={styles.section}>

            {/* Time-based filter tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTabsContent}
            >
              {TX_TIME_TABS.map((tab) => {
                const active = txTimeFilter === tab.key;
                const count  = tab.key === "all"
                  ? transactions.length
                  : transactions.filter(t => t.date === tab.key).length;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.filterTab, active && styles.filterTabActive]}
                    onPress={() => setTxTimeFilter(tab.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.filterTabText,
                      { fontFamily: active ? F.bodySemi : F.bodyMed },
                      active && { color: C.blue },
                    ]}>
                      {tab.label}
                    </Text>
                    <View style={[
                      styles.filterTabBadge,
                      { backgroundColor: active ? C.blue : C.border },
                    ]}>
                      <Text style={[
                        styles.filterTabBadgeText,
                        { fontFamily: F.bodyBold, color: active ? "#FFF" : C.slateLight },
                      ]}>
                        {count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {filteredTx.length === 0 ? (
              <View style={styles.txEmpty}>
                <MaterialCommunityIcons name="receipt" size={36} color={C.slateLight} />
                <Text style={[styles.txEmptyText, { fontFamily: F.bodyMed }]}>No transactions here</Text>
              </View>
            ) : (
              (() => {
                // group by date for section headers
                const grouped: { date: string; items: Transaction[] }[] = [];
                filteredTx.forEach(tx => {
                  const last = grouped[grouped.length - 1];
                  if (last && last.date === tx.date) {
                    last.items.push(tx);
                  } else {
                    grouped.push({ date: tx.date, items: [tx] });
                  }
                });
                return grouped.map(group => (
                  <View key={group.date}>
                    <View style={styles.dateSep}>
                      <View style={styles.dateSepLine} />
                      <View style={styles.dateSepChip}>
                        <Ionicons name="time-outline" size={11} color={C.blue} />
                        <Text style={[styles.dateSepText, { fontFamily: F.bodySemi }]}>
                          {" "}{group.date}
                        </Text>
                      </View>
                      <View style={styles.dateSepLine} />
                    </View>
                    {group.items.map(tx => <TxRow key={tx.id} tx={tx} />)}
                  </View>
                ));
              })()
            )}
          </View>
        )}

        {/* ── Offers & Rewards ── */}
        {activeSection === "offers" && (
          <View style={styles.section}>
            <View style={styles.cashbackBanner}>
              <View style={styles.cashbackBannerLeft}>
                <View style={styles.cashbackBannerIconWrap}>
                  <MaterialCommunityIcons name="star-four-points" size={22} color={C.goldLight} />
                </View>
                <View>
                  <Text style={[styles.cashbackBannerTitle, { fontFamily: F.displaySemi }]}>
                    ₹60 Cashback Earned
                  </Text>
                  <Text style={[styles.cashbackBannerSub, { fontFamily: F.bodyReg }]}>
                    From 1 completed booking this month
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.cashbackBannerBtn} activeOpacity={0.8}>
                <Text style={[styles.cashbackBannerBtnText, { fontFamily: F.bodySemi }]}>Redeem</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.offersHeading, { fontFamily: F.displaySemi }]}>Available Offers</Text>
            {OFFERS.map(offer => <OfferCard key={offer.id} offer={offer} />)}

            <View style={styles.referralCard}>
              <View style={styles.referralLeft}>
                <MaterialCommunityIcons name="account-multiple-plus" size={28} color={C.blue} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.referralTitle, { fontFamily: F.displaySemi }]}>Refer & Earn ₹100</Text>
                  <Text style={[styles.referralSub,   { fontFamily: F.bodyReg }]}>
                    Share your code — both get rewarded
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.referralBtn} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={15} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={[styles.referralBtnText, { fontFamily: F.bodySemi }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Add Money Bottom Sheet ── */}
      <AddMoneySheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onConfirm={handleAddMoney}
      />
    </View>
  );
}
