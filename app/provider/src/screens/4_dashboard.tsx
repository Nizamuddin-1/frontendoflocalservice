// ─────────────────────────────────────────────
//  Screen 4 — Dashboard (Professional Redesign)
//  Styled to match Consumer Bookings visual language
// ─────────────────────────────────────────────

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ListRenderItemInfo,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import {
  providerDashboardSetFilter,
  fetchProviderDashboard,
  fetchProviderProfile,
} from '@/src/redux/actions/appActions';
import { providerApi } from '@/src/services/api/endpoints/provider';
import { ServiceFormModal } from '@/src/components/provider/ServiceFormModal';
import { VariationFormModal, VariationData } from '@/src/components/provider/VariationFormModal';
import type { RootStackParamList, DashboardJob, FilterOption } from '../types';

type NavProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;
interface Props {
  navigation: NavProp;
}

const FILTERS: FilterOption[] = ['All Jobs', 'Today', 'Pending', 'Completed', 'Cancelled'];

// Theme color tokens matching Consumer Bookings screen
const C = {
  bg: '#F0F2F8',
  surface: '#FFFFFF',
  navy: '#0A1628',
  slate: '#64748B',
  slateLight: '#94A3B8',
  border: '#E2E8F4',
  borderLight: '#EEF1F8',
  blue: '#1A73E8',
  blueBg: '#EFF6FF',
  green: '#0AB87A',
  greenBg: '#ECFDF5',
  amber: '#F59E0B',
  amberBg: '#FFFBEB',
  red: '#EF4444',
  redBg: '#FEF2F2',
};

// Status styling configuration
const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    bg: '#FFFBEB',
    text: '#D97706',
    dot: '#F59E0B',
    icon: 'time-outline',
  },
  new: {
    label: 'New Request',
    bg: '#EFF6FF',
    text: '#1D4ED8',
    dot: '#2563EB',
    icon: 'flash-outline',
  },
  done: {
    label: 'Completed',
    bg: '#ECFDF5',
    text: '#059669',
    dot: '#10B981',
    icon: 'checkmark-circle-outline',
  },
  cancelled: {
    label: 'Cancelled',
    bg: '#FEF2F2',
    text: '#DC2626',
    dot: '#EF4444',
    icon: 'close-circle-outline',
  },
};

