// ─────────────────────────────────────────────
//  ServeNow Provider — TypeScript Types
// ─────────────────────────────────────────────

// ── Booking Status ──────────────────────────
export type BookingStatus = 'new' | 'active' | 'pending' | 'done' | 'cancelled';

// ── Navigation ──────────────────────────────
export type RootStackParamList = {
  MainTabs: undefined;
  BookingDetails: { bookingId: string };
  ActiveJob: { bookingId: string };
  JobComplete: { bookingId: string; payoutAmount: number };
};

export type MainTabParamList = {
  Home: undefined;
  Dashboard: undefined;
  Profile: undefined;
};

// ── Service Item ────────────────────────────
export interface ServiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// ── Provider Booking ────────────────────────
export interface Booking {
  id: string;
  requestNo: string;
  status: BookingStatus;
  serviceType: string;
  iconBg: string;
  customer: {
    id: string;
    name: string;
    initials: string;
    rating: number;
    totalOrders: number;
    phone: string;
  };
  services: ServiceItem[];
  location: {
    address: string;
    city: string;
    distanceKm: number;
    etaMins: number;
  };
  scheduledAt: string;
  durationMins: number;
  payment: string;
  totalAmount: number;
}

// ── Provider Profile ────────────────────────
export interface ProviderProfile {
  id: string;
  name: string;
  initials: string;
  category: string;
  rating: number;
  reviewCount: number;
  jobsDone: number;
  completionRate: number;
  totalEarned: number;
  isAvailable: boolean;
  phone: string;
  email: string;
  address: string;
  serviceCategories: string[];
  bank: {
    bankName: string;
    maskedNo: string;
    verified: boolean;
  };
  documents: {
    type: string;
    label: string;
    status: string;
  }[];
}

// ── Dashboard ───────────────────────────────
export interface DashboardStats {
  todayJobs: number;
  monthEarnings: number;
  avgRating: number;
  completionRate: number;
  jobsDone: number;
  monthGrowth: number;
}

export interface DashboardJob {
  id: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  name: string;
  jobType: string;
  status: string;
  timeLabel: string;
  amount: number;
  screen?: string;
}

export type FilterOption = 'All Jobs' | 'Today' | 'Pending' | 'Completed' | 'Cancelled';

// ── Job Steps ───────────────────────────────
export type JobStepState = 'done' | 'current' | 'pending';

export interface JobStep {
  id: number;
  label: string;
  detail: string;
  state: JobStepState;
}

// ── Payout ──────────────────────────────────
export interface PayoutRow {
  label: string;
  value: string;
  color?: string;
}

export interface Payout {
  serviceCharge: number;
  platformFee: number;
  tip: number;
  net: number;
  rows: PayoutRow[];
}

// ── Component Props ─────────────────────────
export interface StatCardProps {
  value: string;
  label: string;
  valueColor?: string;
}

export interface StatusChipProps {
  type: string;
  label: string;
}

export interface SectionHeaderProps {
  title: string;
  linkText?: string;
  onLink?: () => void;
}

export interface InfoRowProps {
  iconBg: string;
  iconChar: string;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  showArrow?: boolean;
  onPress?: () => void;
}

export interface MapPreviewProps {
  address: string;
  distance: string;
}

export interface PressableScaleProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  activeScale?: number;
}
