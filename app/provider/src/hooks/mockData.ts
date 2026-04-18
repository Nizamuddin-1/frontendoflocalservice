// ─────────────────────────────────────────────
//  ServeNow Provider — Mock Data
// ─────────────────────────────────────────────

import {
  Booking,
  ProviderProfile,
  DashboardStats,
  DashboardJob,
  JobStep,
  Payout,
} from '../types';
import { Colors } from '../theme';

// ── Provider Profile ──────────────────────────

export const PROVIDER_PROFILE: ProviderProfile = {
  id:               'prov_001',
  name:             'Ramesh Kumar',
  initials:         'RK',
  category:         'AC & Appliance Technician',
  rating:           4.8,
  reviewCount:      142,
  jobsDone:         47,
  completionRate:   96,
  totalEarned:      34200,
  isAvailable:      true,
  phone:            '+91 98765 43210',
  email:            'ramesh.kumar@servenow.in',
  address:          'Sector 14, Gurugram, HR',
  serviceCategories:['AC Repair', 'Appliances', 'Electrical'],
  bank: {
    bankName:   'HDFC Bank',
    maskedNo:   '4821',
    verified:   true,
  },
  documents: [
    { type: 'aadhaar',    label: 'Aadhaar Card',       status: 'verified' },
    { type: 'experience', label: 'Work Experience',     status: 'verified' },
    { type: 'background', label: 'Background Check',    status: 'verified' },
  ],
};

// ── Bookings ──────────────────────────────────

export const BOOKINGS: Booking[] = [
  {
    id:          'bk_001',
    requestNo:   'BK-2419',
    status:      'new',
    serviceType: 'AC Repair',
    iconBg:      Colors.accent2,
    customer: {
      id:          'cust_001',
      name:        'Priya Sharma',
      initials:    'PS',
      rating:      4.9,
      totalOrders: 23,
      phone:       '+91 98100 11234',
    },
    services: [
      { id: 's1', name: 'AC Service (1.5 ton)', quantity: 2, price: 500 },
      { id: 's2', name: 'Coolant Gas Refill',   quantity: 1, price: 200 },
    ],
    location: {
      address:    'Sector 14, Gurugram, HR',
      city:       'Gurugram',
      distanceKm: 3.2,
      etaMins:    9,
    },
    scheduledAt:  '2024-03-15T11:00:00+05:30',
    durationMins: 120,
    payment:      'prepaid',
    totalAmount:  1200,
  },
  {
    id:          'bk_002',
    requestNo:   'BK-2418',
    status:      'active',
    serviceType: 'Plumbing Fix',
    iconBg:      Colors.amber2,
    customer: {
      id:          'cust_002',
      name:        'Ravi Nair',
      initials:    'RN',
      rating:      4.7,
      totalOrders: 8,
      phone:       '+91 91234 56789',
    },
    services: [
      { id: 's3', name: 'Pipe Leak Fix', quantity: 1, price: 800 },
    ],
    location: {
      address:    'DLF Phase 2, Gurugram',
      city:       'Gurugram',
      distanceKm: 1.8,
      etaMins:    5,
    },
    scheduledAt:  '2024-03-15T12:30:00+05:30',
    durationMins: 60,
    payment:      'cash',
    totalAmount:  800,
  },
  {
    id:          'bk_003',
    requestNo:   'BK-2417',
    status:      'done',
    serviceType: 'Electrical Work',
    iconBg:      Colors.surface,
    customer: {
      id:          'cust_003',
      name:        'Sunita Das',
      initials:    'SD',
      rating:      4.6,
      totalOrders: 15,
      phone:       '+91 99887 76655',
    },
    services: [
      { id: 's4', name: 'Fan Installation', quantity: 1, price: 650 },
    ],
    location: {
      address:    'Sushant Lok, Gurugram',
      city:       'Gurugram',
      distanceKm: 2.1,
      etaMins:    7,
    },
    scheduledAt:  '2024-03-15T09:00:00+05:30',
    durationMins: 45,
    payment:      'upi',
    totalAmount:  650,
  },
  {
    id:          'bk_004',
    requestNo:   'BK-2416',
    status:      'pending',
    serviceType: 'Appliance Repair',
    iconBg:      Colors.purple2,
    customer: {
      id:          'cust_004',
      name:        'Anita Kapoor',
      initials:    'AK',
      rating:      5.0,
      totalOrders: 4,
      phone:       '+91 70011 22334',
    },
    services: [
      { id: 's5', name: 'Washing Machine Repair', quantity: 1, price: 950 },
    ],
    location: {
      address:    'Palam Vihar, Gurugram',
      city:       'Gurugram',
      distanceKm: 2.4,
      etaMins:    8,
    },
    scheduledAt:  '2024-03-16T10:00:00+05:30',
    durationMins: 90,
    payment:      'prepaid',
    totalAmount:  950,
  },
];

