// ─── Menu Item ────────────────────────────────────────────────────────────────
// Extracted from 5_profileScreen.tsx (profile feature). Copied verbatim; the
// shared MenuItem.toggleKey is typed `string`, so it is narrowed to ToggleKey
// where used to index the toggles map (no behavior change).
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { C, F } from './tokens';
import { styles } from './profile.styles';
import type { Toggles, ToggleKey } from './constants';
import type { MenuItem } from '@/src/types';

export interface MenuItemRowProps {
  item: MenuItem;
  toggles: Toggles;
  onToggle: (key: ToggleKey) => void;
  isLast: boolean;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({ item, toggles, onToggle, isLast }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn  = () => Animated.spring(scaleAnim, { toValue: 0.977, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scaleAnim, { toValue: 1,     useNativeDriver: true, speed: 50 }).start();

  const isDestructive = item.destructive;
  const isToggle      = item.type === "toggle";
  const toggleKey     = item.toggleKey as ToggleKey | undefined;

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={isToggle ? 1 : 0.75}
          onPressIn={isToggle ? undefined : pressIn}
          onPressOut={isToggle ? undefined : pressOut}
          onPress={isToggle && toggleKey ? () => onToggle(toggleKey) : undefined}
        >
          {/* Icon */}
          <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
            <Ionicons
              name={item.icon as any}
              size={19}
              color={isDestructive ? item.iconColor : item.iconColor}
            />
          </View>

          {/* Text */}
          <View style={styles.menuTextBlock}>
            <Text style={[
              styles.menuLabel,
              { fontFamily: F.bodySemi },
              isDestructive && { color: item.iconColor },
            ]}>
              {item.label}
            </Text>
            {item.sublabel && (
              <Text style={[styles.menuSublabel, { fontFamily: F.bodyReg }]}>{item.sublabel}</Text>
            )}
          </View>

          {/* Right element */}
          {isToggle && toggleKey ? (
            <Switch
              value={toggles[toggleKey]}
              onValueChange={() => onToggle(toggleKey)}
              trackColor={{ false: C.border, true: C.blue + "99" }}
              thumbColor={toggles[toggleKey] ? C.blue : C.slateLight}
              style={{ transform: [{ scaleX: 0.88 }, { scaleY: 0.88 }] }}
            />
          ) : item.type === "badge" && item.badgeCount !== undefined ? (
            <View style={styles.menuBadge}>
              <Text style={[styles.menuBadgeText, { fontFamily: F.bodyBold }]}>
                {item.badgeCount}
              </Text>
            </View>
          ) : item.type === "badge" && item.badgeText ? (
            <View style={[styles.menuBadge, { backgroundColor: "#FFF0F5", borderColor: "#FBCFE8" }]}>
              <Text style={[styles.menuBadgeText, { fontFamily: F.bodyBold, color: "#E11D74" }]}>
                {item.badgeText}
              </Text>
            </View>
          ) : !isDestructive ? (
            <Ionicons name="chevron-forward" size={16} color={C.slateLight} />
          ) : null}
        </TouchableOpacity>
      </Animated.View>
      {!isLast && <View style={styles.menuDivider} />}
    </>
  );
};

export default MenuItemRow;
