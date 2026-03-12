// HomeScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: '1', icon: '⚡', label: 'Electrician', color: '#FFF3CD', accent: '#F59E0B', count: '124 pros' },
  { id: '2', icon: '🔧', label: 'Plumber',     color: '#DBEAFE', accent: '#3B82F6', count: '98 pros'  },
  { id: '3', icon: '❄️', label: 'AC Repair',   color: '#D1FAE5', accent: '#10B981', count: '67 pros'  },
  { id: '4', icon: '✂️', label: 'Salon',       color: '#FCE7F3', accent: '#EC4899', count: '203 pros' },
  { id: '5', icon: '🧹', label: 'Cleaning',    color: '#EDE9FE', accent: '#8B5CF6', count: '156 pros' },
  { id: '6', icon: '🪵', label: 'Carpenter',   color: '#FEF3C7', accent: '#D97706', count: '45 pros'  },
  { id: '7', icon: '🐛', label: 'Pest Ctrl',   color: '#DCFCE7', accent: '#16A34A', count: '32 pros'  },
  { id: '8', icon: '🎨', label: 'Painter',     color: '#FFE4E6', accent: '#F43F5E', count: '78 pros'  },
];

const PROVIDERS = [
  {
    id: '1', name: 'Ramesh K.', role: 'Electrician',  rating: 4.9,
    jobs: 312, price: '₹299', badge: 'Top Rated',
    initials: 'RK', avatarBg: '#FEF9C3', avatarText: '#B45309',
    dist: '1.2 km', available: true,
  },
  {
    id: '2', name: 'Sunil M.', role: 'Plumber',       rating: 4.8,
    jobs: 198, price: '₹249', badge: 'Verified',
    initials: 'SM', avatarBg: '#DBEAFE', avatarText: '#1D4ED8',
    dist: '0.8 km', available: true,
  },
  {
    id: '3', name: 'Priya S.', role: 'Salon Expert',  rating: 4.9,
    jobs: 445, price: '₹399', badge: 'Top Rated',
    initials: 'PS', avatarBg: '#FCE7F3', avatarText: '#BE185D',
    dist: '2.1 km', available: false,
  },
];

