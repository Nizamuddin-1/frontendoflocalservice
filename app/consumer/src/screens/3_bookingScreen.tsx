/**
 * BookingsScreen.tsx
 *
 * Phase 3 (modularization): the inline components (StarRow, Avatar, StatusBadge,
 * ActionBtn, BookingCard, SummaryStats), design tokens, types, mock data and the
 * shared StyleSheet were extracted to src/. This screen now composes the bookings
 * feature components. UI & behavior unchanged.
 *   • Components / styles / tokens → @/src/components/bookings
 *   • Mock data                    → @/src/services/mock
 *   • Types                        → @/src/types
 */

import React, { useState } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  C,
  F,
  styles,
  BookingCard,
  SummaryStats,
} from "@/src/components/bookings";
import { ALL_BOOKINGS } from "@/src/services/mock";
import type { BookingStatus } from "@/src/types";

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "ongoing",   label: "Active"    },
  { key: "upcoming",  label: "Upcoming"  },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");

  const filtered = activeTab === "all"
    ? ALL_BOOKINGS
    : ALL_BOOKINGS.filter((b) => b.status === activeTab);

  // Group by status for SectionList
  const sections =
    activeTab === "all"
      ? [
          { title: "🟢  Active Now",  data: filtered.filter(b => b.status === "ongoing")   },
          { title: "🔵  Upcoming",    data: filtered.filter(b => b.status === "upcoming")  },
          { title: "✅  Completed",   data: filtered.filter(b => b.status === "completed") },
          { title: "❌  Cancelled",   data: filtered.filter(b => b.status === "cancelled") },
        ].filter((s) => s.data.length > 0)
      : [{ title: "", data: filtered }];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { fontFamily: F.displayBold }]}>My Bookings</Text>
            <Text style={[styles.headerSub,   { fontFamily: F.bodyRegular }]}>
              {ALL_BOOKINGS.length} total bookings
            </Text>
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.75}>
            <Ionicons name="options-outline" size={20} color={C.navy} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <SummaryStats />

        {/* Tab Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.tabText,
                  { fontFamily: active ? F.bodySemi : F.bodyMedium },
                  active && styles.tabTextActive,
                ]}>
                  {tab.label}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── List ── */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        renderSectionHeader={({ section: { title } }) =>
          title ? (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeaderText, { fontFamily: F.bodySemi }]}>{title}</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="receipt-outline" size={40} color={C.slateLight} />
            </View>
            <Text style={[styles.emptyTitle, { fontFamily: F.displaySemi }]}>No bookings here</Text>
            <Text style={[styles.emptySub,   { fontFamily: F.bodyRegular  }]}>
              Your {activeTab !== "all" ? activeTab : ""} bookings will appear here
            </Text>
            <TouchableOpacity style={styles.emptyBtn} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={[styles.emptyBtnText, { fontFamily: F.bodySemi }]}>Book a Service</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}
