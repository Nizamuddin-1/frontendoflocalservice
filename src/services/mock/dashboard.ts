// ─────────────────────────────────────────────────────────────────────────────
//  Mock Data — Dashboard (home stats, promos, rewards, wallet, profile)
//  Extracted from:
//    • app/consumer/src/screens/1_statsLanding.tsx → STATS, PROMOS, REWARDS, loyalty
//    • app/consumer/src/screens/4_walletScreen.tsx → TRANSACTIONS, OFFERS, ADD_AMOUNTS,
//                                                     TX_TIME_TABS
//    • app/consumer/src/screens/5_profileScreen.tsx → USER, STATS, MENU_SECTIONS
//  Color references rewired to the unified theme palette.
//  (Wallet + profile data live here too, to keep the mock layer to the three
//   files defined for Phase 1.)
// ─────────────────────────────────────────────────────────────────────────────

import { Colors as C } from '../../theme';
import type {
  StatItem,
  Promo,
  Reward,
  Transaction,
  Offer,
  UserProfile,
  ProfileStat,
  MenuSection,
} from '../../types';

// ═════════════════════════════════════════════════════════════════════════════
//  Home dashboard (screen 1)
// ═════════════════════════════════════════════════════════════════════════════

export const HOME_STATS: StatItem[] = [
  { id: 's1', label: 'Bookings Done',   value: '14',        icon: 'checkmark-circle', color: C.sage,   bg: C.sageBg,    trend: '+3 this month',          trendPositive: true  },
  { id: 's2', label: 'Total Saved',     value: '₹2,340',    icon: 'pricetag',         color: C.gold,   bg: C.goldLight, trend: 'via offers & wallet',     trendPositive: true  },
  { id: 's3', label: 'Wallet Balance',  value: '₹3,613',    icon: 'wallet',           color: C.cobalt, bg: C.cobaltBg,  trend: '₹60 cashback earned',     trendPositive: true  },
  { id: 's4', label: 'Loyalty Points',  value: '1,240 pts', icon: 'star',             color: C.terra,  bg: C.terraLight, trend: 'Redeem before Apr',      trendPositive: false },
  { id: 's5', label: 'Avg Rating Given', value: '4.8', subValue: '/ 5.0', icon: 'heart', color: C.plum, bg: C.plumBg,   trend: 'Top reviewer badge',      trendPositive: true  },
  { id: 's6', label: 'Active Offers',   value: '3',         icon: 'gift',             color: C.teal,   bg: C.tealBg,    trend: '1 expiring soon',         trendPositive: false },
];

export const PROMOS: Promo[] = [
  {
    id: 'p1',
    tag: 'LIMITED TIME',
    headline: 'Flat ₹150 Off',
    body: 'On your first AC or Electrical booking. Use code at checkout.',
    cta: 'Grab Deal',
    accent: C.cobaltMid,
    darkBg: '#0B1829',
    mcIcon: 'lightning-bolt',
  },
  {
    id: 'p2',
    tag: 'WALLET OFFER',
    headline: '10% Cashback',
    body: 'Add ₹1,000 or more to your LocalFix wallet and earn instant cashback.',
    cta: 'Add Money',
    accent: C.sage,
    darkBg: '#0E1F18',
    mcIcon: 'wallet-plus-outline',
  },
  {
    id: 'p3',
    tag: 'NEW USER',
    headline: 'Free Inspection',
    body: 'Book any Plumbing service and get a complimentary health checkup.',
    cta: 'Book Now',
    accent: C.terra,
    darkBg: '#1F0F09',
    mcIcon: 'wrench-outline',
  },
];

// Loyalty / rewards summary (screen 1)
export const LOYALTY = {
  points:        1240,
  pointsToRedeem: 2000,
  cashbackEarned: 60,
  tierLabel:     'Silver',
  tierNext:      'Gold',
  tierIcon:      'medal-outline',
} as const;

export const REWARDS: Reward[] = [
  { id: 'r1', label: '₹50 Off',      icon: 'ticket-percent-outline', pts: 500,  color: C.terra,  bg: C.terraTint },
  { id: 'r2', label: 'Free Visit',    icon: 'home-outline',           pts: 800,  color: C.sage,   bg: C.sageBg    },
  { id: 'r3', label: 'Priority Slot', icon: 'flash-outline',          pts: 1000, color: C.cobalt, bg: C.cobaltBg  },
  { id: 'r4', label: '₹200 Off',     icon: 'gift-outline',           pts: 1500, color: C.plum,   bg: C.plumBg    },
];

