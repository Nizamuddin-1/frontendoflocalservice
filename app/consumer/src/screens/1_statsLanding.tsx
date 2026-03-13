// HomeScreen.js
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ServicesScreen from './2_servicesScreen';
import BookingsScreen from './3_bookingScreen';
import WalletScreen from './4_walletScreen';
import ProfileScreen from './5_profileScreen';

const { width } = Dimensions.get('window');

// ─── DATA ────────────────────────────────────────────────────────────────────

const SERVICES = [
  { id: '1', icon: 'flash-on', iconFamily: 'MaterialIcons', label: 'Electrician', color: '#FFF3CD', accent: '#F59E0B', count: '124 pros' },
  { id: '2', icon: 'pipe-wrench', iconFamily: 'MaterialCommunityIcons', label: 'Plumber', color: '#DBEAFE', accent: '#3B82F6', count: '98 pros' },
  { id: '3', icon: 'air-conditioner', iconFamily: 'MaterialCommunityIcons', label: 'AC Repair', color: '#D1FAE5', accent: '#10B981', count: '67 pros' },
  { id: '4', icon: 'content-cut', iconFamily: 'MaterialIcons', label: 'Salon', color: '#FCE7F3', accent: '#EC4899', count: '203 pros' },
  { id: '5', icon: 'broom', iconFamily: 'FontAwesome5', label: 'Cleaning', color: '#EDE9FE', accent: '#8B5CF6', count: '156 pros' },
  { id: '6', icon: 'hammer', iconFamily: 'FontAwesome5', label: 'Carpenter', color: '#FEF3C7', accent: '#D97706', count: '45 pros' },
  { id: '7', icon: 'bug', iconFamily: 'FontAwesome5', label: 'Pest Ctrl', color: '#DCFCE7', accent: '#16A34A', count: '32 pros' },
  { id: '8', icon: 'format-paint', iconFamily: 'MaterialIcons', label: 'Painter', color: '#FFE4E6', accent: '#F43F5E', count: '78 pros' },
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
  { id: '1', title: '50% OFF', sub: 'First Home Cleaning', color1: '#1A56DB', color2: '#0EA5E9', icon: 'broom', iconFamily: 'FontAwesome5' },
  { id: '2', title: 'AC Service',sub: 'Starting ₹399 only', color1: '#059669', color2: '#10B981', icon: 'air-conditioner', iconFamily: 'MaterialCommunityIcons' },
  { id: '3', title: 'Salon @Home',sub: 'Book in 60 seconds', color1: '#DB2777', color2: '#EC4899', icon: 'content-cut', iconFamily: 'MaterialIcons' },
];

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

const StarRating = ({ value }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Icon
        key={star}
        name={star <= Math.floor(value) ? 'star' : 'star-border'}
        size={12}
        color={star <= Math.floor(value) ? '#F59E0B' : '#94A3B8'}
        style={{ marginRight: 1 }}
      />
    ))}
    <Text style={[styles.text, styles.ratingNum]}> {value}</Text>
  </View>
);

const Badge = ({ label }) => (
  <View style={[
    styles.badge,
    { backgroundColor: label === 'Top Rated' ? '#FEF9C3' : '#D1FAE5' }
  ]}>
    <Icon 
      name={label === 'Top Rated' ? 'emoji-events' : 'verified'} 
      size={10} 
      color={label === 'Top Rated' ? '#B45309' : '#065F46'} 
      style={{ marginRight: 2 }}
    />
    <Text style={[
      styles.badgeText,
      { color: label === 'Top Rated' ? '#B45309' : '#065F46' }
    ]}>
      {label}
    </Text>
  </View>
);

