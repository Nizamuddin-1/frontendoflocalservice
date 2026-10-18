import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch } from '@/src/redux/store';
import { authLoginSuccess, authLoginFailure } from '@/src/redux/actions/appActions';
import { authApi } from '@/src/services/api/endpoints/auth';
import { clearStoredTokens } from '@/src/services/api/client';
import { clearSavedRole } from '@/src/context/RoleContext';
import { markManualLoginInSession } from '@/src/services/devAutoLogin';
import { FontSize, FontWeight, Radii } from '@/src/theme';

interface ConsumerAuthFormProps {
  mode: 'login' | 'signup';
  onToggleMode?: () => void;
  onModeChange?: (mode: 'login' | 'signup') => void;
  onSuccess: (userRole: string) => void;
  onGuestAccess: () => void;
}

export const ConsumerAuthForm: React.FC<ConsumerAuthFormProps> = ({
  mode,
  onToggleMode,
  onModeChange,
  onSuccess,
  onGuestAccess,
}) => {
  const dispatch = useAppDispatch();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleAuthMode = () => {
    setErrorMessage(null);
    if (onToggleMode) {
      onToggleMode();
    } else if (onModeChange) {
      onModeChange(mode === 'login' ? 'signup' : 'login');
    }
  };

  // Client-side validation matching backend rules
  const validate = (): string | null => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return 'Please enter a valid email address.';

    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';

    if (mode === 'signup') {
      if (!name.trim()) return 'Full name is required.';
      const trimmedPhone = phone.trim();
      if (!trimmedPhone) return 'Phone number is required.';
      const phoneRegex = /^\+?[\d\s-]{10,15}$/;
      if (!phoneRegex.test(trimmedPhone)) return 'Please enter a valid 10-15 digit phone number.';
      if (!agreeTerms) return 'You must agree to the Terms & Privacy Policy.';
    }

    return null;
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setLoading(true);
    try {
      // Clear all existing storage and tokens before new authentication attempt
      await clearStoredTokens();
      await clearSavedRole();

      if (mode === 'login') {
        const session = await authApi.login(email.trim(), password);
        markManualLoginInSession();
        dispatch(authLoginSuccess(session));
        onSuccess(session.user.role || 'consumer');
      } else {
        const session = await authApi.register({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          role: 'consumer',
        });
        markManualLoginInSession();
        dispatch(authLoginSuccess(session));
        onSuccess(session.user.role || 'consumer');
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please try again.';
      setErrorMessage(msg);
      dispatch(authLoginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formCard}>
      {/* Error Banner */}
      {errorMessage ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 6 }} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Sign Up: Name */}
      {mode === 'signup' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g. Priya Sharma"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
        </View>
      )}

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>
      </View>

      {/* Sign Up: Phone */}
      {mode === 'signup' && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color="#64748B" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="+91 98765 43210"
              placeholderTextColor="#94A3B8"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              editable={!loading}
            />
          </View>
        </View>
      )}

      {/* Password */}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Password</Text>
          {mode === 'login' && (
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgotPass}>Forgot password?</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Min. 6 characters"
            placeholderTextColor="#94A3B8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            editable={!loading}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowPassword((prev) => !prev)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sign Up: Terms & Privacy */}
      {mode === 'signup' && (
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAgreeTerms(!agreeTerms)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name={agreeTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={20}
            color={agreeTerms ? '#2563EB' : '#94A3B8'}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.termsLink}>Terms of Service</Text> &{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.submitBtnText}>
            {mode === 'login' ? 'Log In as Consumer' : 'Create Consumer Account'}
          </Text>
        )}
      </TouchableOpacity>

      {/* Switch Mode Toggle */}
      <View style={styles.toggleRow}>
        <Text style={styles.toggleText}>
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
        </Text>
        <TouchableOpacity
          onPress={toggleAuthMode}
          activeOpacity={0.7}
        >
          <Text style={styles.toggleLink}>
            {mode === 'login' ? ' Sign Up' : ' Log In'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Guest Browsing Action */}
      <TouchableOpacity
        style={styles.guestBtn}
        onPress={onGuestAccess}
        activeOpacity={0.8}
      >
        <Ionicons name="compass-outline" size={18} color="#475569" style={{ marginRight: 8 }} />
        <Text style={styles.guestBtnText}>Continue as guest</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radii.xl ?? 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: FontSize.base ?? 12,
    flex: 1,
    fontWeight: FontWeight.medium,
  },
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: '#1E293B',
    fontSize: FontSize.base ?? 12,
    fontWeight: FontWeight.semibold,
    marginBottom: 6,
  },
  forgotPass: {
    color: '#2563EB',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: FontSize.md,
    paddingVertical: 11,
  },
  eyeBtn: {
    padding: 6,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 2,
  },
  termsText: {
    color: '#64748B',
    fontSize: FontSize.xs,
    flex: 1,
    lineHeight: 18,
  },
  termsLink: {
    color: '#2563EB',
    fontWeight: FontWeight.semibold,
  },
  submitBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    letterSpacing: 0.3,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  toggleText: {
    color: '#64748B',
    fontSize: FontSize.base ?? 12,
  },
  toggleLink: {
    color: '#2563EB',
    fontSize: FontSize.base ?? 12,
    fontWeight: FontWeight.bold,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    color: '#94A3B8',
    fontSize: FontSize.xs,
    marginHorizontal: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 11,
  },
  guestBtnText: {
    color: '#334155',
    fontSize: FontSize.base ?? 12,
    fontWeight: FontWeight.semibold,
  },
});

export default ConsumerAuthForm;
