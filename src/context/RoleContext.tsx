// ─────────────────────────────────────────────────────────────────────────────
//  RoleContext — app role (consumer vs provider)
//  Phase 4 (minimal): provides a single source of truth for which sub-app is
//  active, so the provider app (previously unreachable) can be mounted via a
//  role switch in the entry route. Defaults to 'consumer'.
//
//  This is intentionally lightweight — when real auth lands, replace the default
//  state with the signed-in user's role (see the `// Later:` note in app/_layout).
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Role = 'consumer' | 'provider';

export const SAVED_ROLE_KEY = '@localfix_saved_role';

export async function getSavedRole(): Promise<Role | null> {
  try {
    const val = await AsyncStorage.getItem(SAVED_ROLE_KEY);
    if (val === 'consumer' || val === 'provider') return val;
    return null;
  } catch {
    return null;
  }
}

export async function setSavedRole(role: Role): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVED_ROLE_KEY, role);
  } catch {}
}

export async function clearSavedRole(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SAVED_ROLE_KEY);
  } catch {}
}

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
  isGuest: boolean;
  setIsGuest: (guest: boolean) => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode; initialRole?: Role }> = ({
  children,
  initialRole = 'consumer',
}) => {
  const [role, setRoleState] = useState<Role>(initialRole);
  const [isGuest, setIsGuest] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;
    getSavedRole().then((saved) => {
      if (mounted && saved) {
        setRoleState(saved);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    setSavedRole(newRole);
  }, []);

  const toggleRole = useCallback(() => {
    setRoleState((r) => {
      const next: Role = r === 'consumer' ? 'provider' : 'consumer';
      setSavedRole(next);
      return next;
    });
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole, isGuest, setIsGuest }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextValue => {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within a RoleProvider');
  return ctx;
};

export default RoleContext;
