// ─────────────────────────────────────────────
//  Screen 3 — Active Job
// ─────────────────────────────────────────────

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, Animated, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp }           from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Spacing, Radii } from '../theme';
import { SuccessButton, SectionLabel } from '../components';
import { JOB_STEPS, BOOKINGS, JOB_PAYOUT } from '../hooks/mockData';
import type { RootStackParamList, JobStep, JobStepState } from '../types';

type NavProp    = StackNavigationProp<RootStackParamList, 'ActiveJob'>;
type RouteProp2 = RouteProp<RootStackParamList, 'ActiveJob'>;
interface Props { navigation: NavProp; route: RouteProp2 }

const PROGRESS = 0.42;

const STEP_CFG: Record<JobStepState, { bg: string; iconColor: string; iconName: keyof typeof Feather.glyphMap }> = {
  done:    { bg: Colors.emerald2, iconColor: Colors.emerald3, iconName: 'check'    },
  current: { bg: Colors.accent,   iconColor: '#FFFFFF',       iconName: 'loader'   },
  pending: { bg: Colors.surface,  iconColor: Colors.ink4,     iconName: 'circle'   },
};

const StepItem: React.FC<{ step: JobStep; isLast: boolean }> = ({ step, isLast }) => {
  const cfg = STEP_CFG[step.state];
  return (
    <View style={s.stepRow}>
      <View style={s.stepLeft}>
        <View style={[s.stepCircle, { backgroundColor: cfg.bg }, step.state === 'current' && s.stepCircleCurrent]}>
          <Feather name={cfg.iconName} size={14} color={cfg.iconColor} />
        </View>
        {!isLast && <View style={[s.stepLine, step.state === 'done' && s.stepLineDone]} />}
      </View>
      <View style={[s.stepBody, !isLast && { paddingBottom: 20 }]}>
        <Text style={[s.stepName, step.state === 'pending' && { color: Colors.ink3 }]}>
          {step.label}
        </Text>
        <Text style={s.stepDetail}>{step.detail}</Text>
      </View>
    </View>
  );
};

