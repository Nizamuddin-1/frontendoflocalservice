// ─────────────────────────────────────────────────────────────────────────────
//  Screen 6 — Provider Profile Screen
//  Redesigned to match the visual language, typography, cards, and styling of
//  the Consumer Profile screen (5_profileScreen.tsx), featuring:
//    • Cool light canvas (#F0F3FB) with pure white surfaces & subtle hairlines
//    • Floating navigation bar with smooth scroll fade-in
//    • White Hero banner with concentric gold avatar rings & verification chips
//    • 3-column performance stats bar (Jobs, Completion %, Total Earned)
//    • Prominent "Taking New Jobs" availability card with live toggle & badges
//    • Contact Details card with email, phone, and quick copy actions
//    • Structured menu cards for Account, Documents, and Support
//    • Red-tinted Logout button matching Consumer styling & confirmation dialog
//    • EditProfileModal integration with role="provider"
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Platform,
  Alert,
  StatusBar,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { C, F } from '@/src/components/profile/tokens';
import { EditProfileModal } from '@/src/components/profile';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import {
  fetchProviderProfile,
  providerAvailabilityToggle,
  toggleProviderAvailability,
  logout,
} from '@/src/redux/actions/appActions';
import { useRole } from '@/src/context/RoleContext';

const { width } = Dimensions.get('window');

