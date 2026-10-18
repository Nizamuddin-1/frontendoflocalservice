import React, { useState, useRef } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RoleSwitcher } from '@/src/components/auth/RoleSwitcher';
import { ConsumerAuthForm } from '@/src/components/auth/ConsumerAuthForm';
import { ProviderAuthForm } from '@/src/components/auth/ProviderAuthForm';
import { useRole, type Role } from '@/src/context/RoleContext';
import { clearStoredTokens } from '@/src/services/api/client';
import { clearSavedRole } from '@/src/context/RoleContext';
import { authLogout } from '@/src/redux/actions/appActions';
import { useAppDispatch } from '@/src/redux/store';
import { FontSize, FontWeight } from '@/src/theme';

export type AuthMode = 'login' | 'signup';

export const UnifiedAuthScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { role, setRole, setIsGuest } = useRole();

  // Active Role State
  const [selectedRole, setSelectedRole] = useState<Role>(role || 'consumer');

  // Role Mismatch Warning
  const [roleMismatchError, setRoleMismatchError] = useState<string | null>(null);

  // Active Tab: Login vs Sign Up
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Smooth fade transition for tab switching
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Role Change Handler
  const handleRoleChange = (newRole: Role) => {
    setRoleMismatchError(null);
    Animated.timing(fadeAnim, {
      toValue: 0.1,
      duration: 120,
      useNativeDriver: true,
    }).start(() => {
      setSelectedRole(newRole);
      setRole(newRole);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }).start();
    });
  };

  // Auth Mode Tab Switcher
  const handleModeChange = (mode: AuthMode) => {
    setRoleMismatchError(null);
    Animated.timing(fadeAnim, {
      toValue: 0.1,
      duration: 120,
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
      // Revert Redux session & clear saved token and role
      await clearStoredTokens();
      await clearSavedRole();
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Worker Avatars Collage Banner - Light Decorative Accents */}
          <View style={styles.collageContainer}>
            <View style={styles.avatarsRow}>
              <View style={[styles.avatarBadge, { backgroundColor: '#EFF6FF', borderColor: '#DBEAFE' }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={16} color="#2563EB" />
                <Text style={[styles.avatarLabel, { color: '#1E40AF' }]}>Electrician</Text>
              </View>
              <View style={[styles.avatarBadge, { backgroundColor: '#ECFDF5', borderColor: '#D1FAE5' }]}>
                <MaterialCommunityIcons name="pipe-wrench" size={16} color="#059669" />
                <Text style={[styles.avatarLabel, { color: '#065F46' }]}>Plumber</Text>
              </View>
              <View style={[styles.avatarBadge, { backgroundColor: '#FDF2F8', borderColor: '#FCE7F3' }]}>
                <MaterialCommunityIcons name="broom" size={16} color="#DB2777" />
                <Text style={[styles.avatarLabel, { color: '#9D174D' }]}>Cleaner</Text>
              </View>
              <View style={[styles.avatarBadge, { backgroundColor: '#FFFBEB', borderColor: '#FEF3C7' }]}>
                <MaterialCommunityIcons name="air-conditioner" size={16} color="#D97706" />
                <Text style={[styles.avatarLabel, { color: '#92400E' }]}>AC Tech</Text>
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
                Local<Text style={{ color: isConsumer ? '#2563EB' : '#D97706' }}>Fix</Text>
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
              <Ionicons name="warning" size={20} color="#D97706" style={{ marginRight: 8 }} />
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
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Animated Active Form Container */}
          <Animated.View style={{ opacity: fadeAnim }}>
            {isConsumer ? (
              <ConsumerAuthForm
                mode={authMode}
                onSuccess={handleAuthSuccess}
                onToggleMode={() => handleModeChange(authMode === 'login' ? 'signup' : 'login')}
                onGuestAccess={handleGuestAccess}
              />
            ) : (
              <ProviderAuthForm
                mode={authMode}
                onSuccess={handleAuthSuccess}
                onToggleMode={() => handleModeChange(authMode === 'login' ? 'signup' : 'login')}
              />
            )}
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
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
  },
  avatarLabel: {
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  appName: {
    fontSize: 28,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: FontSize.xs,
    color: '#64748B',
    letterSpacing: 0.2,
  },
  contextHeader: {
    alignItems: 'center',
    marginTop: 10,
  },
  contextHeadline: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: '#0F172A',
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
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  mismatchText: {
    color: '#92400E',
    fontSize: FontSize.base,
    flex: 1,
    lineHeight: 18,
    fontWeight: FontWeight.medium,
  },
  modeTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modeTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  modeTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  modeTabText: {
    color: '#64748B',
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  modeTextConsumer: {
    color: '#2563EB',
    fontWeight: FontWeight.bold,
  },
  modeTextProvider: {
    color: '#D97706',
    fontWeight: FontWeight.bold,
  },
});

export default UnifiedAuthScreen;