export default function ActiveJobScreen({ navigation, route }: Props) {
  const [notes,    setNotes]    = useState<string>('');
  const [uploaded, setUploaded] = useState<boolean[]>([true, true, false, false]);

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, { toValue: PROGRESS, duration: 800, useNativeDriver: false }).start();
  }, []);

  const toggleUpload = useCallback((index: number) => {
    setUploaded((prev) => { const n = [...prev]; n[index] = !n[index]; return n; });
  }, []);

  const booking    = BOOKINGS.find((b) => b.id === route.params.bookingId) ?? BOOKINGS[0];
  const canComplete= uploaded.filter(Boolean).length >= 2;
  const uploadedCount = uploaded.filter(Boolean).length;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ───────────────────────────── */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <View>
            <Text style={s.headerMeta}>{booking.serviceType} · {booking.customer.name}</Text>
            <Text style={s.headerTitle}>Job in Progress</Text>
          </View>
          <View style={s.timerBadge}>
            <Feather name="clock" size={13} color={Colors.amber3} />
            <Text style={s.timerTxt}>45 min left</Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={s.progTrack}>
          <Animated.View
            style={[s.progFill, {
              width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
            }]}
          />
        </View>
        <View style={s.progLabels}>
          <Text style={s.progStart}>Started 11:02 AM</Text>
          <Text style={s.progPct}>{Math.round(PROGRESS * 100)}% done</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Steps ────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Job Progress</Text>
          <View style={s.stepsCard}>
            {JOB_STEPS.map((step, idx) => (
              <StepItem key={step.id} step={step} isLast={idx === JOB_STEPS.length - 1} />
            ))}
          </View>
        </View>

        {/* ── Photo Upload ─────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Upload Photos</Text>
          <View style={s.uploadCard}>
            <View style={s.uploadInfo}>
              <Feather name="camera" size={15} color={Colors.ink3} />
              <Text style={s.uploadInfoTxt}>{uploadedCount} of 4 photos uploaded</Text>
              {uploadedCount >= 2 && (
                <View style={s.uploadOkBadge}>
                  <Feather name="check" size={10} color={Colors.emerald3} />
                  <Text style={s.uploadOkTxt}>Ready</Text>
                </View>
              )}
            </View>

            <View style={s.photoRow}>
              {uploaded.map((isUp, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.photoThumb, isUp && s.photoThumbDone]}
                  onPress={() => toggleUpload(i)}
                  activeOpacity={0.7}
                >
                  {isUp ? (
                    <Feather name="check-circle" size={22} color={Colors.emerald} />
                  ) : (
                    <Feather name="plus" size={22} color={Colors.ink4} />
                  )}
                  <Text style={[s.photoLabel, isUp && { color: Colors.emerald3 }]}>
                    {isUp ? 'Uploaded' : 'Tap to add'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Notes ────────────────────────────── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Service Notes</Text>
          <TextInput
            style={s.notesInput}
            placeholder="Add notes for the customer about the work done…"
            placeholderTextColor={Colors.ink4}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* ── Footer ───────────────────────────────── */}
      <View style={s.footer}>
        {!canComplete && (
          <View style={s.footerHint}>
            <Feather name="info" size={13} color={Colors.amber3} />
            <Text style={s.footerHintTxt}>Upload at least 2 photos to complete</Text>
          </View>
        )}
        <SuccessButton
          label={canComplete ? 'Mark as Complete' : 'Upload Photos to Continue'}
          style={{ width: '100%', opacity: canComplete ? 1 : 0.55 }}
          icon={canComplete ? <Feather name="check" size={17} color="#fff" /> : undefined}
          onPress={() =>
            canComplete && navigation.replace('JobComplete', { bookingId: booking.id, payoutAmount: JOB_PAYOUT.net })
          }
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#FFFFFF' },
  scroll:  { flex: 1 },
  content: { paddingBottom: 8 },
  section: { paddingHorizontal: Spacing.lg, marginTop: 20 },
  sectionTitle: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.ink, marginBottom: 10 },

  // Header
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  headerMeta: { fontSize: FontSize.sm, color: Colors.ink3, fontWeight: FontWeight.medium, marginBottom: 3 },
  headerTitle:{ fontSize: 17, fontWeight: FontWeight.bold, color: Colors.ink },
  timerBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.amber2, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, borderWidth: 1, borderColor: 'rgba(217,119,6,0.2)' },
  timerTxt:   { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.amber3 },

  progTrack:  { height: 6, backgroundColor: Colors.surface, borderRadius: Radii.full, overflow: 'hidden' },
  progFill:   { height: 6, backgroundColor: Colors.accent, borderRadius: Radii.full },
  progLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  progStart:  { fontSize: FontSize.xs, color: Colors.ink4, fontWeight: FontWeight.medium },
  progPct:    { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.accent },

  // Steps
  stepsCard: { backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: 16, borderWidth: 1, borderColor: Colors.border },
  stepRow:   { flexDirection: 'row', gap: 12 },
  stepLeft:  { alignItems: 'center', width: 32 },
  stepCircle:{ width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  stepCircleCurrent: { borderColor: Colors.accent, borderWidth: 0 },
  stepLine:  { width: 2, flex: 1, marginTop: 4, backgroundColor: Colors.border, borderRadius: 1 },
  stepLineDone: { backgroundColor: Colors.emerald },
  stepBody:  { flex: 1, paddingTop: 6 },
  stepName:  { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.ink },
  stepDetail:{ fontSize: FontSize.sm, color: Colors.ink3, marginTop: 3, lineHeight: 17 },

  // Photos
  uploadCard: { backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: 14, borderWidth: 1, borderColor: Colors.border },
  uploadInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  uploadInfoTxt: { fontSize: FontSize.sm, color: Colors.ink3, flex: 1 },
  uploadOkBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: Colors.emerald2, borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  uploadOkTxt:   { fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.emerald3 },
  photoRow:  { flexDirection: 'row', gap: 8 },
  photoThumb:{
    flex: 1, height: 72,
    borderRadius: Radii.lg,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.border2,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  photoThumbDone: {
    backgroundColor: Colors.emerald2,
    borderStyle: 'solid',
    borderColor: 'rgba(5,150,105,0.3)',
  },
  photoLabel: { fontSize: FontSize.xs, color: Colors.ink4, fontWeight: FontWeight.medium },

  // Notes
  notesInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border2,
    borderRadius: Radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.ink,
    minHeight: 80,
    lineHeight: 22,
  },

  // Footer
  footer: { paddingHorizontal: Spacing.lg, paddingBottom: 16, paddingTop: 8, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: Colors.border },
  footerHint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  footerHintTxt: { fontSize: FontSize.sm, color: Colors.amber3, fontWeight: FontWeight.medium },
});