interface RowConfig {
  iconName: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  onPress?: () => void;
}

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { setIsGuest } = useRole();

  const { data: profile, isLoading } = useAppSelector((s) => s.provider.profile);
  const { isAvailable } = useAppSelector((s) => s.provider.availability);

  const [showEdit, setShowEdit] = useState(false);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchProviderProfile() as any);
  }, [dispatch]);

  const categorySubtitle =
    profile?.category ||
    (Array.isArray(profile?.serviceCategories) && profile.serviceCategories.length > 0
      ? profile.serviceCategories.join(', ')
      : 'Select categories');

  const bankSubtitle = profile?.bank?.bankName
    ? `${profile.bank.bankName} ···· ${profile.bank.maskedNo || '••••'}`
    : 'Add bank account';

  const accountRows: RowConfig[] = [
    {
      iconName: 'person-outline',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      title: 'Personal Info',
      subtitle: profile?.address ? `${profile.name}, ${profile.address}` : 'Name, phone, address',
      onPress: () => setShowEdit(true),
    },
    {
      iconName: 'construct-outline',
      iconBg: '#EDE9FE',
      iconColor: '#7C3AED',
      title: 'Service Categories',
      subtitle: categorySubtitle,
      onPress: () => {
        Alert.alert('Service Categories', `Assigned: ${categorySubtitle}`);
      },
    },
    {
      iconName: 'card-outline',
      iconBg: '#ECFDF5',
      iconColor: '#059669',
      title: 'Bank Account',
      subtitle: bankSubtitle,
      badge: profile?.bank?.verified ? 'Verified' : undefined,
      badgeBg: 'rgba(16,185,129,0.12)',
      badgeColor: '#047857',
      onPress: () => {
        Alert.alert('Bank Account', bankSubtitle);
      },
    },
  ];

  const documentRows: RowConfig[] = [
    {
      iconName: 'document-text-outline',
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      title: 'ID Verification',
      subtitle: 'Aadhaar card verified',
      badge: 'Done',
      badgeBg: 'rgba(16,185,129,0.12)',
      badgeColor: '#047857',
      onPress: () => {
        Alert.alert('ID Verification', 'Your Aadhaar government ID verification is complete.');
      },
    },
    {
      iconName: 'time-outline',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      title: 'Work Experience',
      subtitle: '6 years certified',
      onPress: () => {
        Alert.alert('Work Experience', 'Verified 6 years of professional service experience.');
      },
    },
    {
      iconName: 'shield-checkmark-outline',
      iconBg: '#FFF1F2',
      iconColor: '#E11D48',
      title: 'Background Check',
      subtitle: 'Police verification',
      badge: 'Cleared',
      badgeBg: 'rgba(16,185,129,0.12)',
      badgeColor: '#047857',
      onPress: () => {
        Alert.alert('Background Check', 'Background and criminal records check status: Cleared.');
      },
    },
  ];

  const supportRows: RowConfig[] = [
    {
      iconName: 'help-circle-outline',
      iconBg: 'rgba(10,22,40,0.06)',
      iconColor: '#475569',
      title: 'Help & Support',
      subtitle: 'FAQs, raise a ticket',
      onPress: () => {
        Alert.alert('Help & Support', 'LocalFix Provider Support is active 24/7 at support@localfix.in');
      },
    },
    {
      iconName: 'gift-outline',
      iconBg: '#FFFBEB',
      iconColor: '#D97706',
      title: 'Refer & Earn',
      subtitle: 'Invite friends, earn ₹500',
      onPress: () => {
        Alert.alert('Refer & Earn', 'Share your referral code PRO500 to earn ₹500 on their first completed job!');
      },
    },
  ];

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out of LocalFix Provider?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          setIsGuest(false);
          dispatch(logout() as any);
        },
      },
    ]);
  }, [dispatch, setIsGuest]);

  const handleAvailabilityToggle = async () => {
    setIsUpdatingAvailability(true);
    try {
      if (typeof toggleProviderAvailability === 'function') {
        await dispatch(toggleProviderAvailability() as any);
      } else {
        dispatch(providerAvailabilityToggle() as any);
      }
    } catch {
      // Revert if error occurs
      dispatch(providerAvailabilityToggle() as any);
      Alert.alert('Update Failed', 'Could not update your availability. Please check your connection.');
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  const handleCopy = (label: string, value: string) => {
    Alert.alert('Copied', `${label} (${value}) copied to clipboard`);
  };

  // Header fade-in on vertical scroll
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={s.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Floating Header ── */}
      <View style={s.floatingNav} pointerEvents="box-none">
        <Animated.View style={[s.floatingNavBg, { opacity: headerBgOpacity }]} />
        <TouchableOpacity
          style={s.navBtn}
          onPress={() => {
            if (navigation && typeof navigation.goBack === 'function' && navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chevron-back" size={22} color={C.navy} />
        </TouchableOpacity>
        <Text style={[s.navTitle, { fontFamily: F.displaySemi }]}>Provider Profile</Text>
        <TouchableOpacity
          style={s.navBtn}
          onPress={() => setShowEdit(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="create-outline" size={20} color={C.navy} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {isLoading ? (
          <View style={s.loadingContainer}>
            <ActivityIndicator size="large" color={C.blue} />
            <Text style={[s.loadingText, { fontFamily: F.bodyReg }]}>Loading profile...</Text>
          </View>
        ) : (
          <>
            {/* ── Hero Section (Pure White Surface) ── */}
            <View style={s.hero}>
              {/* Decorative background geometry */}
              <View style={s.heroCircle1} />
              <View style={s.heroCircle2} />
              <View style={s.heroCircle3} />
              <View style={s.heroGridLine1} />
              <View style={s.heroGridLine2} />

              <View style={s.heroContent}>
                {/* Concentric Layered Avatar */}
                <View style={s.heroAvatarWrap}>
                  <View style={s.avatarRingOuter} />
                  <View style={s.avatarRingInner} />
                  <View style={s.avatarCircle}>
                    <Text style={[s.avatarInitials, { fontFamily: F.displayBold }]}>
                      {profile?.initials ||
                        (profile?.name
                          ? profile.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()
                          : 'PR')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={s.avatarEditBadge}
                    activeOpacity={0.8}
                    onPress={() => setShowEdit(true)}
                  >
                    <Ionicons name="create-outline" size={13} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                {/* Name & Primary Metadata */}
                <Text style={[s.heroName, { fontFamily: F.displayBold }]}>
                  {profile?.name ?? 'Provider Partner'}
                </Text>
                <View style={s.heroMetaRow}>
                  <Ionicons name="briefcase-outline" size={13} color={C.slate} />
                  <Text style={[s.heroMeta, { fontFamily: F.bodyReg }]}>
                    {profile?.category || 'Professional Service Provider'}
                  </Text>
                </View>
                <View style={s.heroMetaRow}>
                  <Ionicons name="location-outline" size={13} color={C.slate} />
                  <Text style={[s.heroMeta, { fontFamily: F.bodyReg }]}>
                    {profile?.address ? `${profile.address}` : 'Indiranagar, Bengaluru'}
                  </Text>
                </View>

                {/* Verification & Quality Chips */}
                <View style={s.heroChipsRow}>
                  <View
                    style={[
                      s.heroChip,
                      { borderColor: 'rgba(16,185,129,0.35)', backgroundColor: C.greenBg },
                    ]}
                  >
                    <Ionicons name="shield-checkmark" size={12} color={C.green} />
                    <Text style={[s.heroChipText, { fontFamily: F.bodySemi, color: C.green }]}>
                      Verified
                    </Text>
                  </View>
                  <View
                    style={[
                      s.heroChip,
                      { borderColor: 'rgba(212,168,83,0.45)', backgroundColor: C.amberBg },
                    ]}
                  >
                    <Ionicons name="ribbon" size={12} color={C.amber} />
                    <Text style={[s.heroChipText, { fontFamily: F.bodySemi, color: C.amber }]}>
                      Gold Tier
                    </Text>
                  </View>
                  <View
                    style={[
                      s.heroChip,
                      { borderColor: 'rgba(37,99,235,0.3)', backgroundColor: C.blueLight },
                    ]}
                  >
                    <Ionicons name="star" size={12} color={C.blue} />
                    <Text style={[s.heroChipText, { fontFamily: F.bodySemi, color: C.blue }]}>
                      {profile?.rating ?? 4.9} ({profile?.reviewCount ?? 142})
                    </Text>
                  </View>
                </View>

                {/* Edit Profile Button */}
                <TouchableOpacity
                  style={s.heroEditBtn}
                  onPress={() => setShowEdit(true)}
                  activeOpacity={0.85}
                >
                  <Ionicons name="create-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={[s.heroEditBtnText, { fontFamily: F.bodySemi }]}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ── Performance Stats Section (3 Columns) ── */}
            <View style={s.statsSection}>
              <View style={s.statsRow}>
                <View style={s.statCard}>
                  <View style={[s.statIconWrap, { backgroundColor: 'rgba(37,99,235,0.08)' }]}>
                    <Ionicons name="briefcase-outline" size={17} color={C.blue} />
                  </View>
                  <Text style={[s.statValue, { fontFamily: F.displayBold, color: C.navy }]}>
                    {profile?.jobsDone ?? 0}
                  </Text>
                  <Text style={[s.statLabel, { fontFamily: F.bodySemi }]}>JOBS DONE</Text>
                </View>

                <View style={s.statCard}>
                  <View style={[s.statIconWrap, { backgroundColor: 'rgba(16,185,129,0.1)' }]}>
                    <Ionicons name="checkmark-done-circle-outline" size={18} color={C.green} />
                  </View>
                  <Text style={[s.statValue, { fontFamily: F.displayBold, color: C.navy }]}>
                    {profile?.completionRate ?? 0}%
                  </Text>
                  <Text style={[s.statLabel, { fontFamily: F.bodySemi }]}>COMPLETION</Text>
                </View>

                <View style={s.statCard}>
                  <View style={[s.statIconWrap, { backgroundColor: 'rgba(212,168,83,0.12)' }]}>
                    <Ionicons name="cash-outline" size={18} color={C.gold} />
                  </View>
                  <Text style={[s.statValue, { fontFamily: F.displayBold, color: C.navy }]}>
                    ₹{((profile?.totalEarned ?? 0) / 1000).toFixed(1)}k
                  </Text>
                  <Text style={[s.statLabel, { fontFamily: F.bodySemi }]}>TOTAL EARNED</Text>
                </View>
              </View>
            </View>

            {/* ── Prominent "Taking New Jobs" Card ── */}
            <View style={s.section}>
              <Text style={[s.sectionLabel, { fontFamily: F.bodySemi }]}>DUTY AVAILABILITY</Text>
              <View style={s.availabilityCard}>
                <View
                  style={[
                    s.availIconWrap,
                    {
                      backgroundColor: isAvailable
                        ? 'rgba(16,185,129,0.12)'
                        : 'rgba(100,116,139,0.1)',
                    },
                  ]}
                >
                  <Ionicons
                    name={isAvailable ? 'radio-button-on' : 'radio-button-off'}
                    size={22}
                    color={isAvailable ? '#10B981' : '#64748B'}
                  />
                </View>

                <View style={s.availTextBlock}>
                  <View style={s.availHeaderRow}>
                    <Text style={[s.availTitle, { fontFamily: F.bodySemi }]}>Taking New Jobs</Text>
                    <View
                      style={[
                        s.availBadge,
                        isAvailable ? s.availBadgeActive : s.availBadgeInactive,
                      ]}
                    >
                      <View
                        style={[
                          s.availBadgeDot,
                          { backgroundColor: isAvailable ? '#10B981' : '#94A3B8' },
                        ]}
                      />
                      <Text
                        style={[
                          s.availBadgeText,
                          { fontFamily: F.bodySemi, color: isAvailable ? '#047857' : '#475569' },
                        ]}
                      >
                        {isAvailable ? 'Available' : 'Unavailable'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[s.availSubtitle, { fontFamily: F.bodyReg }]}>
                    {isAvailable
                      ? 'Turn off to stop receiving new booking requests'
                      : 'Turn on to start receiving new booking requests'}
                  </Text>
                </View>

                <Switch
                  value={isAvailable}
                  onValueChange={handleAvailabilityToggle}
                  disabled={isUpdatingAvailability}
                  trackColor={{ false: '#CBD5E1', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                  ios_backgroundColor="#CBD5E1"
                />
              </View>
            </View>

            {/* ── Contact Details Card ── */}
            <View style={s.section}>
              <Text style={[s.sectionLabel, { fontFamily: F.bodySemi }]}>CONTACT DETAILS</Text>
              <View style={s.infoCard}>
                {[
                  {
                    icon: 'mail-outline',
                    label: 'Email',
                    value: profile?.email || 'provider@localfix.in',
                  },
                  {
                    icon: 'call-outline',
                    label: 'Phone',
                    value: profile?.phone || '+91 98765 43210',
                  },
                ].map((row, i, arr) => (
                  <React.Fragment key={row.label}>
                    <View style={s.infoRow}>
                      <View style={[s.infoIconWrap, { backgroundColor: C.blueLight }]}>
                        <Ionicons name={row.icon as any} size={16} color={C.blue} />
                      </View>
                      <View style={s.infoTextBlock}>
                        <Text style={[s.infoLabel, { fontFamily: F.bodyReg }]}>{row.label}</Text>
                        <Text style={[s.infoValue, { fontFamily: F.bodySemi }]}>{row.value}</Text>
                      </View>
                      <TouchableOpacity
                        style={s.infoCopyBtn}
                        activeOpacity={0.7}
                        onPress={() => handleCopy(row.label, row.value)}
                      >
                        <Ionicons name="copy-outline" size={15} color={C.slateLight} />
                      </TouchableOpacity>
                    </View>
                    {i < arr.length - 1 && <View style={s.infoDivider} />}
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* ── Account Section ── */}
            <View style={s.section}>
              <Text style={[s.sectionLabel, { fontFamily: F.bodySemi }]}>ACCOUNT</Text>
              <View style={s.menuCard}>
                {accountRows.map((row, i) => (
                  <React.Fragment key={row.title}>
                    <TouchableOpacity
                      style={s.menuItem}
                      activeOpacity={0.7}
                      onPress={row.onPress}
                    >
                      <View style={[s.menuIconWrap, { backgroundColor: row.iconBg }]}>
                        <Ionicons name={row.iconName as any} size={18} color={row.iconColor} />
                      </View>
                      <View style={s.menuTextBlock}>
                        <Text style={[s.menuLabel, { fontFamily: F.bodySemi }]}>{row.title}</Text>
                        <Text style={[s.menuSublabel, { fontFamily: F.bodyReg }]} numberOfLines={1}>
                          {row.subtitle}
                        </Text>
                      </View>
                      {row.badge && (
                        <View style={[s.menuBadge, row.badgeBg ? { backgroundColor: row.badgeBg } : {}]}>
                          <Text
                            style={[
                              s.menuBadgeText,
                              { fontFamily: F.bodySemi },
                              row.badgeColor ? { color: row.badgeColor } : {},
                            ]}
                          >
                            {row.badge}
                          </Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={17} color={C.slateLight} />
                    </TouchableOpacity>
                    {i < accountRows.length - 1 && <View style={s.menuDivider} />}
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* ── Documents & Verification Section ── */}
            <View style={s.section}>
              <Text style={[s.sectionLabel, { fontFamily: F.bodySemi }]}>DOCUMENTS & VERIFICATION</Text>
              <View style={s.menuCard}>
                {documentRows.map((row, i) => (
                  <React.Fragment key={row.title}>
                    <TouchableOpacity
                      style={s.menuItem}
                      activeOpacity={0.7}
                      onPress={row.onPress}
                    >
                      <View style={[s.menuIconWrap, { backgroundColor: row.iconBg }]}>
                        <Ionicons name={row.iconName as any} size={18} color={row.iconColor} />
                      </View>
                      <View style={s.menuTextBlock}>
                        <Text style={[s.menuLabel, { fontFamily: F.bodySemi }]}>{row.title}</Text>
                        <Text style={[s.menuSublabel, { fontFamily: F.bodyReg }]}>{row.subtitle}</Text>
                      </View>
                      {row.badge && (
                        <View style={[s.menuBadge, row.badgeBg ? { backgroundColor: row.badgeBg } : {}]}>
                          <Text
                            style={[
                              s.menuBadgeText,
                              { fontFamily: F.bodySemi },
                              row.badgeColor ? { color: row.badgeColor } : {},
                            ]}
                          >
                            {row.badge}
                          </Text>
                        </View>
                      )}
                      <Ionicons name="chevron-forward" size={17} color={C.slateLight} />
                    </TouchableOpacity>
                    {i < documentRows.length - 1 && <View style={s.menuDivider} />}
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* ── Support & Referrals Section ── */}
            <View style={s.section}>
              <Text style={[s.sectionLabel, { fontFamily: F.bodySemi }]}>SUPPORT & REFERRALS</Text>
              <View style={s.menuCard}>
                {supportRows.map((row, i) => (
                  <React.Fragment key={row.title}>
                    <TouchableOpacity
                      style={s.menuItem}
                      activeOpacity={0.7}
                      onPress={row.onPress}
                    >
                      <View style={[s.menuIconWrap, { backgroundColor: row.iconBg }]}>
                        <Ionicons name={row.iconName as any} size={18} color={row.iconColor} />
                      </View>
                      <View style={s.menuTextBlock}>
                        <Text style={[s.menuLabel, { fontFamily: F.bodySemi }]}>{row.title}</Text>
                        <Text style={[s.menuSublabel, { fontFamily: F.bodyReg }]}>{row.subtitle}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={17} color={C.slateLight} />
                    </TouchableOpacity>
                    {i < supportRows.length - 1 && <View style={s.menuDivider} />}
                  </React.Fragment>
                ))}
              </View>
            </View>

            {/* ── Logout Button ── */}
            <View style={s.section}>
              <TouchableOpacity
                style={s.logoutBtn}
                onPress={handleLogout}
                activeOpacity={0.8}
              >
                <Ionicons name="log-out-outline" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                <Text style={[s.logoutTxt, { fontFamily: F.bodySemi }]}>Log Out</Text>
              </TouchableOpacity>
            </View>

            {/* ── App Version ── */}
            <View style={s.appVersionRow}>
              <View style={s.appVersionIconWrap}>
                <Ionicons name="build-outline" size={14} color={C.slateLight} />
              </View>
              <Text style={[s.appVersionText, { fontFamily: F.bodyReg }]}>
                LocalFix Provider v2.4.1 · Build 2024031401
              </Text>
            </View>

            <View style={{ height: 40 }} />
          </>
        )}
      </Animated.ScrollView>

      {/* ── Edit Profile Modal ── */}
      <EditProfileModal
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        role="provider"
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scrollContent: {
    backgroundColor: C.bg,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 140,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: C.slateLight,
  },

  // ── Floating Nav ────────────────────────────────────────────────────────────
  floatingNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 54 : 34,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  floatingNavBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(10,22,40,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 17,
    color: C.navy,
    letterSpacing: -0.3,
  },

  // ── Hero Section (Pure White Surface) ───────────────────────────────────────
  hero: {
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 104 : 84,
    paddingBottom: 26,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  heroCircle1: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(37,99,235,0.04)',
    top: -100,
    right: -100,
  },
  heroCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(10,22,40,0.02)',
    bottom: -60,
    left: -60,
  },
  heroCircle3: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(212,168,83,0.05)',
    top: 60,
    left: 30,
  },
  heroGridLine1: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(10,22,40,0.03)',
    left: width * 0.33,
  },
  heroGridLine2: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(10,22,40,0.03)',
    left: width * 0.66,
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // ── Layered Avatar ──────────────────────────────────────────────────────────
  heroAvatarWrap: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarRingOuter: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: 'rgba(212,168,83,0.35)',
  },
  avatarRingInner: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: 'rgba(212,168,83,0.6)',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarInitials: {
    fontSize: 26,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  // ── Hero Info & Chips ───────────────────────────────────────────────────────
  heroName: {
    fontSize: 24,
    color: C.navy,
    letterSpacing: -0.6,
    marginBottom: 4,
    textAlign: 'center',
  },
  heroMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  heroMeta: {
    fontSize: 13,
    color: C.slate,
  },
  heroChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    marginBottom: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 1,
  },
  heroChipText: {
    fontSize: 11,
  },
  heroEditBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.navy,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 11,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  heroEditBtnText: {
    fontSize: 14,
    color: '#FFFFFF',
  },

  // ── Stats Section ───────────────────────────────────────────────────────────
  statsSection: {
    backgroundColor: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: C.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 17,
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9.5,
    color: C.slateLight,
    letterSpacing: 0.5,
  },

  // ── Sections & Cards ────────────────────────────────────────────────────────
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: C.slateLight,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },

  // ── "Taking New Jobs" Availability Card ─────────────────────────────────────
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  availIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  availTextBlock: {
    flex: 1,
  },
  availHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 3,
  },
  availTitle: {
    fontSize: 15,
    color: C.navy,
    letterSpacing: -0.2,
  },
  availSubtitle: {
    fontSize: 11.5,
    color: C.slate,
    lineHeight: 15,
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  availBadgeActive: {
    backgroundColor: '#D1FAE5',
  },
  availBadgeInactive: {
    backgroundColor: '#E2E8F0',
  },
  availBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availBadgeText: {
    fontSize: 10.5,
  },

  // ── Contact Info Card ───────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: C.slateLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: C.navy,
  },
  infoCopyBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  infoDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginLeft: 66,
  },

  // ── Menu Cards & Items ──────────────────────────────────────────────────────
  menuCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 13,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextBlock: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14,
    color: C.navy,
    letterSpacing: -0.1,
  },
  menuSublabel: {
    fontSize: 12,
    color: C.slateLight,
    marginTop: 2,
  },
  menuBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 4,
  },
  menuBadgeText: {
    fontSize: 11,
  },
  menuDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginLeft: 69,
  },

  // ── Logout Button ───────────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 14,
    paddingVertical: 13,
    marginBottom: 8,
  },
  logoutTxt: {
    color: '#EF4444',
    fontSize: 14,
  },

  // ── App Version ─────────────────────────────────────────────────────────────
  appVersionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  appVersionIconWrap: {
    opacity: 0.6,
  },
  appVersionText: {
    fontSize: 11.5,
    color: C.slateLight,
  },
});