// ═════════════════════════════════════════════════════════════════════════════
//  Wallet (screen 4)
// ═════════════════════════════════════════════════════════════════════════════

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', title: 'Added via UPI',                 subtitle: 'Google Pay • XXXX4521',                 amount: 2000, type: 'credit',   status: 'success', date: 'Today',      time: '11:34 AM', icon: 'bank-transfer-in', iconColor: C.green },
  { id: 't2', title: 'AC Deep Service & Gas Refill',  subtitle: 'Agra Air Solutions • LF-2024-0891',     amount: 1199, type: 'debit',    status: 'success', date: 'Today',      time: '2:10 PM',  icon: 'air-conditioner',  iconColor: C.blue,     bookingRef: 'LF-2024-0891' },
  { id: 't3', title: 'Cashback Reward',               subtitle: '5% cashback on AC service',             amount: 60,   type: 'cashback', status: 'success', date: 'Today',      time: '2:11 PM',  icon: 'gift-outline',     iconColor: C.goldWarm },
  { id: 't4', title: 'Deep Home Cleaning',            subtitle: 'CleanPro Home Care • LF-2024-0880',     amount: 1499, type: 'debit',    status: 'success', date: 'Yesterday',  time: '11:00 AM', icon: 'spray-bottle',     iconColor: C.purple,   bookingRef: 'LF-2024-0880' },
  { id: 't5', title: 'Refund Processed',              subtitle: 'Bathroom Fixture • LF-2024-0865',       amount: 599,  type: 'refund',   status: 'success', date: 'Yesterday',  time: '9:45 AM',  icon: 'cash-refund',      iconColor: C.teal,     bookingRef: 'LF-2024-0865' },
  { id: 't6', title: 'Added via Net Banking',         subtitle: 'SBI • XXXX8890',                        amount: 3000, type: 'credit',   status: 'success', date: 'This Month', time: '4:20 PM',  icon: 'bank-outline',     iconColor: C.green },
  { id: 't7', title: 'Interior Wall Painting',        subtitle: 'PaintMaster Pro • LF-2024-0871',        amount: 8500, type: 'debit',    status: 'success', date: 'This Month', time: '9:00 AM',  icon: 'format-paint',     iconColor: C.red,      bookingRef: 'LF-2024-0871' },
  { id: 't8', title: 'Wiring & MCB Replacement',      subtitle: 'SparkFix Electricals • LF-2024-0893',   amount: 649,  type: 'debit',    status: 'pending', date: 'This Month', time: '9:00 AM',  icon: 'lightning-bolt',   iconColor: C.amber,    bookingRef: 'LF-2024-0893' },
];

export const OFFERS: Offer[] = [
  { id: 'o1', title: 'Flat ₹150 Off',  subtitle: 'On your next AC or Electrical booking',    discount: '₹150', code: 'LOCALFIX150', expiry: 'Expires 31 Mar',   color: C.blue,   icon: 'lightning-bolt'  },
  { id: 'o2', title: '10% Cashback',   subtitle: 'Add ₹1000+ to wallet & get cashback',      discount: '10%',  code: 'WALLET10',    expiry: 'Expires 20 Mar',   color: C.green,  icon: 'wallet-outline'  },
  { id: 'o3', title: 'Free Inspection', subtitle: 'On first Plumbing or Carpentry booking',  discount: 'FREE', code: 'FIRSTFIX',    expiry: 'Limited period',   color: C.purple, icon: 'wrench-outline'  },
];

export const ADD_AMOUNTS: number[] = [200, 500, 1000, 2000, 5000];

export const TX_TIME_TABS: { key: string; label: string }[] = [
  { key: 'all',        label: 'All'        },
  { key: 'Today',      label: 'Today'      },
  { key: 'Yesterday',  label: 'Yesterday'  },
  { key: 'This Month', label: 'This Month' },
];

// ═════════════════════════════════════════════════════════════════════════════
//  Profile (screen 5)
// ═════════════════════════════════════════════════════════════════════════════

export const USER: UserProfile = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@gmail.com',
  phone: '+91 98765 43210',
  location: 'Civil Lines, Agra, UP',
  memberSince: 'Jan 2023',
  avatar: 'AM',
  tier: 'Gold Member',
  totalSpent: 24850,
  bookings: 18,
  savedAddresses: 3,
  loyaltyPoints: 1240,
};

export const PROFILE_STATS: ProfileStat[] = [
  { label: 'Bookings',  value: '18',    icon: 'receipt-outline',  color: C.blue   },
  { label: 'Saved',     value: '₹2.4k', icon: 'wallet-outline',   color: C.green  },
  { label: 'Points',    value: '1,240', icon: 'star-outline',     color: C.amber  },
  { label: 'Addresses', value: '3',     icon: 'location-outline', color: C.purple },
];

export const MENU_SECTIONS: MenuSection[] = [
  {
    title: 'Account',
    items: [
      {
        id: 'personal',
        label: 'Personal Information',
        sublabel: 'Name, email, phone',
        icon: 'person-outline',
        iconBg: C.blueTint,
        iconColor: C.blue,
        type: 'navigate',
      },
      {
        id: 'addresses',
        label: 'Saved Addresses',
        sublabel: '3 addresses saved',
        icon: 'location-outline',
        iconBg: C.purpleBg,
        iconColor: C.purple,
        type: 'badge',
        badgeCount: 3,
      },
      {
        id: 'refer',
        label: 'Refer & Earn',
        sublabel: 'Earn ₹100 per referral',
        icon: 'gift-outline',
        iconBg: '#FFF0F5',
        iconColor: '#E11D74',
        type: 'badge',
        badgeText: '₹100',
      },
    ],
  },
  {
    title: 'Danger Zone',
    items: [
      {
        id: 'logout',
        label: 'Log Out',
        icon: 'log-out-outline',
        iconBg: C.amberBg,
        iconColor: C.amber,
        type: 'danger',
      },
      {
        id: 'deleteAccount',
        label: 'Delete Account',
        sublabel: 'Permanently remove your data',
        icon: 'trash-outline',
        iconBg: C.redBg,
        iconColor: C.red,
        type: 'danger',
        destructive: true,
      },
    ],
  },
];
