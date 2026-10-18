// ─────────────────────────────────────────────
//  Screen 6 — Profile
// ─────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch,
  StyleSheet, SafeAreaView, Alert, StatusBar,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radii, Shadows } from '../theme';
import { Divider } from '../components';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import { providerAvailabilityToggle, fetchProviderProfile, logout } from '@/src/redux/actions/appActions';
import { EditProfileModal } from '@/src/components/profile';

interface RowConfig {
  iconName: keyof typeof Feather.glyphMap;
  iconBg:   string;
  iconColor:string;
  title:    string;
  subtitle: string;
  badge?:   string;
  badgeColor?: string;
  onPress?: () => void;
}



const DOCUMENT_ROWS: RowConfig[] = [
  { iconName: 'file-text', iconBg: '#FFFBEB', iconColor: '#92400E', title: 'ID Verification',  subtitle: 'Aadhaar card verified', badge: 'Done', badgeColor: Colors.emerald3 },
  { iconName: 'clock',     iconBg: '#EFF6FF', iconColor: '#1D4ED8', title: 'Work Experience',  subtitle: '6 years certified'             },
  { iconName: 'shield',    iconBg: '#FFF1F2', iconColor: '#9F1239', title: 'Background Check', subtitle: 'Police verification', badge: 'Cleared', badgeColor: Colors.emerald3 },
];

const SUPPORT_ROWS: RowConfig[] = [
  { iconName: 'help-circle', iconBg: Colors.surface, iconColor: Colors.ink3, title: 'Help & Support',  subtitle: 'FAQs, raise a ticket'     },
  { iconName: 'gift',        iconBg: Colors.surface, iconColor: Colors.ink3, title: 'Refer & Earn',    subtitle: 'Invite friends, earn ₹500' },
   
];

