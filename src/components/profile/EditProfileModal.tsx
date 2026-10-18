// ─── Edit Profile Modal ───────────────────────────────────────────────────────
// Connected to Redux and backend API for Consumer and Provider profile updates.
// Preserves existing layout, tokens, animations, and styles.
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { C, F } from './tokens';
import { styles } from './profile.styles';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import { updateConsumerProfile, updateProviderProfile } from '@/src/redux/actions/appActions';

export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  role?: 'consumer' | 'provider';
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    address?: string;
    avatar?: string;
    initials?: string;
    bio?: string;
  };
  onSave?: (data: any) => Promise<{ success: boolean; error?: string } | void>;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  visible,
  onClose,
  role = 'consumer',
  initialData,
  onSave,
}) => {
  const dispatch = useAppDispatch();
  const consumerUser = useAppSelector((s) => s.consumer.profile.user);
  const providerData = useAppSelector((s) => s.provider.profile.data);

  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Active user data based on role
  const activeData =
    initialData ||
    (role === 'provider'
      ? providerData || { name: '', email: '', phone: '', address: '' }
      : consumerUser || { name: '', email: '', phone: '', location: '' });

  const [name, setName] = useState(activeData?.name || '');
  const [email, setEmail] = useState(activeData?.email || '');
  const [phone, setPhone] = useState(activeData?.phone || '');
  const [locationOrAddress, setLocationOrAddress] = useState(
    (role === 'provider' ? (activeData as any)?.address : (activeData as any)?.location) || ''
  );
  const [avatar, setAvatar] = useState((activeData as any)?.avatar || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      const current =
        initialData ||
        (role === 'provider'
          ? providerData || { name: '', email: '', phone: '', address: '' }
          : consumerUser || { name: '', email: '', phone: '', location: '' });

      setName(current?.name || '');
      setEmail(current?.email || '');
      setPhone(current?.phone || '');
      setLocationOrAddress(
        (role === 'provider' ? (current as any)?.address : (current as any)?.location) || ''
      );
      setAvatar((current as any)?.avatar || '');

      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 3 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 600, duration: 240, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, consumerUser, providerData, initialData, role]);

  if (!visible) return null;

  // Calculate initials for avatar text
  const parts = (name || '').trim().split(' ').filter(Boolean);
  const initials =
    parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : (name || 'AM').substring(0, 2).toUpperCase();

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedLocation = locationOrAddress.trim();

    // Client-side validation
    if (!trimmedName) {
      Alert.alert('Validation Error', 'Full Name cannot be empty.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (trimmedEmail && !emailRegex.test(trimmedEmail)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
      Alert.alert('Validation Error', 'Please enter a valid phone number (10 to 15 digits).');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
      };

      if (role === 'provider') {
        payload.address = trimmedLocation;
      } else {
        payload.location = trimmedLocation;
      }

      if (avatar) {
        payload.avatar = avatar;
      }

      let res: any;
      if (onSave) {
        res = await onSave(payload);
      } else if (role === 'provider') {
        res = await dispatch(updateProviderProfile(payload) as any);
      } else {
        res = await dispatch(updateConsumerProfile(payload) as any);
      }

      if (res && res.success === false) {
        Alert.alert('Update Failed', res.error || 'Failed to update profile.');
        return;
      }

      Alert.alert('Success', 'Profile updated successfully!');
      onClose();
    } catch (err: any) {
      Alert.alert('Update Failed', err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: 'Full Name',
      value: name,
      onChangeText: setName,
      icon: 'person-outline',
      keyboardType: 'default',
    },
    {
      label: 'Email',
      value: email,
      onChangeText: setEmail,
      icon: 'mail-outline',
      keyboardType: 'email-address',
      autoCapitalize: 'none',
    },
    {
      label: 'Phone',
      value: phone,
      onChangeText: setPhone,
      icon: 'call-outline',
      keyboardType: 'phone-pad',
    },
    {
      label: role === 'provider' ? 'Address' : 'City / Area',
      value: locationOrAddress,
      onChangeText: setLocationOrAddress,
      icon: 'location-outline',
      keyboardType: 'default',
    },
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
            <Text style={[styles.modalAvatarText, { fontFamily: F.displayBold }]}>{initials}</Text>
          </View>
          <TouchableOpacity
            style={styles.modalAvatarEditBtn}
            activeOpacity={0.8}
            onPress={() => {
              Alert.prompt
                ? Alert.prompt(
                    'Change Profile Photo',
                    'Enter image URL:',
                    (text) => text && setAvatar(text.trim()),
                    'plain-text',
                    avatar
                  )
                : Alert.alert('Change Photo', 'Photo URL input supported via image link.');
            }}
          >
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
                value={f.value}
                onChangeText={f.onChangeText}
                style={[styles.modalInput, { fontFamily: F.bodyMed }]}
                placeholderTextColor={C.slateLight}
                keyboardType={f.keyboardType as any}
                autoCapitalize={(f.autoCapitalize as any) || 'sentences'}
                editable={!loading}
              />
            </View>
          </View>
        ))}

        {/* Save CTA */}
        <TouchableOpacity
          style={[styles.modalSaveBtn, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          activeOpacity={0.85}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons name="checkmark-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
          )}
          <Text style={[styles.modalSaveBtnText, { fontFamily: F.bodySemi }]}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

export default EditProfileModal;
