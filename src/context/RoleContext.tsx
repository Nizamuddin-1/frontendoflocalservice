// ─────────────────────────────────────────────────────────────────────────────
//  RoleContext — app role (consumer vs provider)
//  Phase 4 (minimal): provides a single source of truth for which sub-app is
//  active, so the provider app (previously unreachable) can be mounted via a
//  role switch in the entry route. Defaults to 'consumer'.
//
//  This is intentionally lightweight — when real auth lands, replace the default
//  state with the signed-in user's role (see the `// Later:` note in app/_layout).
// ─────────────────────────────────────────────────────────────────────────────

import React, { createContext, useContext, useState, useCallback } from 'react';

export type Role = 'consumer' | 'provider';

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => void;
  toggleRole: () => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode; initialRole?: Role }> = ({
  children,
  initialRole = 'consumer',
}) => {
  const [role, setRole] = useState<Role>(initialRole);
  const toggleRole = useCallback(
    () => setRole((r) => (r === 'consumer' ? 'provider' : 'consumer')),
    []
  );
  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole }}>
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
