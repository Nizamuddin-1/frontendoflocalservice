import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { servicesApi } from '@/src/services/api/endpoints/services';
import { providerApi } from '@/src/services/api/endpoints/provider';
import { VariationRowEditor, InlineVariationRow } from './VariationRowEditor';
import { Colors, FontSize, FontWeight, Radii } from '@/src/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_ICONS = [
  { icon: 'tool', label: 'General' },
  { icon: 'zap', label: 'Electrical' },
  { icon: 'droplet', label: 'Plumbing' },
  { icon: 'wind', label: 'AC / HVAC' },
  { icon: 'check-circle', label: 'Cleaning' },
  { icon: 'box', label: 'Carpentry' },
];

export const ServiceFormModal: React.FC<Props> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [price, setPrice] = useState('');
  const [eta, setEta] = useState('45 mins');
  const [selectedIcon, setSelectedIcon] = useState('tool');
  const [variations, setVariations] = useState<InlineVariationRow[]>([]);

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load backend categories
  useEffect(() => {
    let mounted = true;
    servicesApi
      .listCategories()
      .then((cats) => {
        if (mounted && Array.isArray(cats) && cats.length > 0) {
          const mapped = cats.map((c: any) => ({
            id: c._id || c.id,
            name: c.name,
          }));
          setCategories(mapped);
          if (!selectedCategory) {
            setSelectedCategory(mapped[0].id);
          }
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [visible]);

  // Check if form is dirty
  const isDirty =
    Boolean(name.trim()) ||
    Boolean(shortDesc.trim()) ||
    Boolean(price.trim()) ||
    variations.length > 0;

  const resetForm = () => {
    setName('');
    setShortDesc('');
    setPrice('');
    setEta('45 mins');
    setSelectedIcon('tool');
    setVariations([]);
    setErrorMsg(null);
  };

  const handleAttemptClose = () => {
    if (isDirty) {
      Alert.alert(
        'Discard Unsaved Changes?',
        'You have unsaved changes in your service form. Are you sure you want to close?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]
      );
    } else {
      resetForm();
      onClose();
    }
  };

  const validate = (): string | null => {
    if (!name.trim()) return 'Service title is required.';
    if (name.trim().length > 200) return 'Service title cannot exceed 200 characters.';
    if (!selectedCategory) return 'Please select a service category.';
    if (!shortDesc.trim()) return 'Service description is required.';
    if (shortDesc.trim().length > 500) return 'Description cannot exceed 500 characters.';
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) return 'Price must be a valid positive number.';
    if (!eta.trim()) return 'Turnaround ETA is required (e.g. 45 mins).';

    for (let i = 0; i < variations.length; i++) {
      const v = variations[i];
      if (!v.label.trim()) return `Variation #${i + 1} requires a title.`;
      const vPrice = Number(v.price);
      if (isNaN(vPrice) || vPrice <= 0) return `Variation #${i + 1} requires a valid positive price.`;
    }

    return null;
  };

  const handleSubmit = async () => {
    setErrorMsg(null);
    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }

    setSaving(true);
    try {
      const selectedCatObj = categories.find((c) => c.id === selectedCategory);
      const categoryLabel = selectedCatObj ? selectedCatObj.name : 'General';

      // 1. Create main service
      const createdService = await providerApi.createService({
        categoryId: selectedCategory,
        name: name.trim(),
        shortDesc: shortDesc.trim(),
        price: Number(price),
        eta: eta.trim(),
        mcIcon: selectedIcon,
        categoryLabel,
        accentColor: '#6366F1',
        accentBg: '#EEF2FF',
      });

      // 2. Create variations if attached
      const serviceId = createdService?._id || createdService?.id;
      if (serviceId && variations.length > 0) {
        for (const v of variations) {
          await providerApi.createVariation(serviceId, {
            label: v.label.trim(),
            desc: v.desc.trim() || 'Standard package',
            price: Number(v.price),
            duration: v.duration.trim() || '45 mins',
            mcIcon: selectedIcon,
            popular: false,
          });
        }
      }

      Alert.alert('Success', 'Service created successfully and published!');
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to save service. Please check your connection.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleAttemptClose}
    >
      <View style={s.modalOverlay}>
        <TouchableOpacity
          style={s.backdropDismiss}
          activeOpacity={1}
          onPress={handleAttemptClose}
        />

        <SafeAreaView edges={['bottom']} style={s.sheetContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={s.keyboardView}
          >
            {/* Header */}
            <View style={s.sheetHeader}>
              <View>
                <Text style={s.headerTitle}>Add New Service</Text>
                <Text style={s.headerSub}>Publish a service offering for consumers</Text>
              </View>
              <TouchableOpacity
                style={s.closeBtn}
                onPress={handleAttemptClose}
                activeOpacity={0.7}
              >
                <Feather name="x" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {errorMsg ? (
              <View style={s.errorBanner}>
                <Feather name="alert-circle" size={16} color="#DC2626" />
                <Text style={s.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <ScrollView
              style={s.scrollArea}
              contentContainerStyle={s.scrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Service Title */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Service Name *</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. Master Electrician Inspection"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                  editable={!saving}
                />
              </View>

              {/* Category Picker */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Category *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.chipScroll}
                >
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[s.categoryChip, isSelected && s.categoryChipActive]}
                        onPress={() => setSelectedCategory(cat.id)}
                        activeOpacity={0.75}
                      >
                        <Text
                          style={[
                            s.categoryChipTxt,
                            isSelected && s.categoryChipTxtActive,
                          ]}
                        >
                          {cat.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Price & ETA */}
              <View style={s.gridRow}>
                <View style={s.gridCol}>
                  <Text style={s.label}>Base Price (₹) *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="e.g. 399"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    editable={!saving}
                  />
                </View>

                <View style={s.gridCol}>
                  <Text style={s.label}>Turnaround ETA *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="e.g. 30-45 mins"
                    placeholderTextColor="#94A3B8"
                    value={eta}
                    onChangeText={setEta}
                    editable={!saving}
                  />
                </View>
              </View>

              {/* Description */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Description *</Text>
                <TextInput
                  style={[s.input, s.textArea]}
                  placeholder="Comprehensive service description outlining what is included..."
                  placeholderTextColor="#94A3B8"
                  value={shortDesc}
                  onChangeText={setShortDesc}
                  multiline
                  numberOfLines={3}
                  editable={!saving}
                />
              </View>

              {/* Icon Selector */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Service Icon</Text>
                <View style={s.iconRow}>
                  {COMMON_ICONS.map((item) => {
                    const isSelected = selectedIcon === item.icon;
                    return (
                      <TouchableOpacity
                        key={item.icon}
                        style={[s.iconBox, isSelected && s.iconBoxActive]}
                        onPress={() => setSelectedIcon(item.icon)}
                        activeOpacity={0.75}
                      >
                        <Feather
                          name={item.icon as any}
                          size={18}
                          color={isSelected ? '#4F46E5' : '#64748B'}
                        />
                        <Text
                          style={[s.iconLabel, isSelected && s.iconLabelActive]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Inline Variations Editor */}
              <VariationRowEditor
                variations={variations}
                onChange={setVariations}
              />
            </ScrollView>

            {/* Bottom Actions */}
            <View style={s.sheetFooter}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={handleAttemptClose}
                disabled={saving}
                activeOpacity={0.75}
              >
                <Text style={s.cancelBtnTxt}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.submitBtn, saving && s.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={saving}
                activeOpacity={0.85}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={s.submitBtnTxt}>Save & Publish Service</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  backdropDismiss: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  keyboardView: {
    maxHeight: '100%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
    flex: 1,
  },
  scrollArea: {
    paddingHorizontal: 20,
    maxHeight: 460,
  },
  scrollContent: {
    paddingTop: 14,
    paddingBottom: 16,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  gridCol: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  chipScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  categoryChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  categoryChipTxt: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  categoryChipTxtActive: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 6,
  },
  iconBoxActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  iconLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  iconLabelActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  sheetFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  submitBtn: {
    flex: 1,
    backgroundColor: '#6366F1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnDisabled: {
    opacity: 0.65,
  },
  submitBtnTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default ServiceFormModal;
