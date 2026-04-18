// ─────────────────────────────────────────────
//  ServeNow Provider — All Types & Interfaces
// ─────────────────────────────────────────────

// ── Booking / Job ─────────────────────────────

export type BookingStatus = 'new' | 'active' | 'pending' | 'done' | 'cancelled';
export type JobStepState  = 'done' | 'current' | 'pending';
export type PaymentMethod = 'prepaid' | 'cash' | 'upi';

export interface BookingCustomer {
  id:          string;
  name:        string;
  initials:    string;
  rating:      number;
  totalOrders: number;
  phone:       string;
}

export interface ServiceItem {
  id:       string;
  name:     string;
  quantity: number;
  price:    number;
}

export interface BookingLocation {
  address:    string;
  city:       string;
  distanceKm: number;
  etaMins:    number;
}

export interface Booking {
  id:           string;
  requestNo:    string;
  customer:     BookingCustomer;
  status:       BookingStatus;
  serviceType:  string;
  services:     ServiceItem[];
  location:     BookingLocation;
  scheduledAt:  string;   // ISO date string
  durationMins: number;
  payment:      PaymentMethod;
  totalAmount:  number;
  iconBg:       string;
}

// ── Job Step ──────────────────────────────────

export interface JobStep {
  id:     number;
  label:  string;
  detail: string;
  state:  JobStepState;
}

// ── Payout ────────────────────────────────────

export interface PayoutRow {
  label: string;
  value: string;
  color?: string;
}

export interface Payout {
  serviceCharge: number;
  platformFee:   number;
  tip:           number;
  net:           number;
  rows:          PayoutRow[];
}

// ── Provider Profile ──────────────────────────

export interface BankAccount {
  bankName:    string;
  maskedNo:    string;
  verified:    boolean;
}

export interface Document {
  type:    'aadhaar' | 'experience' | 'background';
  label:   string;
  status:  'verified' | 'pending' | 'rejected';
}

export interface ProviderProfile {
  id:               string;
  name:             string;
  initials:         string;
  category:         string;
  rating:           number;
  reviewCount:      number;
  jobsDone:         number;
  completionRate:   number;
  totalEarned:      number;
  isAvailable:      boolean;
  phone:            string;
  email:            string;
  address:          string;
  serviceCategories:string[];
  bank:             BankAccount;
  documents:        Document[];
}

// ── Dashboard ─────────────────────────────────

export type FilterOption = 'All Jobs' | 'Today' | 'Pending' | 'Completed' | 'Cancelled';

export interface DashboardStats {
  todayJobs:      number;
  monthEarnings:  number;
  avgRating:      number;
  completionRate: number;
  jobsDone:       number;
  monthGrowth:    number;
}

export interface DashboardJob {
  id:        string;
  initials:  string;
  avatarBg:  string;
  avatarText:string;
  name:      string;
  jobType:   string;
  status:    BookingStatus;
  timeLabel: string;
  amount:    number;
  screen?:   keyof RootStackParamList;
}

// ── Navigation ────────────────────────────────

export type RootStackParamList = {
  MainTabs:        undefined;
  BookingDetails:  { bookingId: string };
  ActiveJob:       { bookingId: string };
  JobComplete:     { bookingId: string; payoutAmount: number };
};

export type MainTabParamList = {
  Home:       undefined;
  Dashboard:  undefined;
  Profile:    undefined;
};

// ── Component Props ───────────────────────────

export interface StatCardProps {
  value:       string;
  label:       string;
  valueColor?: string;
}

export interface StatusChipProps {
  type:  BookingStatus;
  label: string;
}

export interface BookingCardProps {
  booking:  Booking;
  onPress?: () => void;
}

export interface InfoRowProps {
  iconBg:        string;
  iconChar:      string;
  title:         string;
  subtitle?:     string;
  badge?:        string;
  badgeColor?:   string;
  showArrow?:    boolean;
  onPress?:      () => void;
}

export interface SectionHeaderProps {
  title:      string;
  linkText?:  string;
  onLink?:    () => void;
}

export interface MapPreviewProps {
  address:  string;
  distance: string;
}

export interface PressableScaleProps {
  children:     React.ReactNode;
  onPress?:     () => void;
  style?:       object | object[];
  activeScale?: number;
}
