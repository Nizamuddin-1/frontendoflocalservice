// ─────────────────────────────────────────────────────────────────────────────
//  Ops Reducer — handles platform-level operations/admin state:
//    platform stats, user management, service management, system config
// ─────────────────────────────────────────────────────────────────────────────

export interface PlatformStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  activeServices: number;
  pendingApprovals: number;
}

interface OpsState {
  platformStats: PlatformStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: OpsState = {
  platformStats: {
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeServices: 0,
    pendingApprovals: 0,
  },
  isLoading: false,
  error: null,
};

type Action = { type: string; payload?: any };

export default function opsReducer(
  state: OpsState = initialState,
  action: Action
): OpsState {
  switch (action.type) {
    default:
      return state;
  }
}
