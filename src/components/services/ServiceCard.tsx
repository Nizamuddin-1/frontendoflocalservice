// ─── Service Card ─────────────────────────────────────────────────────────────
// Extracted from 2_servicesScreen.tsx (services feature). Composes Stars + Badge.
import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { C, F } from './tokens';
import { styles } from './services.styles';
import { Stars } from './Stars';
import { Badge } from './Badge';
import type { Service } from '@/src/types';

export interface ServiceCardProps {
  item: Service;
  index: number;
  onBook: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ item, index, onBook }) => {
  const entryY = useRef(new Animated.Value(32)).current;
  const entryO = useRef(new Animated.Value(0)).current;
  const pressS = useRef(new Animated.Value(1)).current;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entryO, { toValue: 1, duration: 420, delay: index * 70, useNativeDriver: true }),
      Animated.spring(entryY, { toValue: 0, delay: index * 70, speed: 13, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const pressIn  = () => Animated.spring(pressS, { toValue: 0.972, useNativeDriver: true, speed: 60 }).start();
  const pressOut = () => Animated.spring(pressS, { toValue: 1,     useNativeDriver: true, speed: 60 }).start();

  const disc = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  return (
    <Animated.View style={[styles.card, { opacity: entryO, transform: [{ translateY: entryY }, { scale: pressS }] }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={pressIn} onPressOut={pressOut}>

        {/* ── Left accent strip with WHITE ICON BOX ── */}
        <View style={[styles.cardAccentStrip, { backgroundColor: item.accentColor }]}>
          {/* Subtle ghost watermark behind everything */}
          <MaterialCommunityIcons
            name={item.mcIcon as any}
            size={80}
            color="rgba(255,255,255,0.10)"
            style={styles.cardStripGhost}
          />

          {/* Category label — vertical */}
          <View style={styles.cardStripLabel}>
            <Text style={[styles.cardStripLabelText, { fontFamily: F.bodyBold }]} numberOfLines={1}>
              {item.categoryLabel.toUpperCase()}
            </Text>
          </View>

          {/* ── WHITE ICON BOX (the new highlighted element) ── */}
          <View style={styles.cardStripIconBox}>
            <MaterialCommunityIcons name={item.mcIcon as any} size={26} color={item.accentColor} />
          </View>

          {/* Jobs count badge at bottom */}
          <View style={styles.cardStripJobsBadge}>
            <Text style={[styles.cardStripJobsNum, { fontFamily: F.displaySemi }]}>
              {item.jobCount >= 1000 ? `${(item.jobCount / 1000).toFixed(1)}k` : item.jobCount}
            </Text>
            <Text style={[styles.cardStripJobsSub, { fontFamily: F.bodyReg }]}>jobs</Text>
          </View>
        </View>

        {/* ── Main content ── */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <Badge type={item.badge} />
            <TouchableOpacity
              style={[styles.wishlistBtn, liked && { backgroundColor: "#FEF2F2", borderColor: "#FECACA" }]}
              onPress={() => setLiked(!liked)}
              activeOpacity={0.7}
            >
              <Ionicons name={liked ? "heart" : "heart-outline"} size={16} color={liked ? "#EF4444" : C.inkFaint} />
            </TouchableOpacity>
          </View>

          <View style={styles.providerChip}>
            <View style={[styles.providerInitialsBox, { backgroundColor: item.accentBg, borderColor: item.accentColor + "33" }]}>
              <Text style={[styles.providerInitialsText, { color: item.accentColor, fontFamily: F.displaySemi }]}>
                {item.providerInitials}
              </Text>
            </View>
            <Text style={[styles.providerName, { fontFamily: F.bodyMed }]} numberOfLines={1}>{item.provider}</Text>
            {item.verified && <Ionicons name="shield-checkmark" size={12} color={C.sage} style={{ marginLeft: 3 }} />}
          </View>

          <Text style={[styles.serviceName, { fontFamily: F.displayBold }]} numberOfLines={2}>{item.name}</Text>
          <Text style={[styles.serviceDesc, { fontFamily: F.bodyReg }]} numberOfLines={2}>{item.shortDesc}</Text>

          <View style={styles.metaRow}>
            <Stars rating={item.rating} />
            <Text style={[styles.metaRatingNum, { fontFamily: F.bodyBold }]}>{item.rating}</Text>
            <Text style={[styles.metaRatingCount, { fontFamily: F.bodyReg }]}>({item.reviews.toLocaleString()})</Text>
            <View style={styles.metaDot} />
            <Ionicons name="time-outline" size={12} color={C.inkLight} />
            <Text style={[styles.metaETA, { fontFamily: F.bodyMed }]}>{item.eta}</Text>
          </View>

          <View style={styles.tagsRow}>
            {item.tags.slice(0, 3).map((t) => (
              <View key={t} style={styles.tagPill}>
                <Text style={[styles.tagText, { fontFamily: F.bodyMed }]}>{t}</Text>
              </View>
            ))}
            {disc && (
              <View style={styles.discPill}>
                <Ionicons name="pricetag" size={9} color={C.sage} style={{ marginRight: 3 }} />
                <Text style={[styles.discText, { fontFamily: F.bodyBold }]}>{disc}% off</Text>
              </View>
            )}
          </View>

          <View style={styles.cardRule} />

          <View style={styles.cardFooter}>
            <View>
              {item.originalPrice && (
                <Text style={[styles.priceOriginal, { fontFamily: F.bodyReg }]}>₹{item.originalPrice}</Text>
              )}
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3 }}>
                <Text style={[styles.priceValue, { fontFamily: F.displayBold }]}>₹{item.price}</Text>
                <Text style={[styles.priceUnit, { fontFamily: F.bodyReg }]}>onwards</Text>
              </View>
            </View>
            <View style={styles.ctaGroup}>
              <TouchableOpacity style={styles.detailBtn} activeOpacity={0.75}>
                <Ionicons name="information-circle-outline" size={17} color={C.inkMid} />
              </TouchableOpacity>
              {/* ── BOOK NOW → opens variation sheet ── */}
              <TouchableOpacity
                style={[styles.bookBtn, { backgroundColor: item.accentColor }]}
                activeOpacity={0.85}
                onPress={() => onBook(item)}
              >
                <Text style={[styles.bookBtnText, { fontFamily: F.bodySemi }]}>Book Now</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFF" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ServiceCard;
