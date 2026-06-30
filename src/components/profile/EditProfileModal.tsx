// ─── Edit Profile Modal ───────────────────────────────────────────────────────
// Extracted from 5_profileScreen.tsx (profile feature). Copied verbatim; user
// data (USER) now sourced from the mock layer.
import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { C, F } from './tokens';
import { styles } from './profile.styles';
import { USER } from '@/src/services/mock';

export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 3 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 600, duration: 240, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,   duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const fields = [
    { label: "Full Name",    value: USER.name,     icon: "person-outline"   },
    { label: "Email",        value: USER.email,    icon: "mail-outline"     },
    { label: "Phone",        value: USER.phone,    icon: "call-outline"     },
    { label: "City / Area",  value: USER.location, icon: "location-outline" },
  ];

  return (
    <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.modalHandle} />

        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { fontFamily: F.displaySemi }]}>Edit Profile</Text>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color={C.slate} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.modalAvatarRow}>
          <View style={styles.modalAvatar}>
            <Text style={[styles.modalAvatarText, { fontFamily: F.displayBold }]}>AM</Text>
          </View>
          <TouchableOpacity style={styles.modalAvatarEditBtn} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={14} color={C.blue} />
            <Text style={[styles.modalAvatarEditText, { fontFamily: F.bodySemi }]}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        {fields.map((f) => (
          <View key={f.label} style={styles.modalField}>
            <Text style={[styles.modalFieldLabel, { fontFamily: F.bodyMed }]}>{f.label}</Text>
            <View style={styles.modalFieldInput}>
              <Ionicons name={f.icon as any} size={16} color={C.slateLight} style={{ marginRight: 10 }} />
              <TextInput
                defaultValue={f.value}
                style={[styles.modalInput, { fontFamily: F.bodyMed }]}
                placeholderTextColor={C.slateLight}
              />
            </View>
          </View>
        ))}

        {/* Save CTA */}
        <TouchableOpacity style={styles.modalSaveBtn} onPress={onClose} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={[styles.modalSaveBtnText, { fontFamily: F.bodySemi }]}>Save Changes</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default EditProfileModal;
