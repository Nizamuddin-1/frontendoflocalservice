// ─── Filter Bottom Sheet ──────────────────────────────────────────────────────
// Extracted from 2_servicesScreen.tsx (services feature).
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { C, F } from './tokens';
import { styles } from './services.styles';
import { SORT_OPTIONS } from '@/src/services/mock';
import type { SortMode } from '@/src/types';

export interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({ visible, onClose }) => {
  const slide = useRef(new Animated.Value(520)).current;
  const fade  = useRef(new Animated.Value(0)).current;
  const [sort, setSort]           = useState<SortMode>("popular");
  const [minRating, setMinRating] = useState(0);
  const [verified, setVerified]   = useState(false);
  const [sameDay, setSameDay]     = useState(false);
  const [maxPrice, setMaxPrice]   = useState(5000);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slide, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 2 }),
        Animated.timing(fade,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slide, { toValue: 520, duration: 250, useNativeDriver: true }),
        Animated.timing(fade,  { toValue: 0,   duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const priceMarkers = [500, 1000, 2000, 3500, 5000];

  return (
    <Animated.View style={[styles.sheetOverlay, { opacity: fade }]}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.filterSheet, { transform: [{ translateY: slide }] }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeaderRow}>
          <Text style={[styles.sheetTitle, { fontFamily: F.displaySemi }]}>Refine Results</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={styles.sheetResetBtn}
              onPress={() => { setSort("popular"); setMinRating(0); setVerified(false); setSameDay(false); setMaxPrice(5000); }}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh-outline" size={13} color={C.terra} style={{ marginRight: 4 }} />
              <Text style={[styles.sheetResetText, { fontFamily: F.bodySemi }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetCloseBtn} onPress={onClose} activeOpacity={0.75}>
              <Ionicons name="close" size={17} color={C.inkLight} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <Text style={[styles.sheetSectionLabel, { fontFamily: F.bodySemi }]}>Sort by</Text>
          <View style={styles.sheetSortRow}>
            {SORT_OPTIONS.map((opt) => {
              const active = sort === opt.key;
              return (
                <TouchableOpacity key={opt.key} style={[styles.sheetSortChip, active && styles.sheetSortChipActive]} onPress={() => setSort(opt.key)} activeOpacity={0.75}>
                  <Ionicons name={opt.icon as any} size={13} color={active ? "#FFF" : C.inkLight} style={{ marginRight: 5 }} />
                  <Text style={[styles.sheetSortChipText, { fontFamily: active ? F.bodySemi : F.bodyMed }, active && { color: "#FFF" }]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sheetSectionLabel, { fontFamily: F.bodySemi }]}>Minimum Rating</Text>
          <View style={styles.sheetRatingRow}>
            {[0, 3, 3.5, 4, 4.5].map((r) => {
              const active = minRating === r;
              return (
                <TouchableOpacity key={r} style={[styles.sheetRatingChip, active && styles.sheetRatingChipActive]} onPress={() => setMinRating(r)} activeOpacity={0.75}>
                  {r > 0 && <Ionicons name="star" size={11} color={active ? "#FFF" : "#D4A853"} style={{ marginRight: 3 }} />}
                  <Text style={[styles.sheetRatingChipText, { fontFamily: active ? F.bodySemi : F.bodyMed }, active && { color: "#FFF" }]}>{r === 0 ? "Any" : `${r}+`}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sheetSectionLabel, { fontFamily: F.bodySemi }]}>Max Price</Text>
          <View style={styles.sheetPriceRow}>
            {priceMarkers.map((p) => {
              const active = maxPrice === p;
              return (
                <TouchableOpacity key={p} style={[styles.sheetPriceChip, active && styles.sheetPriceChipActive]} onPress={() => setMaxPrice(p)} activeOpacity={0.75}>
                  <Text style={[styles.sheetPriceChipText, { fontFamily: active ? F.bodySemi : F.bodyMed }, active && { color: "#FFF" }]}>₹{p >= 1000 ? `${p / 1000}k` : p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {[
            { key: "verified", label: "Verified Providers Only", sub: "Background-checked & licensed", icon: "shield-checkmark-outline", color: C.sage,   val: verified, set: () => setVerified(!verified) },
            { key: "sameday",  label: "Same-Day Availability",   sub: "Book and get service today",    icon: "flash-outline",            color: C.cobalt, val: sameDay,  set: () => setSameDay(!sameDay)   },
          ].map((row) => (
            <TouchableOpacity key={row.key} style={styles.sheetToggleRow} onPress={row.set} activeOpacity={0.8}>
              <View style={[styles.sheetToggleIcon, { backgroundColor: row.color + "18" }]}>
                <Ionicons name={row.icon as any} size={16} color={row.color} />
              </View>
              <View style={styles.sheetToggleText}>
                <Text style={[styles.sheetToggleLabel, { fontFamily: F.bodySemi }]}>{row.label}</Text>
                <Text style={[styles.sheetToggleSub,   { fontFamily: F.bodyReg  }]}>{row.sub}</Text>
              </View>
              <View style={[styles.toggleTrack, { backgroundColor: row.val ? row.color + "35" : C.ruleLight }]}>
                <View style={[styles.toggleThumb, { backgroundColor: row.val ? row.color : C.inkFaint, alignSelf: row.val ? "flex-end" : "flex-start" }]} />
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 10 }} />
        </ScrollView>

        <TouchableOpacity style={styles.sheetApplyBtn} onPress={onClose} activeOpacity={0.85}>
          <Ionicons name="checkmark-done-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={[styles.sheetApplyText, { fontFamily: F.bodySemi }]}>Apply Filters</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default FilterSheet;