const ServiceCard = ({ item, onPress }) => {
  const renderIcon = () => {
    try {
      if (item.iconFamily === 'MaterialIcons') {
        return <Icon name={item.icon} size={24} color={item.accent} />;
      } else if (item.iconFamily === 'MaterialCommunityIcons') {
        return <MaterialCommunityIcons name={item.icon} size={24} color={item.accent} />;
      } else if (item.iconFamily === 'FontAwesome5') {
        return <FontAwesome5 name={item.icon} size={24} color={item.accent} />;
      } else {
        return <FontAwesome name={item.icon} size={24} color={item.accent} />;
      }
    } catch (error) {
      console.log('Icon error:', item.icon, item.iconFamily);
      // Fallback icon
      return <Icon name="error" size={24} color={item.accent} />;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.serviceCard, { backgroundColor: item.color ,marginRight:4}]}
    >
      <View style={[styles.serviceIconWrap, { backgroundColor: item.accent + '22' }]}>
        {renderIcon()}
      </View>
      <Text style={[styles.serviceLabel, styles.text, { color: item.accent }]}>{item.label}</Text>
      <Text style={[styles.serviceCount, styles.text]}>{item.count}</Text>
    </TouchableOpacity>
  );
};

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
      <Text style={[styles.avatarText, styles.text, { color: item.avatarText }]}>{item.initials}</Text>
    </View>

    <Text style={[styles.providerName, styles.text]}>{item.name}</Text>
    <Text style={[styles.providerRole, styles.text]}>{item.role}</Text>

    <View style={styles.ratingRow}>
      <StarRating value={item.rating} />
    </View>

    <Text style={[styles.providerJobs, styles.text]}>{item.jobs} jobs done</Text>

    <View style={styles.providerFooter}>
      <Text style={[styles.providerPrice, styles.text]}>{item.price}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="location-on" size={10} color="#64748B" />
        <Text style={[styles.providerDist, styles.text]}> {item.dist}</Text>
      </View>
    </View>

    <Badge label={item.badge} />

    <TouchableOpacity style={styles.bookBtn} activeOpacity={0.8}>
      <Text style={[styles.bookBtnText, styles.text]}>Book Now</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

// Auto-scrolling Banner Component
const AutoScrollingBanners = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % banners.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const renderBanner = ({ item }) => {
    const renderIcon = () => {
      try {
        if (item.iconFamily === 'MaterialIcons') {
          return <Icon name={item.icon} size={50} color="#FFFFFF" style={{ opacity: 0.9 }} />;
        } else if (item.iconFamily === 'MaterialCommunityIcons') {
          return <MaterialCommunityIcons name={item.icon} size={50} color="#FFFFFF" style={{ opacity: 0.9 }} />;
        } else if (item.iconFamily === 'FontAwesome5') {
          return <FontAwesome5 name={item.icon} size={50} color="#FFFFFF" style={{ opacity: 0.9 }} />;
        } else {
          return <FontAwesome name={item.icon} size={50} color="#FFFFFF" style={{ opacity: 0.9 }} />;
        }
      } catch (error) {
        return <Icon name="error" size={50} color="#FFFFFF" style={{ opacity: 0.9 }} />;
      }
    };

    return (
      <LinearGradient
        colors={[item.color1, item.color2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.bannerCard}
      >
        <View style={styles.bannerContent}>
          <View>
            <Text style={[styles.bannerTitle, styles.text]}>{item.title}</Text>
            <Text style={[styles.bannerSub, styles.text]}>{item.sub}</Text>
            <TouchableOpacity style={styles.bannerBtn} activeOpacity={0.85}>
              <Text style={[styles.bannerBtnText, styles.text]}>Grab Deal</Text>
              <Icon name="arrow-forward" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          {renderIcon()}
        </View>
        {/* decorative circles */}
        <View style={styles.bannerCircle1} />
        <View style={styles.bannerCircle2} />
      </LinearGradient>
    );
  };

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={i => i.id}
        renderItem={renderBanner}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width - 48}
        decelerationRate="fast"
        snapToAlignment="center"
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 4 }}
        ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Professional Bottom Navigation with Pill-style Active Indicator
