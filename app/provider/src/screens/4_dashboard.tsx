// ─────────────────────────────────────────────
//  Screen 4 — Dashboard (Redesigned)
// ─────────────────────────────────────────────

import React, { useState, useCallback, useMemo } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity,
  ListRenderItemInfo, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontWeight, Spacing, Radii, Shadows } from '../theme';
import { StatusChip } from '../components';
import { DASHBOARD_JOBS, DASHBOARD_STATS } from '../hooks/mockData';
import type { RootStackParamList, DashboardJob, FilterOption } from '../types';

type NavProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;
interface Props { navigation: NavProp }

const FILTERS: FilterOption[] = ['All Jobs', 'Today', 'Pending', 'Completed', 'Cancelled'];

// Status color map
const STATUS_COLOR: Record<string, string> = {
  pending:   '#F59E0B',
  new:       '#3B82F6',
  done:      '#10B981',
  cancelled: '#EF4444',
};

// Palette
const HERO_BG   = '#0F172A';
const HERO_CARD = '#1E293B';
const ACCENT    = '#6366F1';

export default function DashboardScreen({ navigation }: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterOption>('All Jobs');
  const stats = DASHBOARD_STATS;

  const filteredJobs = useMemo((): DashboardJob[] => {
    switch (activeFilter) {
      case 'Today':     return DASHBOARD_JOBS.filter((j) => j.timeLabel.startsWith('Today'));
      case 'Pending':   return DASHBOARD_JOBS.filter((j) => j.status === 'pending' || j.status === 'new');
      case 'Completed': return DASHBOARD_JOBS.filter((j) => j.status === 'done');
      case 'Cancelled': return DASHBOARD_JOBS.filter((j) => j.status === 'cancelled');
      default:          return DASHBOARD_JOBS;
    }
  }, [activeFilter]);

  const handleJobPress = useCallback((job: DashboardJob) => {
    if (!job.screen) return;
    navigation.push(job.screen, { bookingId: job.id });
  }, [navigation]);

  const renderJob = useCallback(({ item }: ListRenderItemInfo<DashboardJob>) => (
    <TouchableOpacity
      style={s.jobCard}
      onPress={() => handleJobPress(item)}
      activeOpacity={item.screen ? 0.72 : 1}
    >
      {/* Colored left accent bar */}
      <View style={[s.jobAccent, { backgroundColor: STATUS_COLOR[item.status] ?? '#CBD5E1' }]} />

      {/* Avatar */}
      <View style={[s.jobAvatar, { backgroundColor: item.avatarBg }]}>
        <Text style={[s.jobAvatarTxt, { color: item.avatarText }]}>{item.initials}</Text>
      </View>

      {/* Info */}
      <View style={s.jobInfo}>
        <Text style={s.jobName} numberOfLines={1}>{item.name}</Text>
        <Text style={s.jobType} numberOfLines={1}>{item.jobType}</Text>
        <View style={s.jobMetaRow}>
          <Feather name="clock" size={10} color="#94A3B8" />
          <Text style={s.jobMeta}>{item.timeLabel}</Text>
        </View>
      </View>

      {/* Right */}
      <View style={s.jobRight}>
        <Text style={s.jobAmount}>₹{item.amount.toLocaleString()}</Text>
        <View style={s.statusPill}>
          <View style={[s.statusDot, { backgroundColor: STATUS_COLOR[item.status] ?? '#CBD5E1' }]} />
          <Text style={[s.statusTxt, { color: STATUS_COLOR[item.status] ?? '#94A3B8' }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
        {item.screen && (
          <View style={s.arrowChip}>
            <Feather name="arrow-right" size={11} color={ACCENT} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  ), [handleJobPress]);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={HERO_BG} />

      <FlatList<DashboardJob>
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}

        // ── All header UI lives here so the whole page scrolls together ──
        ListHeaderComponent={
          <>
            {/* ── Hero ──────────────────────── */}
            <View style={s.hero}>

              {/* Top row */}
              <View style={s.heroTop}>
                <View>
                  <Text style={s.heroGreet}>Good morning 👋</Text>
                  <Text style={s.heroName}>Rajesh Kumar</Text>
                </View>
                <TouchableOpacity
                  style={s.avatarBtn}
                  onPress={() => navigation.navigate('MainTabs')}
                >
                  <Text style={s.avatarTxt}>RK</Text>
                  <View style={s.onlineDot} />
                </TouchableOpacity>
              </View>

              {/* Earnings card */}
              <View style={s.earnCard}>
                <View>
                  <Text style={s.earnLbl}>This Month&apos;s Earnings</Text>
                  <Text style={s.earnAmt}>₹{stats.monthEarnings.toLocaleString()}</Text>
                  <View style={s.growthRow}>
                    <View style={s.growthPill}>
                      <Feather name="trending-up" size={11} color="#10B981" />
                      <Text style={s.growthTxt}>+{stats.monthGrowth}%</Text>
                    </View>
                    <Text style={s.vsText}>vs last month</Text>
                  </View>
                </View>
                <View style={s.earnIcon}>
                  <Feather name="dollar-sign" size={24} color="#fff" />
                </View>
              </View>

              {/* Stats strip */}
              <View style={s.statsStrip}>
                <View style={s.statItem}>
                  <Text style={s.statNum}>{stats.jobsDone}</Text>
                  <Text style={s.statLbl}>Jobs Done</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statItem}>
                  <Text style={[s.statNum, { color: '#FBBF24' }]}>{stats.avgRating}★</Text>
                  <Text style={s.statLbl}>Rating</Text>
                </View>
                <View style={s.statDivider} />
                <View style={s.statItem}>
                  <Text style={[s.statNum, { color: '#34D399' }]}>{stats.completionRate}%</Text>
                  <Text style={s.statLbl}>Completion</Text>
                </View>
              </View>
            </View>

            {/* ── Section header ────────────── */}
            <View style={s.sectionRow}>
              <Text style={s.sectionTitle}>Job Requests</Text>
              <Text style={s.sectionCount}>{filteredJobs.length} jobs</Text>
            </View>

            {/* ── Filter chips ──────────────── */}
            <ScrollView
              horizontal
              style={s.filterScroll}
              contentContainerStyle={s.filterContent}
              showsHorizontalScrollIndicator={false}
            >
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[s.chip, activeFilter === f && s.chipActive]}
                  onPress={() => setActiveFilter(f)}
                  activeOpacity={0.75}
                >
                  {activeFilter === f && <View style={s.chipDot} />}
                  <Text style={[s.chipTxt, activeFilter === f && s.chipTxtActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }

        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIconWrap}>
              <Feather name="inbox" size={28} color="#94A3B8" />
            </View>
            <Text style={s.emptyTitle}>No jobs found</Text>
            <Text style={s.emptySub}>Try switching to a different filter</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9'},

  // ── Hero ────────────────────────────────────
  hero: {
    marginTop:50,
    backgroundColor: HERO_BG,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
    borderRadius:32,
    marginBottom: 4,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  heroGreet: { fontSize: 13, color: 'rgba(255,255,255,0.45)', fontWeight: '500', marginBottom: 3 },
  heroName:  { fontSize: 21, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },

  avatarBtn: {
    width: 44, height: 44,
    borderRadius: 14,
    backgroundColor: ACCENT,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarTxt: { fontSize: 14, fontWeight: '800', color: '#fff' },
  onlineDot: {
    position: 'absolute', bottom: 3, right: 3,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2, borderColor: HERO_BG,
  },

  // Earnings card
  earnCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: HERO_CARD,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  earnLbl:  { fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: '500', marginBottom: 5 },
  earnAmt:  { fontSize: 30, fontWeight: '800', color: '#fff', letterSpacing: -1, marginBottom: 10 },
  growthRow:{ flexDirection: 'row', alignItems: 'center', gap: 8 },
  growthPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(16,185,129,0.15)',
    paddingVertical: 4, paddingHorizontal: 9,
    borderRadius: 20,
  },
  growthTxt: { fontSize: 12, fontWeight: '700', color: '#10B981' },
  vsText:    { fontSize: 12, color: 'rgba(255,255,255,0.3)' },
  earnIcon: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: ACCENT,
    justifyContent: 'center', alignItems: 'center',
  },

  // Stats strip
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: HERO_CARD,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    overflow: 'hidden',
  },
  statItem:    { flex: 1, alignItems: 'center', paddingVertical: 13 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 10 },
  statNum:     { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  statLbl:     { fontSize: 10, color: 'rgba(255,255,255,0.38)', fontWeight: '600', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── Section row ───────────────────────────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 2,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  sectionCount: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },

  // ── Filter chips ──────────────────────────
  filterScroll:  { flexShrink: 0, marginTop: 10, marginBottom: 4 },
  filterContent: { paddingHorizontal: 20, gap: 8, alignItems: 'center' },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  chipActive:    { backgroundColor: HERO_BG, borderColor: HERO_BG },
  chipDot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  chipTxt:       { fontSize: 12, fontWeight: '600', color: '#64748B', lineHeight: 18 },
  chipTxtActive: { color: '#fff', lineHeight: 18 },

  // ── Job cards ─────────────────────────────
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 28, gap: 10 },
  jobCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
    overflow: 'hidden',
  },
  jobAccent:    { width: 3, height: 46, borderRadius: 2, flexShrink: 0 },
  jobAvatar:    { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  jobAvatarTxt: { fontSize: 13, fontWeight: '700' },
  jobInfo:      { flex: 1, gap: 3 },
  jobName:      { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  jobType:      { fontSize: 12, color: '#64748B', fontWeight: '500' },
  jobMetaRow:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  jobMeta:      { fontSize: 11, color: '#94A3B8' },

  jobRight:  { alignItems: 'flex-end', gap: 5 },
  jobAmount: { fontSize: 14, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusDot:  { width: 6, height: 6, borderRadius: 3 },
  statusTxt:  { fontSize: 11, fontWeight: '600' },
  arrowChip: {
    width: 24, height: 24, borderRadius: 7,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Empty ─────────────────────────────────
  empty:        { paddingTop: 52, alignItems: 'center', gap: 10 },
  emptyIconWrap:{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  emptyTitle:   { fontSize: 15, fontWeight: '700', color: '#334155' },
  emptySub:     { fontSize: 13, color: '#94A3B8' },
});