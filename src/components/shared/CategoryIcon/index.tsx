// ─────────────────────────────────────────────────────────────────────────────
//  CategoryIcon — robust category/service icon resolver
//  Resolves icon names to either MaterialCommunityIcons or Ionicons so that
//  category icons from the database or mock data render with the correct glyph
//  and without family mismatch warnings.
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Known icons that exist in MaterialCommunityIcons
const MC_ICONS: Record<string, string> = {
  'air-conditioner': 'air-conditioner',
  'broom': 'broom',
  'pipe-wrench': 'pipe-wrench',
  'lightning-bolt': 'lightning-bolt',
  'wind': 'weather-windy',
  'weather-windy': 'weather-windy',
  'spray-bottle': 'spray-bottle',
  'water-pump': 'water-pump',
  'fan': 'fan',
  'gauge': 'gauge',
  'cup-water': 'cup-water',
  'home': 'home',
  'home-city': 'home-city',
  'home-variant': 'home-variant',
  'power-socket-us': 'power-socket-us',
  'wrench': 'wrench',
  'tools': 'tools',
  'crown': 'crown',
  'star-four-points': 'star-four-points',
  'shield-star': 'shield-star',
  'cash-refund': 'cash-refund',
};

// Fallback mappings if an Ionicon is needed for an icon name
const ION_FALLBACKS: Record<string, string> = {
  'air-conditioner': 'snow-outline',
  'wind': 'cloud-outline',
  'broom': 'sparkles-outline',
  'pipe-wrench': 'construct-outline',
  'lightning-bolt': 'flash-outline',
  'spray-bottle': 'sparkles-outline',
  'water-pump': 'water-outline',
  'fan': 'refresh-outline',
  'gauge': 'speedometer-outline',
};

export interface CategoryIconProps {
  name?: string | null;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name,
  size = 20,
  color = '#000',
  style,
}) => {
  if (!name) {
    return <Ionicons name="grid-outline" size={size} color={color} style={style} />;
  }

  const trimmed = name.trim();

  // 1. If present in MaterialCommunityIcons mapping, use MaterialCommunityIcons
  if (MC_ICONS[trimmed]) {
    return (
      <MaterialCommunityIcons
        name={MC_ICONS[trimmed] as any}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  // 2. Fallback to Ionicons
  const ionName = ION_FALLBACKS[trimmed] || trimmed;
  return (
    <Ionicons
      name={ionName as any}
      size={size}
      color={color}
      style={style}
    />
  );
};

export default CategoryIcon;