const BottomNavigation = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Home', activeIcon: 'home', iconFamily: 'MaterialIcons' },
    { id: 'bookings', icon: 'calendar-check', label: 'Bookings', activeIcon: 'calendar-check', iconFamily: 'MaterialCommunityIcons' },
    { id: 'wallet', icon: 'wallet', label: 'Wallet', activeIcon: 'wallet', iconFamily: 'MaterialCommunityIcons' },
    { id: 'profile', icon: 'account-circle', label: 'Profile', activeIcon: 'account-circle', iconFamily: 'MaterialIcons' },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        const renderIcon = () => {
          if (tab.iconFamily === 'MaterialIcons') {
            return <Icon name={isActive ? tab.activeIcon : tab.icon} size={24} color={isActive ? '#1A56DB' : '#94A3B8'} />;
          } else {
            return <MaterialCommunityIcons name={isActive ? tab.activeIcon : tab.icon} size={24} color={isActive ? '#1A56DB' : '#94A3B8'} />;
          }
        };

        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.navItem}
            activeOpacity={0.7}
            onPress={() => onTabPress(tab.id)}
          >
            <View style={[
              styles.navIconContainer,
              isActive && styles.navIconContainerActive
            ]}>
              {renderIcon()}
            </View>
            <Text style={[
              styles.navLabel,
              styles.text,
              isActive && styles.navLabelActive
            ]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.navActivePill} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('home');
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 160],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

     { false && <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={true}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* ── HEADER WITH WHITE BACKGROUND ── */}
        <Animated.View style={[styles.header, { height: headerHeight }]}>
          {/* White background instead of gradient */}
          <View style={[StyleSheet.absoluteFill, styles.headerWhiteBackground]} />
          
          {/* Decorative blobs - removed or made very light */}
          <View style={[styles.blob1, { backgroundColor: 'rgba(0,0,0,0.02)' }]} />
          <View style={[styles.blob2, { backgroundColor: 'rgba(0,0,0,0.01)' }]} />

          {/* Top row with black text */}
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.greeting, styles.text, styles.blackText]}>Good morning 👋</Text>
              <Text style={[styles.userName, styles.text, styles.blackText]}>Nizamuddin</Text>
              <View style={styles.locationRow}>
                <Icon name="location-on" size={12} color="#64748B" />
                <Text style={[styles.locationText, styles.text, styles.blackText]}>Rampur, Uttar Pradesh</Text>
                <Icon name="arrow-drop-down" size={16} color="#64748B" />
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={[styles.notifBtn, { backgroundColor: '#F1F5F9' }]} activeOpacity={0.8}>
                <Icon name="notifications-none" size={22} color="#1E293B" />
                <View style={[styles.notifDot, { borderColor: '#FFFFFF' }]} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.avatarSmall, { backgroundColor: '#FEF9C3', borderColor: '#E2E8F0' }]} activeOpacity={0.8}>
                <Text style={[styles.avatarSmallText, styles.text, { color: '#B45309' }]}>N</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick stats strip - White background with black text and shadow */}
          <View style={styles.statsStrip}>
            {[
              { label: 'Pros Near You', value: '48' },
              { label: 'Avg Response', value: '8 min' },
              { label: 'Bookings Done', value: '12K+' },
            ].map((s, i) => (
              <View key={i} style={[styles.statItem, i < 2 && styles.statDivider]}>
                <Text style={[styles.statValue, styles.text, styles.blackText]}>{s.value}</Text>
                <Text style={[styles.statLabel, styles.text, styles.blackText]}>{s.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* ── AUTO-SCROLLING BANNERS (Increased Height) ── */}
        <View style={styles.section}>
          <AutoScrollingBanners banners={BANNERS} />
        </View>

        {/* ── SERVICES ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, styles.text]}>Our Services</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.seeAll, styles.text]}>See all</Text>
              <Icon name="arrow-forward-ios" size={12} color="#1A56DB" style={{ marginLeft: 4 }} />
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
          <Text style={[styles.sectionTitle, styles.text]}>How It Works</Text>
          <View style={styles.stepsRow}>
            {[
              { step: '1', icon: 'search', label: 'Search', iconFamily: 'MaterialIcons' },
              { step: '2', icon: 'calendar-check', label: 'Book', iconFamily: 'MaterialCommunityIcons' },
              { step: '3', icon: 'home', label: 'Get Service', iconFamily: 'MaterialIcons' },
            ].map((s, i) => {
              const renderIcon = () => {
                if (s.iconFamily === 'MaterialIcons') {
                  return <Icon name={s.icon} size={24} color="#1A56DB" />;
                } else {
                  return <MaterialCommunityIcons name={s.icon} size={24} color="#1A56DB" />;
                }
              };

              return (
                <View key={i} style={styles.stepItem}>
                  <View style={styles.stepIconWrap}>
                    {renderIcon()}
                  </View>
                  <View style={styles.stepNumBadge}>
                    <Text style={[styles.stepNum, styles.text]}>{s.step}</Text>
                  </View>
                  <Text style={[styles.stepLabel, styles.text]}>{s.label}</Text>
                  {i < 2 && (
                    <View style={styles.stepArrow}>
                      <Icon name="arrow-forward-ios" size={14} color="#CBD5E1" />
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* ── NEARBY PROVIDERS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, styles.text]}>Top Nearby Pros</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.seeAll, styles.text]}>See all</Text>
              <Icon name="arrow-forward-ios" size={12} color="#1A56DB" style={{ marginLeft: 4 }} />
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
            { icon: 'verified', label: 'Background\nVerified', iconFamily: 'MaterialIcons' },
            { icon: 'star', label: 'Top Rated\nPros Only', iconFamily: 'MaterialIcons' },
            { icon: 'lock', label: 'Secure\nPayments', iconFamily: 'MaterialIcons' },
            { icon: 'refresh', label: 'Easy\nRefunds', iconFamily: 'MaterialIcons' },
          ].map((t, i) => (
            <View key={i} style={styles.trustItem}>
              <Icon name={t.icon} size={24} color="#1A56DB" />
              <Text style={[styles.trustLabel, styles.text]}>{t.label}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>}
      {/* <ProfileScreen/> */}
      <BookingsScreen/>
     {/*  <WalletScreen/> */}
       
    {/*   <ServicesScreen/> */}
    {/*  <ProfileScreen/> */}
      {/* ── PROFESSIONAL BOTTOM NAV WITH PILL INDICATOR ── */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </SafeAreaView>
  );
}

// ─── UPDATED STYLES ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1, backgroundColor: '#FFFFFF' },

  text: {
    fontFamily: 'Recoleta',
  },

  blackText: {
    color: '#1E293B',
  },

  // Header with white background
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    overflow: 'hidden',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  headerWhiteBackground: {
    backgroundColor: '#FFFFFF',
  },
  blob1: { 
    position: 'absolute', 
    top: -40, 
    right: -40, 
    width: 140, 
    height: 140, 
    borderRadius: 70, 
    backgroundColor: 'rgba(0,0,0,0.02)' 
  },
  blob2: { 
    position: 'absolute', 
    top: 30, 
    right: 60, 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    backgroundColor: 'rgba(0,0,0,0.01)' 
  },
  headerTop: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 18,
  },
  greeting: { 
    fontSize: 13, 
    color: '#64748B', 
    fontWeight: '600', 
    letterSpacing: 0.3,
  },
  userName: { 
    fontSize: 22, 
    color: '#1E293B', 
    fontWeight: '800', 
    marginTop: 2, 
    letterSpacing: -0.3,
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 5,
  },
  locationText: { 
    fontSize: 12, 
    color: '#64748B', 
    fontWeight: '600', 
    marginLeft: 3,
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10,
  },
  notifBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#F1F5F9', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  notifDot: { 
    position: 'absolute', 
    top: 8, 
    right: 8, 
    width: 8, 
    height: 8, 
    borderRadius: 4, 
    backgroundColor: '#F43F5E', 
    borderWidth: 1.5, 
    borderColor: '#FFFFFF',
  },
  avatarSmall: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: '#FEF9C3', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#E2E8F0',
  },
  avatarSmallText: { 
    fontSize: 13, 
    fontWeight: '800', 
    color: '#B45309',
  },

  // Stats - White background with black text and shadow
  statsStrip: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    paddingVertical: 14, 
    paddingHorizontal: 10,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Elevation for Android
    elevation: 5,
    // Border for subtle definition
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom:20
  },
  statItem: { 
    flex: 1, 
    alignItems: 'center',
  },
  statDivider: { 
    borderRightWidth: 1, 
    borderRightColor: '#E2E8F0',
  },
  statValue: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1E293B',
  },
  statLabel: { 
    fontSize: 10, 
    color: '#64748B', 
    fontWeight: '600', 
    marginTop: 2, 
    textAlign: 'center',
  },

  // Section
  section: { marginTop: 24, paddingHorizontal: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#1E293B', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, color: '#1A56DB', fontWeight: '700' },

  // Banners - INCREASED HEIGHT to 165px
  bannerCard: { 
    width: width - 56, 
    borderRadius: 20, 
    padding: 24, 
    height: 165,
    overflow: 'hidden', 
    justifyContent: 'center' ,
    marginHorizontal:50
  },
  bannerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 },
  bannerTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  bannerSub: { fontSize: 15, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginTop: 4 },
  bannerBtn: { 
    marginTop: 14, 
    backgroundColor: 'rgba(255,255,255,0.25)', 
    paddingHorizontal: 18, 
    paddingVertical: 8, 
    borderRadius: 24, 
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerBtnText: { fontSize: 14, color: '#FFFFFF', fontWeight: '700', marginRight: 2 },
  bannerCircle1: { position: 'absolute', right: -20, bottom: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,0.1)' },
  bannerCircle2: { position: 'absolute', right: 40, top: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.08)' },

  // Pagination Dots for Auto-scrolling
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A56DB',
  },

  // Services
  serviceGrid: { paddingHorizontal: 7, paddingTop: 4 },
  serviceRow: { justifyContent: 'space-between', marginBottom: 12 },
  serviceCard: { width: (width - 44) / 4, borderRadius: 16, padding: 10, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  serviceIconWrap: { width: 42, height: 42, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginBottom: 7 },
  serviceLabel: { fontSize: 11, fontWeight: '800', textAlign: 'center' },
  serviceCount: { fontSize: 9, color: '#94A3B8', fontWeight: '600', marginTop: 2 },

  // How it works
  howItWorks: { backgroundColor: '#F8FAFC', marginHorizontal: 20, borderRadius: 20, padding: 18, paddingHorizontal: 20 },
  stepsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 14, position: 'relative' },
  stepItem: { alignItems: 'center', position: 'relative' },
  stepIconWrap: { width: 56, height: 56, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#1A56DB', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  stepNumBadge: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, backgroundColor: '#1A56DB', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F8FAFC' },
  stepNum: { fontSize: 10, color: '#FFFFFF', fontWeight: '900' },
  stepLabel: { fontSize: 12, fontWeight: '700', color: '#1E293B', marginTop: 8 },
  stepArrow: { position: 'absolute', right: -28, top: 20 },

  // Providers
  providerCard: { width: 175, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4, position: 'relative',marginBottom:20 },
  availDot: { position: 'absolute', top: 14, right: 14, width: 10, height: 10, borderRadius: 5 },
  avatar: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { fontSize: 18, fontWeight: '900' },
  providerName: { fontSize: 15, fontWeight: '800', color: '#1E293B' },
  providerRole: { fontSize: 11, color: '#64748B', fontWeight: '600', marginTop: 2, marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  ratingNum: { fontSize: 12, color: '#1E293B', fontWeight: '700', marginLeft: 2 },
  providerJobs: { fontSize: 11, color: '#94A3B8', fontWeight: '600', marginBottom: 10 },
  providerFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  providerPrice: { fontSize: 16, fontWeight: '900', color: '#1A56DB' },
  providerDist: { fontSize: 11, color: '#64748B', fontWeight: '600' },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center',
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8, 
    alignSelf: 'flex-start', 
    marginBottom: 10 
  },
  badgeText: { fontSize: 10, fontWeight: '800', marginLeft: 2 },
  bookBtn: { backgroundColor: '#1A56DB', borderRadius: 12, paddingVertical: 10, alignItems: 'center' },
  bookBtnText: { fontSize: 13, color: '#FFFFFF', fontWeight: '800' },

  // Trust
  trustStrip: { 
    flexDirection: 'row', 
    backgroundColor: '#F8FAFC', 
    marginHorizontal: 20, 
    borderRadius: 20, 
    paddingVertical: 16, 
    paddingHorizontal: 10, 
    justifyContent: 'space-around', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.05, 
    shadowRadius: 8, 
    elevation: 2 
  },
  trustItem: { alignItems: 'center', flex: 1 },
  trustIcon: { fontSize: 22, marginBottom: 6 },
  trustLabel: { fontSize: 10, color: '#64748B', fontWeight: '700', textAlign: 'center', lineHeight: 14, marginTop: 4 },

  // PROFESSIONAL BOTTOM NAV WITH PILL-STYLE INDICATOR
  bottomNav: { 
    flexDirection: 'row', 
    backgroundColor: '#FFFFFF', 
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -8 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 16, 
    elevation: 20,
  },
  navItem: { 
    flex: 1, 
    alignItems: 'center', 
    position: 'relative',
    paddingVertical: 4,
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  navIconContainerActive: {
    backgroundColor: '#EFF6FF',
  },
  navLabel: { 
    fontSize: 11, 
    color: '#94A3B8', 
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  navLabelActive: { 
    color: '#1A56DB',
    fontWeight: '700',
  },
  navActivePill: { 
    position: 'absolute',
    bottom: -2,
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1A56DB',
    alignSelf: 'center',
  },
});