const RowItem: React.FC<RowConfig> = ({ iconName, iconBg, iconColor, title, subtitle, badge, badgeColor, onPress }) => (
  <TouchableOpacity style={s.rowItem} activeOpacity={0.65} onPress={onPress}>
    <View style={[s.rowIcon, { backgroundColor: iconBg }]}>
      <Feather name={iconName} size={17} color={iconColor} />
    </View>
    <View style={s.rowBody}>
      <Text style={s.rowTitle}>{title}</Text>
      <Text style={s.rowSub}>{subtitle}</Text>
    </View>
    {badge && (
      <View style={[s.badgePill, { backgroundColor: Colors.emerald2 }]}>
        <Text style={[s.badgeTxt, badgeColor ? { color: badgeColor } : {}]}>{badge}</Text>
      </View>
    )}
    <Feather name="chevron-right" size={16} color={Colors.ink4} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { data: profile, isLoading } = useAppSelector((s) => s.provider.profile);
  const { isAvailable } = useAppSelector((s) => s.provider.availability);
  const [showEdit, setShowEdit] = useState(false);

  React.useEffect(() => {
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
      iconName: 'user',
      iconBg: '#EFF6FF',
      iconColor: '#1D4ED8',
      title: 'Personal Info',
      subtitle: profile?.address ? `${profile.name}, ${profile.address}` : 'Name, phone, address',
    },
    {
      iconName: 'tool',
      iconBg: '#EDE9FE',
      iconColor: '#5B21B6',
      title: 'Service Categories',
      subtitle: categorySubtitle,
    },
    {
      iconName: 'credit-card',
      iconBg: '#ECFDF5',
      iconColor: '#047857',
      title: 'Bank Account',
      subtitle: bankSubtitle,
      badge: profile?.bank?.verified ? 'Verified' : undefined,
      badgeColor: Colors.emerald3,
    },
  ];

  const handleLogout = useCallback(() => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          dispatch(logout() as any);
        },
      },
    ]);
  }, [dispatch]);

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Top Bar ─────────────────────────── */}
      <View style={s.topBar}>
        <Text style={s.topBarTitle}>My Profile</Text>
        <TouchableOpacity style={s.editBtn} onPress={() => setShowEdit(true)} activeOpacity={0.7}>
          <Feather name="edit-2" size={16} color={Colors.ink2} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>

        {/* ── Profile Card ──────────────────── */}
        <View style={[s.profileCard]}>
          {/* Avatar */}
          <View style={s.avatarSection}>
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>{profile?.initials ?? 'PR'}</Text>
            </View>
            <View style={s.avatarBadge}>
              <Feather name="check" size={10} color="#fff" />
            </View>
          </View>
          <Text style={s.profileName}>{profile?.name ?? 'Loading...'}</Text>
          <Text style={s.profileCat}>{profile?.category ?? ''}</Text>
          {/* Rating */}
          <View style={s.ratingRow}>
            {[1,2,3,4,5].map((n) => (
              <Feather key={n} name="star" size={14} color={n <= Math.round(profile?.rating ?? 0) ? Colors.star : Colors.border2} />
            ))}
            <Text style={s.ratingTxt}>{profile?.rating ?? 0} ({profile?.reviewCount ?? 0} reviews)</Text>
          </View>
        </View>

        {/* ── Stats Row ────────────────────── */}
        <View style={s.statsRow}>
          <View style={s.statBox}>
            <Text style={s.statVal}>{profile?.jobsDone ?? 0}</Text>
            <Text style={s.statLbl}>Jobs</Text>
          </View>
          <View style={{ width: 1, backgroundColor: Colors.border }} />
          <View style={s.statBox}>
            <Text style={s.statVal}>{profile?.completionRate ?? 0}%</Text>
            <Text style={s.statLbl}>Completion</Text>
          </View>
          <View style={{ width: 1, backgroundColor: Colors.border }} />
          <View style={s.statBox}>
            <Text style={s.statVal}>₹{((profile?.totalEarned ?? 0)/1000).toFixed(1)}k</Text>
            <Text style={s.statLbl}>Earned</Text>
          </View>
        </View>

        {/* ── Toggle Card ──────────────────── */}
        <View style={s.toggleCard}>
          <View style={[s.toggleIcon, { backgroundColor: isAvailable ? Colors.emerald2 : Colors.surface }]}>
            <Feather name="power" size={18} color={isAvailable ? Colors.emerald3 : Colors.ink3} />
          </View>
          <View style={s.toggleBody}>
            <Text style={s.toggleTitle}>{isAvailable ? 'Taking new jobs' : 'Currently offline'}</Text>
            <Text style={[s.toggleSub, { color: isAvailable ? Colors.emerald3 : Colors.ink4 }]}>
              {isAvailable ? 'You are visible to customers' : 'Go online to receive jobs'}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={() => dispatch(providerAvailabilityToggle() as any)}
            trackColor={{ false: Colors.border, true: Colors.emerald }}
            thumbColor="#FFFFFF"
          />
        </View>
 
        {/* ── Account Section ──────────────── */}
        <Text style={s.groupLabel}>ACCOUNT</Text>
        <View style={s.card}>
          {accountRows.map((row, i) => (
            <React.Fragment key={row.title}>
              <RowItem
                {...row}
                onPress={row.title === 'Personal Info' ? () => setShowEdit(true) : undefined}
              />
              {i < accountRows.length - 1 && <Divider marginLeft={Spacing.lg + 38 + 12} />}
            </React.Fragment>
          ))}
        </View>
 

        {/* ── Support Section ──────────────── */}
        <Text style={s.groupLabel}>SUPPORT</Text>
        <View style={s.card}>
          {SUPPORT_ROWS.map((row, i) => (
            <React.Fragment key={row.title}>
              <RowItem {...row} />
              {i < SUPPORT_ROWS.length - 1 && <Divider marginLeft={Spacing.lg + 38 + 12} />}
            </React.Fragment>
          ))}
        </View>

        {/* Version */}
        <Text style={s.version}>ServeNow Provider v2.4.1</Text>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Feather name="log-out" size={16} color={Colors.rose3} />
          <Text style={s.logoutTxt}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Edit Profile Modal ──────────────── */}
      <EditProfileModal
        visible={showEdit}
        onClose={() => setShowEdit(false)}
        role="provider"
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingBottom: 8 },

  topBar:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  topBarTitle: { fontSize: 18, fontWeight: FontWeight.bold, color: Colors.ink },
  editBtn:     { width: 36, height: 36, backgroundColor: Colors.surface, borderRadius: Radii.md, justifyContent: 'center', alignItems: 'center' },

  // Profile card
  profileCard: {
    marginHorizontal: Spacing.lg,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    padding: 20,
    alignItems: 'center',
     
  },
  avatarSection: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 76, height: 76,
    borderRadius: 38,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTxt:   { fontSize: 26, fontWeight: FontWeight.bold, color: '#fff' },
  avatarBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 20, height: 20,
    borderRadius: 10,
    backgroundColor: Colors.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: { fontSize: 18, fontWeight: FontWeight.bold, color: Colors.ink, marginBottom: 3 },
  profileCat:  { fontSize: FontSize.sm, color: Colors.ink3, marginBottom: 10 },
  ratingRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt:   { fontSize: FontSize.sm, color: Colors.ink3, marginLeft: 4 },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginTop: 12,
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statVal: { fontSize: 18, fontWeight: FontWeight.bold, color: Colors.ink, letterSpacing: -0.3 },
  statLbl: { fontSize: FontSize.xs, color: Colors.ink4, fontWeight: FontWeight.semibold, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.3 },

  // Toggle card
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: Spacing.lg,
    marginTop: 12,
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  toggleIcon: { width: 38, height: 38, borderRadius: Radii.md, justifyContent: 'center', alignItems: 'center' },
  toggleBody: { flex: 1 },
  toggleTitle:{ fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.ink },
  toggleSub:  { fontSize: FontSize.sm, marginTop: 2 },

  // Sections
  groupLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.ink4,
    letterSpacing: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: 20,
    paddingBottom: 8,
  },
  card: {
    marginHorizontal: Spacing.lg,
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  rowItem:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.lg, paddingVertical: 13 },
  rowIcon:  { width: 38, height: 38, borderRadius: Radii.md, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  rowBody:  { flex: 1 },
  rowTitle: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.ink },
  rowSub:   { fontSize: FontSize.sm, color: Colors.ink3, marginTop: 1 },
  badgePill:{ paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, marginRight: 6 },
  badgeTxt: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },

  // Misc
  version:    { fontSize: FontSize.sm, color: Colors.ink4, textAlign: 'center', marginTop: 20, marginBottom: 12 },
  logoutBtn:  {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: Spacing.lg,
    height: 50,
    backgroundColor: Colors.rose2,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(225,29,72,0.15)',
  },
  logoutTxt: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.rose3 },
});
