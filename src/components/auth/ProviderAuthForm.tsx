import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch } from '@/src/redux/store';
import { authLoginSuccess, authLoginFailure } from '@/src/redux/actions/appActions';
import { authApi } from '@/src/services/api/endpoints/auth';
import { providerApi } from '@/src/services/api/endpoints/provider';
import { servicesApi } from '@/src/services/api/endpoints/services';
import { ProviderServiceStep, ServiceData } from './ProviderServiceStep';
import { FontSize, FontWeight, Radii } from '@/src/theme';

interface ProviderAuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
  onSuccess: (userRole: string) => void;
}

const COMMON_CATEGORIES = [
  'Electrician',
  'Plumber',
  'Cleaning',
  'AC Repair',
  'Carpenter',
  'Painter',
];

const AVAILABLE_LANGUAGES = ['English', 'Hindi', 'Kannada', 'Tamil', 'Telugu'];

export const ProviderAuthForm: React.FC<ProviderAuthFormProps> = ({
  mode,
  onModeChange,
  onSuccess,
}) => {
  const dispatch = useAppDispatch();

  // Wizard Step for Sign Up
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Account
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: Profile Details
  const [category, setCategory] = useState('Electrician');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['English', 'Hindi']);

  // Categories from Backend for Step 3 mapping
  const [categoriesList, setCategoriesList] = useState<{ id: string; name: string }[]>([]);

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    servicesApi.listCategories().then((cats) => {
      if (mounted && Array.isArray(cats) && cats.length > 0) {
        setCategoriesList(cats.map((c) => ({ id: c.id, name: c.name })));
      }
    }).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  // Validation
  const validateStep1 = (): string | null => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) return 'Please enter a valid email address.';

    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';

    if (!name.trim()) return 'Full name is required.';
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) return 'Phone number is required.';
    const phoneRegex = /^\+?[\d\s-]{10,15}$/;
    if (!phoneRegex.test(trimmedPhone)) return 'Please enter a valid 10-15 digit phone number.';
    if (!agreeTerms) return 'You must agree to the Terms & Privacy Policy.';

    return null;
  };

  const validateStep2 = (): string | null => {
    if (!address.trim()) return 'Base service address/location is required.';
    return null;
  };

  // Login Submit
  const handleLoginSubmit = async () => {
    setErrorMessage(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Email address is required.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const session = await authApi.login(trimmedEmail, password);
      dispatch(authLoginSuccess(session));
      onSuccess(session.user.role || 'provider');
    } catch (err: any) {
      const msg = err?.message || 'Provider login failed. Please check your credentials.';
      setErrorMessage(msg);
      dispatch(authLoginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  // Complete Provider Signup (Either directly or with optional service)
  const completeRegistration = async (serviceData?: ServiceData) => {
    setErrorMessage(null);
    setLoading(true);

    try {
      // 1. Register User Account
      const session = await authApi.register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        role: 'provider',
      });

      const token = session.token;

      // 2. Update Provider Profile with Step 2 info
      try {
        await providerApi.updateProfile(
          {
            category,
            address: address.trim(),
            bio: bio.trim(),
            languages: selectedLanguages,
          },
          token
        );
      } catch (profErr) {
        console.warn('[ProviderAuth] Profile update error (non-fatal):', profErr);
      }

      // 3. Optional Step 3: Create Service & Variations
      if (serviceData && serviceData.name) {
        try {
          // Resolve matching category ID from backend or fallback to first available
          const matchedCategory = categoriesList.find(
            (c) => c.name.toLowerCase() === category.toLowerCase()
          ) || categoriesList[0];

          const categoryId = matchedCategory ? matchedCategory.id : '660000000000000000000001';

          const createdService = await providerApi.createService(
            {
              categoryId,
              name: serviceData.name,
              categoryLabel: category,
              shortDesc: serviceData.shortDesc,
              price: Number(serviceData.price),
              eta: serviceData.eta,
              mcIcon: serviceData.mcIcon,
              accentColor: '#D97706',
              accentBg: '#FEF3C7',
            },
            token
          );

          // Create variations if any
          if (createdService && createdService._id && Array.isArray(serviceData.variations)) {
            for (const v of serviceData.variations) {
              if (v.label && v.price) {
                await providerApi.createVariation(
                  createdService._id,
                  {
                    label: v.label,
                    desc: v.desc || 'Standard scope',
                    price: Number(v.price),
                    duration: v.duration || '30 mins',
                    mcIcon: v.mcIcon || 'tools',
                    popular: v.popular ?? false,
                  },
                  token
                );
              }
            }
          }
        } catch (svcErr) {
          console.warn('[ProviderAuth] Service setup error (non-fatal):', svcErr);
        }
      }

      // 4. Save session to Redux and Route
      dispatch(authLoginSuccess(session));
      onSuccess(session.user.role || 'provider');
    } catch (err: any) {
      const msg = err?.message || 'Registration failed. Please check your information.';
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
          <Ionicons name="alert-circle" size={18} color="#EF4444" style={{ marginRight: 6 }} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* LOGIN MODE */}
      {mode === 'login' ? (
        <View>
          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Provider Email</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="provider@example.com"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotPass}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#64748B"
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
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleLoginSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Log In to Provider Dashboard</Text>
            )}
          </TouchableOpacity>

          {/* Switch to Sign Up */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>New provider?</Text>
            <TouchableOpacity
              onPress={() => {
                setErrorMessage(null);
                setCurrentStep(1);
                onModeChange('signup');
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.toggleLink}> Register as Provider</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* SIGN UP 3-STEP WIZARD */
        <View>
          {/* Wizard Step Indicator */}
          <View style={styles.wizardIndicator}>
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Profile' },
              { num: 3, label: 'Services' },
            ].map((step, idx) => {
              const isActive = currentStep === step.num;
              const isPast = currentStep > step.num;
              return (
                <React.Fragment key={step.num}>
                  <View style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepCircle,
                        isActive && styles.stepCircleActive,
                        isPast && styles.stepCirclePast,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepNum,
                          (isActive || isPast) && styles.stepNumActive,
                        ]}
                      >
                        {isPast ? '✓' : step.num}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        isActive && styles.stepLabelActive,
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                  {idx < 2 && (
                    <View
                      style={[
                        styles.stepLine,
                        isPast && styles.stepLineActive,
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>

          {/* STEP 1: ACCOUNT DETAILS */}
          {currentStep === 1 && (
            <View>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. David Miller"
                    placeholderTextColor="#64748B"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="david@example.com"
                    placeholderTextColor="#64748B"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="+91 98765 43210"
                    placeholderTextColor="#64748B"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Min. 6 characters"
                    placeholderTextColor="#64748B"
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
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={agreeTerms ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={20}
                  color={agreeTerms ? '#D97706' : '#94A3B8'}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.termsText}>
                  I agree to Provider Terms & Background Verification
                </Text>
              </TouchableOpacity>

              {/* Next Step Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => {
                  setErrorMessage(null);
                  const err = validateStep1();
                  if (err) {
                    setErrorMessage(err);
                    return;
                  }
                  setCurrentStep(2);
                }}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Continue to Profile (Step 2 of 3)</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 2: PROFILE DETAILS */}
          {currentStep === 2 && (
            <View>
              {/* Category Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Trade / Category *</Text>
                <View style={styles.categoryWrap}>
                  {COMMON_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.catChip,
                        category === cat && styles.catChipActive,
                      ]}
                      onPress={() => setCategory(cat)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.catChipText,
                          category === cat && styles.catChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Service Address / Location */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Base Location / Address *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="location-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 42 Market Street, Indiranagar, Bangalore"
                    placeholderTextColor="#64748B"
                    value={address}
                    onChangeText={setAddress}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Bio */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Professional Experience / Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="e.g. 8+ years of commercial and residential electrical installations."
                  placeholderTextColor="#64748B"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={2}
                  editable={!loading}
                />
              </View>

              {/* Languages Spoken */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Languages Spoken</Text>
                <View style={styles.categoryWrap}>
                  {AVAILABLE_LANGUAGES.map((lang) => {
                    const isSel = selectedLanguages.includes(lang);
                    return (
                      <TouchableOpacity
                        key={lang}
                        style={[
                          styles.catChip,
                          isSel && styles.catChipActive,
                        ]}
                        onPress={() => toggleLanguage(lang)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.catChipText,
                            isSel && styles.catChipTextActive,
                          ]}
                        >
                          {lang}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Step 2 Actions */}
              <View style={styles.stepBtnRow}>
                <TouchableOpacity
                  style={styles.stepBackBtn}
                  onPress={() => setCurrentStep(1)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="arrow-back" size={16} color="#94A3B8" />
                  <Text style={styles.stepBackText}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.stepNextBtn}
                  onPress={() => {
                    setErrorMessage(null);
                    const err = validateStep2();
                    if (err) {
                      setErrorMessage(err);
                      return;
                    }
                    setCurrentStep(3);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnText}>Service Setup (Step 3)</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STEP 3: SERVICE SETUP */}
          {currentStep === 3 && (
            <ProviderServiceStep
              initialTradeCategory={category}
              onSubmit={(svcData) => completeRegistration(svcData)}
              onSkip={() => completeRegistration(undefined)}
              onBack={() => setCurrentStep(2)}
              loading={loading}
            />
          )}

          {/* Mode Switcher Back to Login */}
          {currentStep === 1 && (
            <View style={styles.toggleRow}>
              <Text style={styles.toggleText}>Already registered as a provider?</Text>
              <TouchableOpacity
                onPress={() => {
                  setErrorMessage(null);
                  onModeChange('login');
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleLink}> Log In</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: 'rgba(30, 27, 46, 0.76)',
    borderRadius: Radii.xl ?? 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(217, 119, 6, 0.25)',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: FontSize.base ?? 12,
    flex: 1,
  },
  wizardIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#D97706',
  },
  stepCirclePast: {
    backgroundColor: '#10B981',
  },
  stepNum: {
    color: '#94A3B8',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  stepNumActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    color: '#64748B',
    fontSize: FontSize.xs,
    marginTop: 4,
  },
  stepLabelActive: {
    color: '#F59E0B',
    fontWeight: FontWeight.semibold,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: 8,
    marginBottom: 16,
  },
  stepLineActive: {
    backgroundColor: '#10B981',
  },
  inputGroup: {
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: '#E2E8F0',
    fontSize: FontSize.base ?? 12,
    fontWeight: FontWeight.medium,
    marginBottom: 6,
  },
  forgotPass: {
    color: '#F59E0B',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: FontSize.md,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 52,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: FontSize.md,
  },
  eyeBtn: {
    padding: 6,
  },
  categoryWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  catChip: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  catChipActive: {
    backgroundColor: 'rgba(217, 119, 6, 0.3)',
    borderColor: '#D97706',
  },
  catChipText: {
    color: '#94A3B8',
    fontSize: FontSize.xs,
  },
  catChipTextActive: {
    color: '#FBBF24',
    fontWeight: FontWeight.semibold,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 2,
  },
  termsText: {
    color: '#94A3B8',
    fontSize: FontSize.xs,
    flex: 1,
    lineHeight: 18,
  },
  submitBtn: {
    backgroundColor: '#D97706',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
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
  stepBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  stepBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
  },
  stepBackText: {
    color: '#E2E8F0',
    fontSize: FontSize.base ?? 12,
    marginLeft: 4,
  },
  stepNextBtn: {
    flex: 1,
    backgroundColor: '#D97706',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  toggleText: {
    color: '#94A3B8',
    fontSize: FontSize.base ?? 12,
  },
  toggleLink: {
    color: '#F59E0B',
    fontSize: FontSize.base ?? 12,
    fontWeight: FontWeight.bold,
  },
});

export default ProviderAuthForm;