export default function DashboardScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { stats, jobs: DASHBOARD_JOBS, isLoading, error } = useAppSelector(
    (s) => s.provider.dashboard
  );
  const { data: profile } = useAppSelector((s) => s.provider.profile);

  const [activeView, setActiveView] = useState<'jobs' | 'services'>('jobs');
  const [localFilter, setLocalFilter] = useState<FilterOption>('All Jobs');

  // Services & Variations Management State
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Modals State
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [variationModalVisible, setVariationModalVisible] = useState(false);
  const [selectedServiceForVariation, setSelectedServiceForVariation] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedVariationForEdit, setSelectedVariationForEdit] = useState<VariationData | null>(
    null
  );

  const providerName = profile?.name || 'Professional';
  const providerInitials =
    profile?.initials || (profile?.name ? profile.name.slice(0, 2).toUpperCase() : 'PR');

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
      case 'Today':
        return DASHBOARD_JOBS.filter((j) => j.timeLabel.startsWith('Today'));
      case 'Pending':
        return DASHBOARD_JOBS.filter((j) => j.status === 'pending' || j.status === 'new');
      case 'Completed':
        return DASHBOARD_JOBS.filter((j) => j.status === 'done');
      case 'Cancelled':
        return DASHBOARD_JOBS.filter((j) => j.status === 'cancelled');
      default:
        return DASHBOARD_JOBS;
    }
  }, [localFilter, DASHBOARD_JOBS]);

  const handleJobPress = useCallback(
    (job: DashboardJob) => {
      if (!job.screen) return;
      navigation.push(job.screen as any, { bookingId: job.id } as any);
    },
    [navigation]
  );

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

  const renderJob = useCallback(
    ({ item }: ListRenderItemInfo<DashboardJob>) => {
      const statusConfig = STATUS_CONFIG[item.status] || {
        label: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        bg: '#F1F5F9',
        text: '#475569',
        dot: '#94A3B8',
        icon: 'ellipse-outline',
      };

      return (
        <TouchableOpacity
          style={s.jobCard}
          onPress={() => handleJobPress(item)}
          activeOpacity={item.screen ? 0.75 : 1}
        >
          {/* Top Row: Avatar, Names & Status */}
          <View style={s.jobTopRow}>
            {/* Avatar */}
            <View style={[s.jobAvatar, { backgroundColor: item.avatarBg || C.blueBg }]}>
              <Text style={[s.jobAvatarTxt, { color: item.avatarText || C.blue }]}>
                {item.initials}
              </Text>
            </View>

            {/* Info */}
            <View style={s.jobInfo}>
              <Text style={s.jobName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={s.jobType} numberOfLines={1}>
                {item.jobType}
              </Text>
            </View>

            {/* Status Pill */}
            <View style={[s.statusBadge, { backgroundColor: statusConfig.bg }]}>
              <View style={[s.statusDot, { backgroundColor: statusConfig.dot }]} />
              <Text style={[s.statusText, { color: statusConfig.text }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={s.cardDivider} />

          {/* Bottom Row: Time label, Price & Action */}
          <View style={s.jobBottomRow}>
            <View style={s.timeRow}>
              <Ionicons name="time-outline" size={14} color={C.slateLight} style={{ marginRight: 5 }} />
              <Text style={s.timeText}>{item.timeLabel}</Text>
            </View>

            <View style={s.priceRow}>
              <Text style={s.amountLabel}>Total</Text>
              <Text style={s.amountText}>₹{item.amount.toLocaleString()}</Text>
              {item.screen && (
                <View style={s.arrowWrap}>
                  <Ionicons name="chevron-forward" size={15} color={C.navy} />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [handleJobPress]
  );

  return (
    <SafeAreaView style={s.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {isLoading ? (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={C.navy} />
          <Text style={s.loadingText}>Loading dashboard...</Text>
        </View>
      ) : error ? (
        <View style={s.errorContainer}>
          <View style={s.errorIconWrap}>
            <Ionicons name="alert-circle-outline" size={38} color={C.red} />
          </View>
          <Text style={s.errorTitle}>Unable to load dashboard</Text>
          <Text style={s.errorText}>{error}</Text>
          <TouchableOpacity
            style={s.retryBtn}
            onPress={() => dispatch(fetchProviderDashboard() as any)}
            activeOpacity={0.8}
          >
            <Ionicons name="refresh-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={s.retryTxt}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList<any>
            data={activeView === 'jobs' ? filteredJobs : services}
            keyExtractor={(item) => item._id || item.id}
            renderItem={
              activeView === 'jobs'
                ? renderJob
                : ({ item }) => (
                    <View style={s.serviceCard}>
                      <View style={s.serviceHeader}>
                        <View style={s.serviceIconWrap}>
                          <Ionicons name="construct-outline" size={20} color={C.navy} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={s.serviceName}>{item.name}</Text>
                          <Text style={s.serviceCat}>{item.categoryLabel || 'Service'}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={s.servicePrice}>₹{item.price}</Text>
                          <View style={s.etaWrap}>
                            <Ionicons name="hourglass-outline" size={11} color={C.slateLight} style={{ marginRight: 3 }} />
                            <Text style={s.serviceEta}>{item.eta}</Text>
                          </View>
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
                            Pricing Variations ({item.variations?.length || 0})
                          </Text>
                          <TouchableOpacity
                            style={s.addVarBtn}
                            onPress={() => handleOpenAddVariation(item)}
                            activeOpacity={0.75}
                          >
                            <Ionicons name="add" size={14} color={C.navy} />
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
                                <Text style={s.varSub}>
                                  {v.duration} · ₹{v.price}
                                </Text>
                                {v.desc ? (
                                  <Text style={s.varDesc} numberOfLines={1}>
                                    {v.desc}
                                  </Text>
                                ) : null}
                              </View>
                              <TouchableOpacity
                                style={s.editVarBtn}
                                onPress={() => handleOpenEditVariation(item, v)}
                                activeOpacity={0.7}
                              >
                                <Ionicons name="pencil" size={13} color={C.navy} />
                              </TouchableOpacity>
                            </View>
                          ))
                        ) : (
                          <Text style={s.noVarsTxt}>No pricing variations defined for this service.</Text>
                        )}
                      </View>
                    </View>
                  )
            }
            refreshing={isLoading || loadingServices}
            onRefresh={() => {
              dispatch(fetchProviderDashboard() as any);
              loadServices();
            }}
            contentContainerStyle={s.listContent}
            showsVerticalScrollIndicator={false}
            // ── Header UI ──
            ListHeaderComponent={
              <>
                {/* ── Top Header Greeting ── */}
                <View style={s.topGreetingRow}>
                  <View>
                    <Text style={s.greetingLabel}>Good day,</Text>
                    <Text style={s.greetingName}>{providerName}</Text>
                  </View>
                  <TouchableOpacity
                    style={s.avatarBtn}
                    onPress={() => navigation.navigate('Profile' as any)}
                    activeOpacity={0.85}
                  >
                    <Text style={s.avatarTxt}>{providerInitials}</Text>
                    <View style={s.onlineDot} />
                  </TouchableOpacity>
                </View>

                {/* ── Hero Earnings Card ── */}
                <View style={s.earnCard}>
                  <View style={s.earnCardTop}>
                    <View>
                      <Text style={s.earnLabel}>THIS MONTH&apos;S EARNINGS</Text>
                      <Text style={s.earnAmount}>₹{stats.monthEarnings.toLocaleString()}</Text>
                    </View>
                    <View style={s.earnIconWrap}>
                      <Ionicons name="wallet-outline" size={24} color={C.navy} />
                    </View>
                  </View>

                  <View style={s.growthRow}>
                    <View style={s.growthPill}>
                      <Ionicons name="trending-up" size={13} color="#059669" />
                      <Text style={s.growthTxt}>+{stats.monthGrowth}%</Text>
                    </View>
                    <Text style={s.vsText}>vs last month</Text>
                  </View>
                </View>

                {/* ── Summary Stats Strip ── */}
                <View style={s.statsStrip}>
                  <View style={s.statItem}>
                    <View style={s.statIconCircle}>
                      <Ionicons name="briefcase-outline" size={16} color={C.navy} />
                    </View>
                    <Text style={s.statNum}>{stats.jobsDone}</Text>
                    <Text style={s.statLbl}>JOBS DONE</Text>
                  </View>

                  <View style={s.statDivider} />

                  <View style={s.statItem}>
                    <View style={s.statIconCircle}>
                      <Ionicons name="star" size={15} color="#F59E0B" />
                    </View>
                    <Text style={[s.statNum, { color: C.navy }]}>{stats.avgRating}★</Text>
                    <Text style={s.statLbl}>RATING</Text>
                  </View>

                  <View style={s.statDivider} />

                  <View style={s.statItem}>
                    <View style={s.statIconCircle}>
                      <Ionicons name="shield-checkmark-outline" size={16} color="#059669" />
                    </View>
                    <Text style={[s.statNum, { color: '#059669' }]}>{stats.completionRate}%</Text>
                    <Text style={s.statLbl}>COMPLETION</Text>
                  </View>
                </View>

                {/* ── View Toggle Switcher ── */}
                <View style={s.viewToggleContainer}>
                  <TouchableOpacity
                    style={[s.viewTab, activeView === 'jobs' && s.viewTabActive]}
                    onPress={() => setActiveView('jobs')}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name="briefcase"
                      size={15}
                      color={activeView === 'jobs' ? '#FFFFFF' : C.slate}
                      style={{ marginRight: 6 }}
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
                    <Ionicons
                      name="layers"
                      size={15}
                      color={activeView === 'services' ? '#FFFFFF' : C.slate}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[s.viewTabTxt, activeView === 'services' && s.viewTabTxtActive]}>
                      My Services ({services.length})
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ── Subheader / Filters ── */}
                {activeView === 'jobs' ? (
                  <>
                    <View style={s.sectionHeaderRow}>
                      <Text style={s.sectionTitle}>Recent Requests</Text>
                      <Text style={s.sectionCount}>{filteredJobs.length} total</Text>
                    </View>

                    {/* Filter chips */}
                    <ScrollView
                      horizontal
                      style={s.filterScroll}
                      contentContainerStyle={s.filterContent}
                      showsHorizontalScrollIndicator={false}
                    >
                      {FILTERS.map((f) => {
                        const isActive = localFilter === f;
                        return (
                          <TouchableOpacity
                            key={f}
                            style={[s.chip, isActive && s.chipActive]}
                            onPress={() => {
                              setLocalFilter(f);
                              dispatch(providerDashboardSetFilter(f));
                            }}
                            activeOpacity={0.75}
                          >
                            {isActive && <View style={s.chipDot} />}
                            <Text style={[s.chipTxt, isActive && s.chipTxtActive]}>{f}</Text>
                          </TouchableOpacity>
                        );
                      })}
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
                      activeOpacity={0.85}
                    >
                      <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                      <Text style={s.topAddServiceTxt}>Add Service</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            }
            ListEmptyComponent={
              <View style={s.empty}>
                <View style={s.emptyIconWrap}>
                  <Ionicons
                    name={activeView === 'jobs' ? 'file-tray-outline' : 'cube-outline'}
                    size={34}
                    color={C.slateLight}
                  />
                </View>
                <Text style={s.emptyTitle}>
                  {activeView === 'jobs' ? 'No jobs found' : 'No services added yet'}
                </Text>
                <Text style={s.emptySub}>
                  {activeView === 'jobs'
                    ? 'Try switching to a different filter chip above.'
                    : 'Tap "Add Service" to create your first catalog offering.'}
                </Text>
                {activeView === 'services' && (
                  <TouchableOpacity
                    style={s.emptyActionBtn}
                    onPress={() => setServiceModalVisible(true)}
                    activeOpacity={0.85}
                  >
                    <Ionicons name="add-circle-outline" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
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
            <Ionicons name="add" size={20} color="#FFFFFF" />
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
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // ── Top Greeting Row ──
  topGreetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  greetingLabel: {
    fontSize: 13,
    color: C.slateLight,
    fontWeight: '500',
    marginBottom: 2,
  },
  greetingName: {
    fontSize: 24,
    fontWeight: '800',
    color: C.navy,
    letterSpacing: -0.5,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: C.navy,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  onlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // ── Monthly Earnings Card ──
  earnCard: {
    backgroundColor: C.surface,
    borderRadius: 22,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  earnCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  earnLabel: {
    fontSize: 11,
    color: C.slateLight,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  earnAmount: {
    fontSize: 30,
    fontWeight: '800',
    color: C.navy,
    letterSpacing: -0.8,
  },
  earnIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  growthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  growthPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.greenBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  growthTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  vsText: {
    fontSize: 12,
    color: C.slateLight,
  },

  // ── Summary Stats Strip ──
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNum: {
    fontSize: 16,
    fontWeight: '800',
    color: C.navy,
    letterSpacing: -0.3,
  },
  statLbl: {
    fontSize: 10,
    color: C.slateLight,
    fontWeight: '700',
    marginTop: 2,
    letterSpacing: 0.4,
  },
  statDivider: {
    width: 1,
    backgroundColor: C.borderLight,
    marginVertical: 4,
  },

  // ── View Toggle Switcher ──
  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: C.border,
    padding: 4,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  viewTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
  },
  viewTabActive: {
    backgroundColor: C.navy,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  viewTabTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: C.slate,
  },
  viewTabTxtActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ── Section Header ──
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 4,
  },
  servicesBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.navy,
    letterSpacing: -0.2,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '500',
    color: C.slateLight,
    marginTop: 1,
  },
  topAddServiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.navy,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
  },
  topAddServiceTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Filter Chips ──
  filterScroll: {
    flexShrink: 0,
    marginTop: 4,
    marginBottom: 10,
  },
  filterContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    height: 34,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  chipActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  chipTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: C.slate,
  },
  chipTxtActive: {
    color: '#FFFFFF',
  },

  // ── Job Cards ──
  listContent: {
    paddingBottom: 90,
  },
  jobCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  jobTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  jobAvatar: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  jobAvatarTxt: {
    fontSize: 14,
    fontWeight: '700',
  },
  jobInfo: {
    flex: 1,
  },
  jobName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.navy,
  },
  jobType: {
    fontSize: 12,
    color: C.slateLight,
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginVertical: 12,
  },
  jobBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: C.slateLight,
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  amountLabel: {
    fontSize: 11,
    color: C.slateLight,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '800',
    color: C.navy,
    letterSpacing: -0.3,
  },
  arrowWrap: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },

  // ── Service Cards ──
  serviceCard: {
    backgroundColor: C.surface,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 4,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  serviceIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: C.navy,
  },
  serviceCat: {
    fontSize: 11,
    color: C.slateLight,
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 17,
    fontWeight: '800',
    color: C.navy,
  },
  etaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  serviceEta: {
    fontSize: 11,
    color: C.slateLight,
  },
  serviceDesc: {
    fontSize: 12,
    color: C.slate,
    lineHeight: 18,
    marginBottom: 12,
  },
  variationsSection: {
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
    paddingTop: 12,
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
    color: C.navy,
  },
  addVarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: C.borderLight,
    gap: 3,
  },
  addVarBtnTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: C.navy,
  },
  varRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.bg,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.borderLight,
    marginBottom: 6,
  },
  varLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.navy,
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
    color: C.blue,
    marginTop: 2,
  },
  varDesc: {
    fontSize: 11,
    color: C.slateLight,
    marginTop: 2,
  },
  editVarBtn: {
    padding: 7,
    borderRadius: 7,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  noVarsTxt: {
    fontSize: 11,
    color: C.slateLight,
    fontStyle: 'italic',
    paddingVertical: 4,
  },

  // ── Empty State ──
  empty: {
    paddingTop: 44,
    paddingHorizontal: 30,
    alignItems: 'center',
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: C.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.navy,
  },
  emptySub: {
    fontSize: 13,
    color: C.slateLight,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  emptyActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.navy,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  emptyActionTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Floating Action Button (FAB) ──
  fabBtn: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.navy,
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 30,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
    gap: 6,
  },
  fabTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // ── Loading & Error States ──
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: C.bg,
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: C.slateLight,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: C.bg,
    gap: 12,
  },
  errorIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: C.redBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.navy,
  },
  errorText: {
    fontSize: 13,
    color: C.red,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryBtn: {
    marginTop: 10,
    backgroundColor: C.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
  },
  retryTxt: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});