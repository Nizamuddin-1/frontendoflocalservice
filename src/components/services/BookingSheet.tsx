// ─── Book Now Bottom Sheet ────────────────────────────────────────────────────
// Extracted from 2_servicesScreen.tsx (services feature).
import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Modal, Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { C, F } from './tokens';
import { styles } from './services.styles';
import type { Service } from '@/src/types';

const { height } = Dimensions.get('window');

export interface BookingSheetProps {
  service: Service | null;
  visible: boolean;
  onClose: () => void;
}

export const BookingSheet: React.FC<BookingSheetProps> = ({ service, visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const [selectedVar, setSelectedVar] = useState<string | null>(null);

  useEffect(() => {
    if (visible && service) {
      // Auto-select popular variant
      const popular = service.variations.find(v => v.popular);
      setSelectedVar(popular?.id ?? service.variations[0]?.id ?? null);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 3 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: height, duration: 280, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, service]);

  if (!service) return null;

  const chosen = service.variations.find(v => v.id === selectedVar);
  const discPct = chosen?.originalPrice
    ? Math.round(((chosen.originalPrice - chosen.price) / chosen.originalPrice) * 100)
    : null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[styles.sheetOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.bookSheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.sheetHandle} />

        {/* Header */}
        <View style={styles.bookSheetHeader}>
          <View style={[styles.bookSheetHeaderIcon, { backgroundColor: service.accentBg }]}>
            <MaterialCommunityIcons name={service.mcIcon as any} size={20} color={service.accentColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bookSheetTitle, { fontFamily: F.displayBold }]} numberOfLines={1}>
              {service.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text style={[styles.bookSheetProvider, { fontFamily: F.bodyMed }]}>{service.provider}</Text>
              {service.verified && <Ionicons name="shield-checkmark" size={11} color={C.sage} />}
            </View>
          </View>
          <TouchableOpacity style={styles.bookSheetCloseBtn} onPress={onClose} activeOpacity={0.75}>
            <Ionicons name="close" size={18} color={C.inkLight} />
          </TouchableOpacity>
        </View>

        {/* Section label */}
        <Text style={[styles.bookSheetSectionLabel, { fontFamily: F.bodyBold }]}>Choose a Package</Text>

        {/* Variations list */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.varScroll} contentContainerStyle={{ paddingBottom: 8 }}>
          {service.variations.map((v) => {
            const isSelected = selectedVar === v.id;
            const vDisc = v.originalPrice
              ? Math.round(((v.originalPrice - v.price) / v.originalPrice) * 100)
              : null;
            return (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.varCard,
                  isSelected && { borderColor: service.accentColor, borderWidth: 2, backgroundColor: service.accentBg + "60" },
                ]}
                onPress={() => setSelectedVar(v.id)}
                activeOpacity={0.85}
              >
                {/* Selected indicator */}
                <View style={[
                  styles.varRadio,
                  isSelected
                    ? { backgroundColor: service.accentColor, borderColor: service.accentColor }
                    : { borderColor: C.rule, backgroundColor: C.surface },
                ]}>
                  {isSelected && <View style={styles.varRadioDot} />}
                </View>

                {/* Icon */}
                <View style={[styles.varIconBox, { backgroundColor: isSelected ? service.accentColor + "20" : C.tag }]}>
                  <MaterialCommunityIcons name={v.mcIcon as any} size={18} color={isSelected ? service.accentColor : C.inkLight} />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <Text style={[styles.varLabel, { fontFamily: F.displaySemi, color: isSelected ? service.accentColor : C.ink }]}>
                      {v.label}
                    </Text>
                    {v.popular && (
                      <View style={[styles.varPopularBadge, { backgroundColor: service.accentColor }]}>
                        <Text style={[styles.varPopularText, { fontFamily: F.bodyBold }]}>POPULAR</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.varDesc, { fontFamily: F.bodyReg }]} numberOfLines={2}>{v.desc}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Ionicons name="time-outline" size={11} color={C.inkFaint} />
                    <Text style={[styles.varDuration, { fontFamily: F.bodyReg }]}>{v.duration}</Text>
                  </View>
                </View>

                {/* Price */}
                <View style={styles.varPriceBlock}>
                  {v.originalPrice && (
                    <Text style={[styles.varOriginalPrice, { fontFamily: F.bodyReg }]}>₹{v.originalPrice}</Text>
                  )}
                  <Text style={[styles.varPrice, { fontFamily: F.displayBold, color: isSelected ? service.accentColor : C.ink }]}>
                    ₹{v.price}
                  </Text>
                  {vDisc && (
                    <View style={[styles.varDiscBadge, { backgroundColor: C.sageBg }]}>
                      <Text style={[styles.varDiscText, { fontFamily: F.bodyBold }]}>{vDisc}% off</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* What's included note */}
        <View style={styles.bookSheetIncludesRow}>
          <Ionicons name="checkmark-circle" size={14} color={C.sage} style={{ marginRight: 6 }} />
          <Text style={[styles.bookSheetIncludesText, { fontFamily: F.bodyReg }]}>
            Includes visit charges · Spare parts billed separately
          </Text>
        </View>

        {/* Footer CTA */}
        <View style={styles.bookSheetFooter}>
          <View>
            <Text style={[styles.bookSheetFooterLabel, { fontFamily: F.bodyReg }]}>Selected package</Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
              <Text style={[styles.bookSheetFooterPrice, { fontFamily: F.displayBold }]}>
                ₹{chosen?.price ?? service.price}
              </Text>
              {discPct && (
                <Text style={[styles.bookSheetFooterDisc, { fontFamily: F.bodySemi }]}>{discPct}% off</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.bookSheetCTA, { backgroundColor: service.accentColor }]}
            activeOpacity={0.88}
            onPress={onClose}
          >
            <Ionicons name="calendar-outline" size={16} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={[styles.bookSheetCTAText, { fontFamily: F.bodySemi }]}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default BookingSheet;