// ── Active Job Steps ──────────────────────────

export const JOB_STEPS: JobStep[] = [
  { id: 1, label: 'Arrived at location',       detail: 'Checked in at 11:02 AM',          state: 'done'    },
  { id: 2, label: 'OTP verified',               detail: 'Customer identity confirmed',      state: 'done'    },
  { id: 3, label: 'Service underway',           detail: 'Unit 1 done · Unit 2 in progress', state: 'current' },
  { id: 4, label: 'Upload before/after photos', detail: 'Required for completion',          state: 'pending' },
];

// ── Dashboard Stats ───────────────────────────

export const DASHBOARD_STATS: DashboardStats = {
  todayJobs:      12,
  monthEarnings:  34200,
  avgRating:      4.8,
  completionRate: 96,
  jobsDone:       47,
  monthGrowth:    18,
};

// ── Dashboard Jobs ────────────────────────────

export const DASHBOARD_JOBS: DashboardJob[] = [
  {
    id:         'bk_001',
    initials:   'PS',
    avatarBg:   Colors.accent2,
    avatarText: Colors.accent3,
    name:       'Priya Sharma',
    jobType:    'AC Repair · 2 units',
    status:     'new',
    timeLabel:  'Today · 11:00 AM · 3.2 km',
    amount:     1200,
    screen:     'BookingDetails',
  },
  {
    id:         'bk_002',
    initials:   'RN',
    avatarBg:   Colors.amber2,
    avatarText: Colors.amber3,
    name:       'Ravi Nair',
    jobType:    'Plumbing · Pipe Leak Fix',
    status:     'active',
    timeLabel:  'Today · 12:30 PM · 1.8 km',
    amount:     800,
    screen:     'ActiveJob',
  },
  {
    id:         'bk_003',
    initials:   'SD',
    avatarBg:   Colors.emerald2,
    avatarText: Colors.emerald3,
    name:       'Sunita Das',
    jobType:    'Electrical · Fan Fix',
    status:     'done',
    timeLabel:  'Today · 9:00 AM · Completed',
    amount:     650,
  },
  {
    id:         'bk_004',
    initials:   'AK',
    avatarBg:   Colors.purple2,
    avatarText: Colors.purple3,
    name:       'Anita Kapoor',
    jobType:    'Washing Machine Repair',
    status:     'pending',
    timeLabel:  'Tomorrow · 10:00 AM · 2.4 km',
    amount:     950,
  },
];

// ── Payout for bk_001 ─────────────────────────

export const JOB_PAYOUT: Payout = {
  serviceCharge: 1200,
  platformFee:   96,
  tip:           50,
  net:           1154,
  rows: [
    { label: 'Service charges',   value: '₹1,200'                           },
    { label: 'Platform fee (8%)', value: '−₹96',  color: Colors.rose3       },
    { label: 'Customer tip',      value: '+₹50',  color: Colors.emerald3    },
  ],
};
