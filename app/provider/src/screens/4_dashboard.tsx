// ─────────────────────────────────────────────
//  Screen 4 — Dashboard (Redesigned with Services & Modals)
// ─────────────────────────────────────────────

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View, Text, FlatList, ScrollView, TouchableOpacity,
  ListRenderItemInfo, StyleSheet, StatusBar, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontWeight, Spacing, Radii, Shadows } from '../theme';
import { StatusChip } from '../components';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import { providerDashboardSetFilter, fetchProviderDashboard, fetchProviderProfile } from '@/src/redux/actions/appActions';
import { providerApi } from '@/src/services/api/endpoints/provider';
import { ServiceFormModal } from '@/src/components/provider/ServiceFormModal';
import { VariationFormModal, VariationData } from '@/src/components/provider/VariationFormModal';
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
  const dispatch = useAppDispatch();
  const { stats, jobs: DASHBOARD_JOBS, isLoading, error } = useAppSelector((s) => s.provider.dashboard);
  const { data: profile } = useAppSelector((s) => s.provider.profile);
  
  const [activeView, setActiveView] = useState<'jobs' | 'services'>('jobs');
  const [localFilter, setLocalFilter] = useState<FilterOption>('All Jobs');

  // Services & Variations Management State
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Modals State
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [variationModalVisible, setVariationModalVisible] = useState(false);
  const [selectedServiceForVariation, setSelectedServiceForVariation] = useState<{ id: string; name: string } | null>(null);
  const [selectedVariationForEdit, setSelectedVariationForEdit] = useState<VariationData | null>(null);

  const providerName = profile?.name || 'Professional';
  const providerInitials = profile?.initials || (profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'PR');

  const loadServices = useCallback(async () => {
    setLoadingServices(true);
    try {
      const data = await providerApi.getServices();
      setServices(data);
    } catch (err) {
      console.warn('[Dashboard] Error fetching provider services:', err);
    } finally {
      setLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProviderDashboard() as any);
    dispatch(fetchProviderProfile() as any);
    loadServices();

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchProviderDashboard() as any);
      dispatch(fetchProviderProfile() as any);
      loadServices();
    });
    return unsubscribe;
  }, [dispatch, navigation, loadServices]);

  const filteredJobs = useMemo((): DashboardJob[] => {
    switch (localFilter) {
      case 'Today':     return DASHBOARD_JOBS.filter((j) => j.timeLabel.startsWith('Today'));
      case 'Pending':   return DASHBOARD_JOBS.filter((j) => j.status === 'pending' || j.status === 'new');
      case 'Completed': return DASHBOARD_JOBS.filter((j) => j.status === 'done');
      case 'Cancelled': return DASHBOARD_JOBS.filter((j) => j.status === 'cancelled');
      default:          return DASHBOARD_JOBS;
    }
  }, [localFilter, DASHBOARD_JOBS]);

  const handleJobPress = useCallback((job: DashboardJob) => {
    if (!job.screen) return;
    navigation.push(job.screen as any, { bookingId: job.id } as any);
  }, [navigation]);

  // Open Create Variation Modal
  const handleOpenAddVariation = (service: any) => {
    setSelectedServiceForVariation({
      id: service._id || service.id,
      name: service.name,
    });
    setSelectedVariationForEdit(null);
    setVariationModalVisible(true);
  };

  // Open Edit Variation Modal
  const handleOpenEditVariation = (service: any, variation: any) => {
    setSelectedServiceForVariation({
      id: service._id || service.id,
      name: service.name,
    });
    setSelectedVariationForEdit({
      _id: variation._id || variation.id,
      label: variation.label,
      desc: variation.desc || '',
      price: variation.price,
      duration: variation.duration || '45 mins',
      popular: variation.popular,
      mcIcon: variation.mcIcon,
    });
    setVariationModalVisible(true);
  };

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
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={HERO_BG} />

      {isLoading ? (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={ACCENT} />
        </View>
      ) : error ? (
        <View style={s.errorContainer}>
          <Feather name="alert-circle" size={40} color="#EF4444" />
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={() => dispatch(fetchProviderDashboard() as any)}>
            <Text style={s.retryTxt}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList<any>
            data={activeView === 'jobs' ? filteredJobs : services}
            keyExtractor={(item) => item._id || item.id}
            renderItem={activeView === 'jobs' ? renderJob : ({ item }) => (
              <View style={s.serviceCard}>
                <View style={s.serviceHeader}>
                  <View style={s.serviceIconWrap}>
                    <Feather name={(item.mcIcon as any) || 'tool'} size={20} color="#4F46E5" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.serviceName}>{item.name}</Text>
                    <Text style={s.serviceCat}>{item.categoryLabel || 'Service'}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.servicePrice}>₹{item.price}</Text>
                    <Text style={s.serviceEta}>⏱ {item.eta}</Text>
                  </View>
                </View>

                {item.shortDesc ? (
                  <Text style={s.serviceDesc} numberOfLines={2}>
                    {item.shortDesc}
                  </Text>
                ) : null}

                {/* Variations Section */}
                <View style={s.variationsSection}>
                  <View style={s.varHeaderRow}>
                    <Text style={s.varHeaderTitle}>
                      Variations ({item.variations?.length || 0})
                    </Text>
                    <TouchableOpacity
                      style={s.addVarBtn}
                      onPress={() => handleOpenAddVariation(item)}
                      activeOpacity={0.75}
                    >
                      <Feather name="plus" size={13} color="#4F46E5" />
                      <Text style={s.addVarBtnTxt}>Add Variation</Text>
                    </TouchableOpacity>
                  </View>

                  {Array.isArray(item.variations) && item.variations.length > 0 ? (
                    item.variations.map((v: any) => (
                      <View key={v._id || v.id} style={s.varRow}>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={s.varLabel}>{v.label}</Text>
                            {v.popular && (
                              <View style={s.popularTag}>
                                <Text style={s.popularTagTxt}>Popular</Text>
                              </View>
                            )}
                          </View>
                          <Text style={s.varSub}>{v.duration} · ₹{v.price}</Text>
                          {v.desc ? <Text style={s.varDesc} numberOfLines={1}>{v.desc}</Text> : null}
                        </View>
                        <TouchableOpacity
                          style={s.editVarBtn}
                          onPress={() => handleOpenEditVariation(item, v)}
                          activeOpacity={0.7}
                        >
                          <Feather name="edit-2" size={14} color="#6366F1" />
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={s.noVarsTxt}>No pricing variations defined for this service.</Text>
                  )}
                </View>
              </View>
            )}
            refreshing={isLoading || loadingServices}
            onRefresh={() => {
              dispatch(fetchProviderDashboard() as any);
              loadServices();
            }}
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
                      <Text style={s.heroName}>{providerName}</Text>
                    </View>
                    <TouchableOpacity
                      style={s.avatarBtn}
                      onPress={() => navigation.navigate('Profile' as any)}
                    >
                      <Text style={s.avatarTxt}>{providerInitials}</Text>
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

                {/* ── Main View Switcher (Job Requests vs My Services) ── */}
                <View style={s.viewToggleContainer}>
                  <TouchableOpacity
                    style={[s.viewTab, activeView === 'jobs' && s.viewTabActive]}
                    onPress={() => setActiveView('jobs')}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="briefcase"
                      size={15}
                      color={activeView === 'jobs' ? '#FFFFFF' : '#64748B'}
                    />
                    <Text style={[s.viewTabTxt, activeView === 'jobs' && s.viewTabTxtActive]}>
                      Job Requests ({filteredJobs.length})
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[s.viewTab, activeView === 'services' && s.viewTabActive]}
                    onPress={() => setActiveView('services')}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="layers"
                      size={15}
                      color={activeView === 'services' ? '#FFFFFF' : '#64748B'}
                    />
                    <Text style={[s.viewTabTxt, activeView === 'services' && s.viewTabTxtActive]}>
                      My Services ({services.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ── Context Row / Filters ── */}
                {activeView === 'jobs' ? (
                  <>
                    <View style={s.sectionRow}>
                      <Text style={s.sectionTitle}>Job Requests</Text>
                      <Text style={s.sectionCount}>{filteredJobs.length} jobs</Text>
                    </View>

                    {/* Filter chips */}
                    <ScrollView
                      horizontal
                      style={s.filterScroll}
                      contentContainerStyle={s.filterContent}
                      showsHorizontalScrollIndicator={false}
                    >
                      {FILTERS.map((f) => (
                        <TouchableOpacity
                          key={f}
                          style={[s.chip, localFilter === f && s.chipActive]}
                          onPress={() => {
                            setLocalFilter(f);
                            dispatch(providerDashboardSetFilter(f));
                          }}
                          activeOpacity={0.75}
                        >
                          {localFilter === f && <View style={s.chipDot} />}
                          <Text style={[s.chipTxt, localFilter === f && s.chipTxtActive]}>{f}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </>
                ) : (
                  <View style={s.servicesBar}>
                    <View>
                      <Text style={s.sectionTitle}>Published Offerings</Text>
                      <Text style={s.sectionCount}>Visible to local consumers for bookings</Text>
                    </View>
                    <TouchableOpacity
                      style={s.topAddServiceBtn}
                      onPress={() => setServiceModalVisible(true)}
                      activeOpacity={0.8}
                    >
                      <Feather name="plus-circle" size={15} color="#FFFFFF" />
                      <Text style={s.topAddServiceTxt}>Add Service</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            }

            ListEmptyComponent={
              <View style={s.empty}>
                <View style={s.emptyIconWrap}>
                  <Feather
                    name={activeView === 'jobs' ? 'inbox' : 'package'}
                    size={28}
                    color="#94A3B8"
                  />
                </View>
                <Text style={s.emptyTitle}>
                  {activeView === 'jobs' ? 'No jobs found' : 'No services added yet'}
                </Text>
                <Text style={s.emptySub}>
                  {activeView === 'jobs'
                    ? 'Try switching to a different filter'
                    : 'Tap "Add Service" to create your first catalog offering'}
                </Text>
                {activeView === 'services' && (
                  <TouchableOpacity
                    style={s.emptyActionBtn}
                    onPress={() => setServiceModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Feather name="plus" size={15} color="#FFFFFF" />
                    <Text style={s.emptyActionTxt}>Add Your First Service</Text>
                  </TouchableOpacity>
                )}
              </View>
            }
          />

          {/* Floating Action Button (FAB) for Creating Services */}
          <TouchableOpacity
            style={s.fabBtn}
            onPress={() => setServiceModalVisible(true)}
            activeOpacity={0.85}
          >
            <Feather name="plus" size={20} color="#FFFFFF" />
            <Text style={s.fabTxt}>New Service</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Popups (Modals) */}
      <ServiceFormModal
        visible={serviceModalVisible}
        onClose={() => setServiceModalVisible(false)}
        onSuccess={loadServices}
      />

      <VariationFormModal
        visible={variationModalVisible}
        serviceId={selectedServiceForVariation?.id || ''}
        serviceName={selectedServiceForVariation?.name}
        initialVariation={selectedVariationForEdit}
        onClose={() => {
          setVariationModalVisible(false);
          setSelectedServiceForVariation(null);
          setSelectedVariationForEdit(null);
        }}
        onSuccess={loadServices}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },

  // ── Hero ────────────────────────────────────
  hero: {
    backgroundColor: HERO_BG,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderRadius: 28,
    marginBottom: 8,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
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
  earnAmt:  { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -1, marginBottom: 10 },
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
    width: 50, height: 50, borderRadius: 25,
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
  statItem:    { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 8 },
  statNum:     { fontSize: 18, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  statLbl:     { fontSize: 10, color: 'rgba(255,255,255,0.38)', fontWeight: '600', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── View Toggle ───────────────────────────
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 4,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  viewTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
  },
  viewTabActive: {
    backgroundColor: '#0F172A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  viewTabTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  viewTabTxtActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── Section row ───────────────────────────
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 4,
  },
  servicesBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3 },
  sectionCount: { fontSize: 12, fontWeight: '500', color: '#64748B', marginTop: 2 },
  topAddServiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 5,
  },
  topAddServiceTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Filter chips ──────────────────────────
  filterScroll:  { flexShrink: 0, marginTop: 6, marginBottom: 8 },
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
  listContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 90, gap: 10 },
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

  // ── Service Cards ─────────────────────────
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  serviceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  serviceCat: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46E5',
  },
  serviceEta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  serviceDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 10,
  },
  variationsSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  varHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  varHeaderTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  addVarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  addVarBtnTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  varRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 6,
  },
  varLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  popularTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularTagTxt: {
    fontSize: 9,
    fontWeight: '700',
    color: '#B45309',
    textTransform: 'uppercase',
  },
  varSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
    marginTop: 2,
  },
  varDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  editVarBtn: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noVarsTxt: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 4,
  },

  // ── Empty ─────────────────────────────────
  empty:        { paddingTop: 40, alignItems: 'center', gap: 10 },
  emptyIconWrap:{ width: 64, height: 64, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0' },
  emptyTitle:   { fontSize: 15, fontWeight: '700', color: '#334155' },
  emptySub:     { fontSize: 13, color: '#94A3B8', textAlign: 'center', paddingHorizontal: 20 },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 6,
    gap: 6,
  },
  emptyActionTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── FAB ───────────────────────────────────
  fabBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 30,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    gap: 6,
  },
  fabTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Loading & Error ───────────────────────
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 12 },
  errorText: { fontSize: 16, color: '#EF4444', textAlign: 'center', fontWeight: '500' },
  retryBtn: { marginTop: 10, backgroundColor: ACCENT, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryTxt: { color: '#fff', fontWeight: '600', fontSize: 14 },
});