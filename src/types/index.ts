// ─────────────────────────────────────────────────────────────────────────────
//  Shared TypeScript Types
//  Extracted and consolidated from the 5 consumer screens. Each screen previously
//  re-declared its own interfaces inline; they are unified here.
//
//  NAME COLLISION NOTE:
//    Screen 1 and Screen 3 both declared an interface called `Booking` with
//    DIFFERENT shapes. To preserve both faithfully:
//      • Screen 1's preview-card shape  → `RecentBooking`
//      • Screen 3's full booking shape  → `Booking`
// ─────────────────────────────────────────────────────────────────────────────

// ── Common ───────────────────────────────────────────────────────────────────
export type BookingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type IconLib = 'ion' | 'mc';

// ═════════════════════════════════════════════════════════════════════════════
//  Screen 1 — Stats Landing / Home
// ═════════════════════════════════════════════════════════════════════════════

export interface StatItem {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  iconLib?: IconLib;
  color: string;
  bg: string;
  trend: string;
  trendPositive: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  iconLib?: IconLib;
  color: string;
  bg: string;
  proCount: number;
}

/** Home "recent bookings" preview card (screen 1's local `Booking`). */
export interface RecentBooking {
  id: string;
  service: string;
  provider: string;
  initials: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  rating?: number;
  color: string;
  bg: string;
  mcIcon: string;
  bookingRef: string;
}

export interface Promo {
  id: string;
  tag: string;
  headline: string;
  body: string;
  cta: string;
  accent: string;
  darkBg: string;
  mcIcon: string;
}

export interface Reward {
  id: string;
  label: string;
  icon: string;
  pts: number;
  color: string;
  bg: string;
}

// ═════════════════════════════════════════════════════════════════════════════
//  Screen 2 — Services Catalog
// ═════════════════════════════════════════════════════════════════════════════

export type SortMode = 'popular' | 'price' | 'rating' | 'newest';
export type BadgeType =
  | 'EDITOR PICK'
  | 'MOST BOOKED'
  | 'FLASH DEAL'
  | 'NEW LAUNCH'
  | 'PREMIUM'
  | 'BEST SELLER'
  | 'POPULAR'
  | 'EXPRESS'
  | 'SAFETY'
  | (string & {});

export interface ServiceVariation {
  id: string;
  label: string;
  desc: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  mcIcon: string;
  duration: string;
}

export interface Service {
  id: string;
  name: string;
  provider: string;
  providerInitials: string;
  categoryId: string;
  categoryLabel: string;
  mcIcon: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  badge?: BadgeType;
  tags: string[];
  eta: string;
  verified: boolean;
  accentColor: string;
  accentBg: string;
  jobCount: number;
  shortDesc: string;
  variations: ServiceVariation[];
}

/** Filter category pill in the services catalog (screen 2). */
export interface Category {
  id: string;
  label: string;
  ionIcon: string;
  color: string;
  bg: string;
  count: number;
}

export interface Feature {
  icon: string;
  label: string;
  value: string;
  color: string;
}

// ═════════════════════════════════════════════════════════════════════════════
//  Screen 3 — Bookings List
// ═════════════════════════════════════════════════════════════════════════════

export interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  category: string;
  mcIcon: string;
  status: BookingStatus;
  date: string;
  timeSlot: string;
  address: string;
  price: number;
  isPaid: boolean;
  bookingRef: string;
  accentColor: string;
  rating?: number;
  canReschedule?: boolean;
  canCancel?: boolean;
  canReview?: boolean;
  canTrack?: boolean;
  proAvatar: string; // initials fallback
}

// ═════════════════════════════════════════════════════════════════════════════
//  Screen 4 — Wallet
// ═════════════════════════════════════════════════════════════════════════════

export type TxType = 'credit' | 'debit' | 'refund' | 'cashback';
export type TxStatus = 'success' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TxType;
  status: TxStatus;
  date: string; // "Today" | "Yesterday" | "11 Mar" etc.
  time: string;
  icon: string;
  iconColor: string;
  bookingRef?: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  expiry: string;
  color: string;
  icon: string;
}

// ═════════════════════════════════════════════════════════════════════════════
//  Screen 5 — Profile
// ═════════════════════════════════════════════════════════════════════════════

export type MenuItemType = 'navigate' | 'toggle' | 'badge' | 'danger';

export interface MenuItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: string; // Ionicons name
  iconBg: string;
  iconColor: string;
  type: MenuItemType;
  badgeCount?: number;
  badgeText?: string;
  toggleKey?: string;
  destructive?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export interface ProfileStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  memberSince: string;
  avatar: string;
  tier: string;
  totalSpent: number;
  bookings: number;
  savedAddresses: number;
  loyaltyPoints: number;
}
