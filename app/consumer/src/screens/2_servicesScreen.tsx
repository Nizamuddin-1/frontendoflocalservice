/**
 * ServicesScreen.tsx — LocalFix Consumer App  (v3 — Editorial Warm)
 *
 * Phase 3 (modularization): the inline components (Stars, TrustStrip, CatPill,
 * Badge, ServiceCard, BookingSheet, FilterSheet), the design tokens, types,
 * mock data and the shared StyleSheet were extracted to src/. This screen now
 * composes the services feature components. UI & behavior unchanged.
 *   • Components / styles / tokens → @/src/components/services
 *   • Mock data                    → @/src/services/mock
 *   • Types                        → @/src/types
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import {
  C,
  F,
  styles,
  CatPill,
  TrustStrip,
  ServiceCard,
  FilterSheet,
  BookingSheet,
} from "@/src/components/services";
import { SORT_OPTIONS } from "@/src/services/mock";
import { useAppSelector, useAppDispatch } from "@/src/redux/store";
import { servicesSetCategory, servicesSetSearch, servicesSetSort, servicesSetSelected } from "@/src/redux/actions/appActions";
import type { Service, SortMode } from "@/src/types";

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ServicesScreen() {
  const dispatch = useAppDispatch();
  const { list: services, categories, activeCategory, searchQuery, sortMode, isLoading } = useAppSelector((s) => s.consumer.services);
  const [showFilter,   setShowFilter]   = useState(false);
  const [searchFocus,  setSearchFocus]  = useState(false);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [showBooking,  setShowBooking]  = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerShadow = scrollY.interpolate({ inputRange: [0, 50], outputRange: [0, 0.08], extrapolate: "clamp" });
  const headerElev   = scrollY.interpolate({ inputRange: [0, 50], outputRange: [0, 6],    extrapolate: "clamp" });

  useEffect(() => {
    // Only fetch if we don't have them yet or we want to force refresh on mount
    dispatch({ type: 'SERVICES_FETCH_REQUEST' }); // Let Redux know we started
    import("@/src/redux/actions/appActions").then(actions => {
      dispatch(actions.fetchServices() as any);
    });
  }, [dispatch]);

  const handleBook = useCallback((service: Service) => {
    setBookingService(service);
    setShowBooking(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setShowBooking(false);
    setTimeout(() => setBookingService(null), 320);
  }, []);

  const filtered = services
    .filter((s) => {
      const catOk  = activeCategory === "all" || s.categoryId === activeCategory;
      const termOk = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.provider.toLowerCase().includes(searchQuery.toLowerCase());
      return catOk && termOk;
    })
    .sort((a, b) => {
      if (sortMode === "rating")  return b.rating - a.rating;
      if (sortMode === "price")   return a.price  - b.price;
      if (sortMode === "newest")  return Number(b.id) - Number(a.id);
      return b.reviews - a.reviews;
    });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Sticky Header ── */}
      <Animated.View style={[styles.header, { shadowOpacity: headerShadow, elevation: headerElev }]}>

        {/* Row 1: Title + actions */}
        <View style={styles.headerRow1}>
          <View>
            <Text style={[styles.headerEyebrow, { fontFamily: F.bodyMed }]}>EXPLORE</Text>
            <Text style={[styles.headerTitle, { fontFamily: F.displayBold }]}>Services</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={20} color={C.inkMid} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8}>
              <Text style={[styles.avatarBtnText, { fontFamily: F.displaySemi }]}>AM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Location */}
        <TouchableOpacity style={styles.locationBar} activeOpacity={0.7}>
          <View style={styles.locationIconWrap}>
            <Ionicons name="location-sharp" size={14} color={C.terra} />
          </View>
          <Text style={[styles.locationText, { fontFamily: F.bodySemi }]}>Civil Lines, Agra</Text>
          <Text style={[styles.locationSub, { fontFamily: F.bodyReg }]}>  ·  Change area</Text>
          <Ionicons name="chevron-down" size={13} color={C.inkLight} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        {/* ── Row 3: IMPROVED Search bar + filter button ── */}
        <View style={styles.searchRow}>
          <View style={[styles.searchBar, searchFocus && styles.searchBarFocused]}>
            {/* Ionicons search icon — filled style when focused */}
            <View style={[styles.searchIconWrap, searchFocus && { backgroundColor: C.terraLight }]}>
              <Ionicons
                name={searchFocus ? "search" : "search-outline"}
                size={17}
                color={searchFocus ? C.terra : C.inkLight}
              />
            </View>
            <TextInput
              style={[styles.searchInput, { fontFamily: F.bodyMed }]}
              placeholder="Search services or providers…"
              placeholderTextColor={C.inkFaint}
              value={searchQuery}
              onChangeText={(text) => dispatch(servicesSetSearch(text))}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.searchClearBtn}
                onPress={() => dispatch(servicesSetSearch(""))}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={16} color={C.inkFaint} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilter(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="options" size={19} color={C.ink} />
            <View style={styles.filterDot} />
          </TouchableOpacity>
        </View>

      </Animated.View>

      {/* ── Main scroll ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {/* Row 4: Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catsRow}>
          {categories.map((cat) => (
            <CatPill key={cat.id} cat={cat} active={activeCategory === cat.id} onPress={() => dispatch(servicesSetCategory(cat.id))} />
          ))}
        </ScrollView>

        

        {/* Results bar */}
        <View style={styles.resultsBar}>
          <Text style={[styles.resultsText, { fontFamily: F.displaySemi }]}>
            {filtered.length}
            <Text style={[styles.resultsTextSub, { fontFamily: F.bodyReg }]}>{" "}result{filtered.length !== 1 ? "s" : ""}</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {SORT_OPTIONS.map((opt) => {
              const active = sortMode === opt.key;
              return (
                <TouchableOpacity key={opt.key} style={[styles.sortChip, active && styles.sortChipActive]} onPress={() => dispatch(servicesSetSort(opt.key))} activeOpacity={0.75}>
                  <Ionicons name={opt.icon as any} size={11} color={active ? "#FFF" : C.inkLight} style={{ marginRight: 4 }} />
                  <Text style={[styles.sortChipText, { fontFamily: active ? F.bodySemi : F.bodyMed }, active && { color: "#FFF" }]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Cards */}
        {isLoading ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontFamily: F.bodyReg, color: C.inkLight }}>Loading services...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="search-circle-outline" size={48} color={C.inkFaint} />
            </View>
            <Text style={[styles.emptyTitle, { fontFamily: F.displaySemi }]}>Nothing here</Text>
            <Text style={[styles.emptyBody,  { fontFamily: F.bodyReg   }]}>Try a different category or clear your search</Text>
            <TouchableOpacity style={styles.emptyReset} onPress={() => { dispatch(servicesSetCategory("all")); dispatch(servicesSetSearch("")); }} activeOpacity={0.8}>
              <Ionicons name="refresh-outline" size={14} color={C.terra} style={{ marginRight: 6 }} />
              <Text style={[styles.emptyResetText, { fontFamily: F.bodySemi }]}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((item, i) => (
            <ServiceCard key={(item as any)._id || item.id} item={item} index={i} onBook={handleBook} />
          ))
        )}
        <View style={{ height: 36 }} />
      </Animated.ScrollView>

      {/* Filter sheet */}
      <FilterSheet visible={showFilter} onClose={() => setShowFilter(false)} />

      {/* Booking / Variation sheet */}
      <BookingSheet service={bookingService} visible={showBooking} onClose={handleCloseBooking} />
    </View>
  );
}
