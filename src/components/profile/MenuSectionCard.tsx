// ─── Menu Section Card ────────────────────────────────────────────────────────
// Extracted from 5_profileScreen.tsx (profile feature). Copied verbatim.
import React from 'react';
import { View, Text } from 'react-native';

import { F } from './tokens';
import { styles } from './profile.styles';
import { MenuItemRow } from './MenuItemRow';
import type { Toggles, ToggleKey } from './constants';
import type { MenuSection } from '@/src/types';

export interface MenuSectionCardProps {
  section: MenuSection;
  toggles: Toggles;
  onToggle: (key: ToggleKey) => void;
}

export const MenuSectionCard: React.FC<MenuSectionCardProps> = ({ section, toggles, onToggle }) => (
  <View style={styles.menuSection}>
    <Text style={[styles.menuSectionTitle, { fontFamily: F.bodySemi }]}>{section.title}</Text>
    <View style={styles.menuCard}>
      {section.items.map((item, i) => (
        <MenuItemRow
          key={item.id}
          item={item}
          toggles={toggles}
          onToggle={onToggle}
          isLast={i === section.items.length - 1}
        />
      ))}
    </View>
  </View>
);

export default MenuSectionCard;