const BANNERS = [
  { id: '1', title: '50% OFF', sub: 'First Home Cleaning', color1: '#1A56DB', color2: '#0EA5E9', emoji: '🧹' },
  { id: '2', title: 'AC Service',sub: 'Starting ₹399 only', color1: '#059669', color2: '#10B981', emoji: '❄️' },
  { id: '3', title: 'Salon @Home',sub: 'Book in 60 seconds', color1: '#DB2777', color2: '#EC4899', emoji: '✂️' },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const StarRating = ({ value }) => (
  <Text style={{ fontSize: 11, color: '#F59E0B', fontWeight: '700' }}>
    {'★'.repeat(Math.floor(value))}
    <Text style={{ color: '#94A3B8' }}>{'★'.repeat(5 - Math.floor(value))}</Text>
  </Text>
);

const Badge = ({ label }) => (
  <View style={[
    styles.badge,
    { backgroundColor: label === 'Top Rated' ? '#FEF9C3' : '#D1FAE5' }
  ]}>
    <Text style={[
      styles.badgeText,
      { color: label === 'Top Rated' ? '#B45309' : '#065F46' }
    ]}>
      {label === 'Top Rated' ? '🏆 ' : '✅ '}{label}
    </Text>
  </View>
);

const ServiceCard = ({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[styles.serviceCard, { backgroundColor: item.color }]}
  >
    <View style={[styles.serviceIconWrap, { backgroundColor: item.accent + '22' }]}>
      <Text style={styles.serviceIcon}>{item.icon}</Text>
    </View>
    <Text style={[styles.serviceLabel, { color: item.accent }]}>{item.label}</Text>
    <Text style={styles.serviceCount}>{item.count}</Text>
  </TouchableOpacity>
);

const ProviderCard = ({ item, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.88}
    style={styles.providerCard}
  >
    {/* Availability dot */}
    <View style={[
      styles.availDot,
      { backgroundColor: item.available ? '#22C55E' : '#CBD5E1' }
    ]} />

    {/* Avatar */}
    <View style={[styles.avatar, { backgroundColor: item.avatarBg }]}>
      <Text style={[styles.avatarText, { color: item.avatarText }]}>{item.initials}</Text>
    </View>

    <Text style={styles.providerName}>{item.name}</Text>
    <Text style={styles.providerRole}>{item.role}</Text>

    <View style={styles.ratingRow}>
      <StarRating value={item.rating} />
      <Text style={styles.ratingNum}> {item.rating}</Text>
    </View>

    <Text style={styles.providerJobs}>{item.jobs} jobs done</Text>

    <View style={styles.providerFooter}>
      <Text style={styles.providerPrice}>{item.price}</Text>
      <Text style={styles.providerDist}>📍 {item.dist}</Text>
    </View>

    <Badge label={item.badge} />

    <TouchableOpacity style={styles.bookBtn} activeOpacity={0.8}>
      <Text style={styles.bookBtnText}>Book Now</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const BannerCard = ({ item }) => (
  <LinearGradient
    colors={[item.color1, item.color2]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.bannerCard}
  >
    <View style={styles.bannerContent}>
      <View>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        <Text style={styles.bannerSub}>{item.sub}</Text>
        <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.85}>
          <Text style={styles.bannerBtnText}>Grab Deal →</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.bannerEmoji}>{item.emoji}</Text>
    </View>
    {/* decorative circle */}
    <View style={styles.bannerCircle1} />
    <View style={styles.bannerCircle2} />
  </LinearGradient>
);

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1A56DB" />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── HEADER ── */}
        <LinearGradient
          colors={['#1A56DB', '#0EA5E9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Decorative blobs */}
          <View style={styles.blob1} />
          <View style={styles.blob2} />

          {/* Top row */}
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.userName}>Arjun Singh</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>Indore, Madhya Pradesh</Text>
                <Text style={styles.locationCaret}>▾</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
                <Text style={{ fontSize: 18 }}>🔔</Text>
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatarSmall} activeOpacity={0.8}>
                <Text style={styles.avatarSmallText}>AS</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search bar */}
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search electrician, plumber…"
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
              <Text style={{ fontSize: 16 }}>⚙️</Text>
            </TouchableOpacity>
          </View>

          {/* Quick stats strip */}
          <View style={styles.statsStrip}>
            {[
              { label: 'Pros Near You', value: '48' },
              { label: 'Avg Response', value: '8 min' },
              { label: 'Bookings Done', value: '12K+' },
            ].map((s, i) => (
              <View key={i} style={[styles.statItem, i < 2 && styles.statDivider]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── BANNERS ── */}
        <View style={styles.section}>
          <FlatList
            data={BANNERS}
            keyExtractor={i => i.id}
            renderItem={({ item }) => <BannerCard item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 48}
            decelerationRate="fast"
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 4 }}
            ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          />
        </View>

        {/* ── SERVICES ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={SERVICES}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <ServiceCard
                item={item}
                onPress={() => navigation?.navigate('ServiceList', { category: item.label })}
              />
            )}
            numColumns={4}
            scrollEnabled={false}
            contentContainerStyle={styles.serviceGrid}
            columnWrapperStyle={styles.serviceRow}
          />
        </View>

        {/* ── HOW IT WORKS ── */}
        <View style={[styles.section, styles.howItWorks]}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsRow}>
            {[
              { step: '1', icon: '🔍', label: 'Search' },
              { step: '2', icon: '📅', label: 'Book' },
              { step: '3', icon: '🏠', label: 'Get Service' },
            ].map((s, i) => (
              <View key={i} style={styles.stepItem}>
                <View style={styles.stepIconWrap}>
                  <Text style={styles.stepIcon}>{s.icon}</Text>
                </View>
                <View style={styles.stepNumBadge}>
                  <Text style={styles.stepNum}>{s.step}</Text>
                </View>
                <Text style={styles.stepLabel}>{s.label}</Text>
                {i < 2 && <View style={styles.stepArrow}><Text style={{ color: '#CBD5E1', fontSize: 18 }}>→</Text></View>}
              </View>
            ))}
          </View>
        </View>

        {/* ── NEARBY PROVIDERS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Nearby Pros</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={PROVIDERS}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <ProviderCard
                item={item}
                onPress={() => navigation?.navigate('ProviderDetail', { id: item.id })}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
            ItemSeparatorComponent={() => <View style={{ width: 14 }} />}
          />
        </View>

        {/* ── TRUST STRIP ── */}
        <View style={[styles.section, styles.trustStrip]}>
          {[
            { icon: '✅', label: 'Background\nVerified' },
            { icon: '⭐', label: 'Top Rated\nPros Only' },
            { icon: '🔒', label: 'Secure\nPayments' },
            { icon: '↩️', label: 'Easy\nRefunds' },
          ].map((t, i) => (
            <View key={i} style={styles.trustItem}>
              <Text style={styles.trustIcon}>{t.icon}</Text>
              <Text style={styles.trustLabel}>{t.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* ── BOTTOM NAV ── */}
      <View style={styles.bottomNav}>
        {[
          { id: 'home',     icon: '🏠', label: 'Home'     },
          { id: 'bookings', icon: '📋', label: 'Bookings'  },
          { id: 'wallet',   icon: '💳', label: 'Wallet'    },
          { id: 'profile',  icon: '👤', label: 'Profile'   },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text style={[
              styles.navLabel,
              activeTab === tab.id && styles.navLabelActive,
            ]}>
              {tab.label}
            </Text>
            {activeTab === tab.id && <View style={styles.navActiveDot} />}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1A56DB' },
  scroll: { flex: 1, backgroundColor: '#F8F9FF' },

  // Header
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 0, overflow: 'hidden' },
  blob1: { position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.08)' },
  blob2: { position: 'absolute', top: 30, right: 60, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.06)' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600', letterSpacing: 0.3 },
  userName: { fontSize: 22, color: '#FFFFFF', fontWeight: '800', marginTop: 2, letterSpacing: -0.3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  locationIcon: { fontSize: 11 },
  locationText: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginLeft: 3 },
  locationCaret: { fontSize: 10, color: 'rgba(255,255,255,0.7)', marginLeft: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.18)', justifyContent: 'center', alignItems: 'center' },
  notifDot: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#F43F5E', borderWidth: 1.5, borderColor: '#1A56DB' },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FEF9C3', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  avatarSmallText: { fontSize: 13, fontWeight: '800', color: '#B45309' },

  // Search
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 12 : 6, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 6 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#1E293B', fontWeight: '600' },
  filterBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center' },

  // Stats
  statsStrip: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 16, marginBottom: 0, paddingVertical: 14, paddingHorizontal: 10 },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { borderRightWidth: 1, borderRightColor: 'rgba(255,255,255,0.2)' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 2, textAlign: 'center' },

  // Section
  section: { marginTop: 24, paddingHorizontal: 0 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, color: '#1A56DB', fontWeight: '700' },

  // Banners
  bannerCard: { width: width - 56, borderRadius: 20, padding: 20, height: 110, overflow: 'hidden', justifyContent: 'center' },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 },
  bannerTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  bannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginTop: 2 },
  bannerBtn: { marginTop: 10, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
  bannerBtnText: { fontSize: 12, color: '#FFFFFF', fontWeight: '700' },
  bannerEmoji: { fontSize: 50, opacity: 0.9 },
  bannerCircle1: { position: 'absolute', right: -20, bottom: -30, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(255,255,255,0.1)' },
  bannerCircle2: { position: 'absolute', right: 40, top: -30, width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.08)' },

  // Services
  serviceGrid: { paddingHorizontal: 14, paddingTop: 4 },
  serviceRow: { justifyContent: 'space-between', marginBottom: 12 },
  serviceCard: { width: (width - 44) / 4, borderRadius: 16, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  serviceIconWrap: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 7 },
  serviceIcon: { fontSize: 20 },
  serviceLabel: { fontSize: 11, fontWeight: '800', textAlign: 'center' },
  serviceCount: { fontSize: 9, color: '#94A3B8', fontWeight: '600', marginTop: 2 },

  // How it works
  howItWorks: { backgroundColor: '#EFF6FF', marginHorizontal: 20, borderRadius: 20, padding: 18, paddingHorizontal: 20 },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 14, position: 'relative' },
  stepItem: { alignItems: 'center', position: 'relative' },
  stepIconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#1A56DB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  stepIcon: { fontSize: 24 },
  stepNumBadge: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#1A56DB', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#EFF6FF' },
  stepNum: { fontSize: 10, color: '#FFFFFF', fontWeight: '900' },
  stepLabel: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginTop: 8 },
  stepArrow: { position: 'absolute', right: -28, top: 16 },

  // Providers
  providerCard: { width: 175, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, position: 'relative' },
  availDot: { position: 'absolute', top: 14, right: 14, width: 10, height: 10, borderRadius: 5 },
  avatar: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 18, fontWeight: '900' },
  providerName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  providerRole: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  ratingNum: { fontSize: 12, color: '#1E293B', fontWeight: '700' },
  providerJobs: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 10 },
  providerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  providerPrice: { fontSize: 16, fontWeight: '900', color: '#1A56DB' },
  providerDist: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 10 },
  badgeText: { fontSize: 10, fontWeight: '800' },
  bookBtn: { backgroundColor: '#1A56DB', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  bookBtnText: { fontSize: 13, color: '#FFFFFF', fontWeight: '800' },

  // Trust
  trustStrip: { flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 20, borderRadius: 20, paddingVertical: 16, paddingHorizontal: 10, justifyContent: 'space-around', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  trustItem: { alignItems: 'center', flex: 1 },
  trustIcon: { fontSize: 22, marginBottom: 6 },
  trustLabel: { fontSize: 10, color: '#64748B', fontWeight: '700', textAlign: 'center', lineHeight: 14 },

  // Bottom nav
  bottomNav: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingVertical: 10, paddingBottom: Platform.OS === 'ios' ? 24 : 10, borderTopWidth: 1, borderTopColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 10 },
  navItem: { flex: 1, alignItems: 'center', position: 'relative', paddingTop: 4 },
  navIcon: { fontSize: 20, marginBottom: 3 },
  navLabel: { fontSize: 10, color: '#94A3B8', fontWeight: '700' },
  navLabelActive: { color: '#1A56DB' },
  navActiveDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#1A56DB', marginTop: 3 },
});