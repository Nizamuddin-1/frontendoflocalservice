import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RoleSwitcher } from '@/src/components/auth/RoleSwitcher';
import { ConsumerAuthForm } from '@/src/components/auth/ConsumerAuthForm';
import { ProviderAuthForm } from '@/src/components/auth/ProviderAuthForm';
import { useRole, type Role } from '@/src/context/RoleContext';
import { clearStoredTokens } from '@/src/services/api/client';
import { authLogout } from '@/src/redux/actions/appActions';
import { useAppDispatch } from '@/src/redux/store';
import { FontSize, FontWeight } from '@/src/theme';

export const UnifiedAuthScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { role, setRole, setIsGuest } = useRole();

  // Active form state
  const [selectedRole, setSelectedRole] = useState<Role>(role || 'consumer');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [roleMismatchError, setRoleMismatchError] = useState<string | null>(null);

  // Micro-animation fade transition
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Keep selectedRole synced if parent role changes
  useEffect(() => {
    if (role && role !== selectedRole) {
      setSelectedRole(role);
    }
  }, [role]);

  const handleRoleChange = (newRole: Role) => {
    if (newRole === selectedRole) return;
    setRoleMismatchError(null);

    // Trigger smooth fade transition
    Animated.timing(fadeAnim, {
      toValue: 0.25,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setSelectedRole(newRole);
      setRole(newRole);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleModeChange = (mode: 'login' | 'signup') => {
    setRoleMismatchError(null);
    Animated.timing(fadeAnim, {
      toValue: 0.3,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setAuthMode(mode);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }).start();
    });
  };

  // Role Mismatch Guard
  const handleAuthSuccess = async (actualRole: string) => {
    setRoleMismatchError(null);

    // Normalize role string from backend
    const normalizedRole: Role =
      actualRole.toLowerCase() === 'provider' ? 'provider' : 'consumer';

    // Verify account's actual role matches active toggle
    if (normalizedRole !== selectedRole) {
      // Revert Redux session & clear saved token
      await clearStoredTokens();
      dispatch(authLogout());

      // Display actionable mismatch error message
      if (normalizedRole === 'consumer') {
        setRoleMismatchError(
          'This account is registered as a Consumer. Please select Consumer to continue.'
        );
      } else {
        setRoleMismatchError(
          'This account is registered as a Provider. Please select Provider to continue.'
        );
      }
      return;
    }

    // Role verified: persist role and proceed
    setRole(selectedRole);
  };

  const handleGuestAccess = () => {
    setRoleMismatchError(null);
    setRole('consumer');
    setIsGuest(true);
  };

  const isConsumer = selectedRole === 'consumer';

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Deep Space Background with Atmospheric Gradients */}
      <View style={styles.deepBackground}>
        <View
          style={[
            styles.radialOrb,
            isConsumer ? styles.consumerOrb : styles.providerOrb,
          ]}
        />
        <View style={styles.darkVignette} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Worker Avatars Collage Banner */}
        <View style={styles.collageContainer}>
          <View style={styles.avatarsRow}>
            <View style={[styles.avatarBadge, { backgroundColor: '#1E3A8A' }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={16} color="#60A5FA" />
              <Text style={styles.avatarLabel}>Electrician</Text>
            </View>
            <View style={[styles.avatarBadge, { backgroundColor: '#064E3B' }]}>
              <MaterialCommunityIcons name="pipe-wrench" size={16} color="#34D399" />
              <Text style={styles.avatarLabel}>Plumber</Text>
            </View>
            <View style={[styles.avatarBadge, { backgroundColor: '#701A75' }]}>
              <MaterialCommunityIcons name="broom" size={16} color="#F472B6" />
              <Text style={styles.avatarLabel}>Cleaner</Text>
            </View>
            <View style={[styles.avatarBadge, { backgroundColor: '#78350F' }]}>
              <MaterialCommunityIcons name="air-conditioner" size={16} color="#FBBF24" />
              <Text style={styles.avatarLabel}>AC Tech</Text>
            </View>
          </View>
        </View>

        {/* Branding Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoRow}>
            <View
              style={[
                styles.logoWrap,
                { backgroundColor: isConsumer ? '#2563EB' : '#D97706' },
              ]}
            >
              <MaterialCommunityIcons name="wrench-clock" size={26} color="#FFFFFF" />
            </View>
            <Text style={styles.appName}>
              Local<Text style={{ color: isConsumer ? '#60A5FA' : '#F59E0B' }}>Fix</Text>
            </Text>
          </View>
          <Text style={styles.tagline}>Trusted local services, at your doorstep</Text>

          {/* Dynamic Context Headline */}
          <View style={styles.contextHeader}>
            <Text style={styles.contextHeadline}>
              {isConsumer ? 'Book services near you' : 'Grow your service business'}
            </Text>
            <Text style={styles.contextSub}>
              {isConsumer
                ? 'Connect with verified top-rated professionals in minutes'
                : 'Receive real-time job requests and manage your earnings'}
            </Text>
          </View>
        </View>

        {/* Role Selector */}
        <RoleSwitcher selectedRole={selectedRole} onRoleChange={handleRoleChange} />

        {/* Role Mismatch Error Banner */}
        {roleMismatchError ? (
          <View style={styles.mismatchAlert}>
            <Ionicons name="warning" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
            <Text style={styles.mismatchText}>{roleMismatchError}</Text>
          </View>
        ) : null}

        {/* Mode Selector Tabs (Login vs Sign Up) */}
        <View style={styles.modeTabBar}>
          <TouchableOpacity
            style={[styles.modeTab, authMode === 'login' && styles.modeTabActive]}
            onPress={() => handleModeChange('login')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeTabText,
                authMode === 'login' && (isConsumer ? styles.modeTextConsumer : styles.modeTextProvider),
              ]}
            >
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, authMode === 'signup' && styles.modeTabActive]}
            onPress={() => handleModeChange('signup')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.modeTabText,
                authMode === 'signup' && (isConsumer ? styles.modeTextConsumer : styles.modeTextProvider),
              ]}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Animated Form Body */}
        <Animated.View style={{ opacity: fadeAnim }}>
          {isConsumer ? (
            <ConsumerAuthForm
              mode={authMode}
              onModeChange={handleModeChange}
              onSuccess={handleAuthSuccess}
              onGuestAccess={handleGuestAccess}
            />
          ) : (
            <ProviderAuthForm
              mode={authMode}
              onModeChange={handleModeChange}
              onSuccess={handleAuthSuccess}
            />
          )}
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  deepBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#090D16',
  },
  radialOrb: {
    position: 'absolute',
    top: -120,
    alignSelf: 'center',
    width: 380,
    height: 380,
    borderRadius: 190,
    opacity: 0.35,
  },
  consumerOrb: {
    backgroundColor: '#1D4ED8',
  },
  providerOrb: {
    backgroundColor: '#B45309',
  },
  darkVignette: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 13, 22, 0.72)',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 42,
    paddingBottom: 30,
  },
  collageContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  avatarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  avatarLabel: {
    color: '#E2E8F0',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginLeft: 5,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  logoWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.xs,
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  contextHeader: {
    alignItems: 'center',
    marginTop: 12,
  },
  contextHeadline: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#F8FAFC',
    textAlign: 'center',
  },
  contextSub: {
    fontSize: FontSize.xs,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
    paddingHorizontal: 12,
  },
  mismatchAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  mismatchText: {
    color: '#FDE68A',
    fontSize: FontSize.base,
    flex: 1,
    lineHeight: 18,
  },
  modeTabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 10,
  },
  modeTabActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  modeTabText: {
    color: '#94A3B8',
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  modeTextConsumer: {
    color: '#60A5FA',
    fontWeight: FontWeight.bold,
  },
  modeTextProvider: {
    color: '#F59E0B',
    fontWeight: FontWeight.bold,
  },
});

export default UnifiedAuthScreen;
