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
  Switch,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { providerApi } from '@/src/services/api/endpoints/provider';
import { Colors, FontSize, FontWeight, Radii } from '@/src/theme';

export interface VariationData {
  _id?: string;
  id?: string;
  label: string;
  desc: string;
  price: number | string;
  duration: string;
  popular?: boolean;
  mcIcon?: string;
}

interface Props {
  visible: boolean;
  serviceId: string;
  serviceName?: string;
  initialVariation?: VariationData | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const VariationFormModal: React.FC<Props> = ({
  visible,
  serviceId,
  serviceName,
  initialVariation,
  onClose,
  onSuccess,
}) => {
  const isEditing = Boolean(initialVariation && (initialVariation._id || initialVariation.id));
  const variationId = initialVariation?._id || initialVariation?.id;

  const [label, setLabel] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('45 mins');
  const [popular, setPopular] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (initialVariation) {
      setLabel(initialVariation.label || '');
      setDesc(initialVariation.desc || '');
      setPrice(String(initialVariation.price || ''));
      setDuration(initialVariation.duration || '45 mins');
      setPopular(Boolean(initialVariation.popular));
    } else {
      resetForm();
    }
  }, [initialVariation, visible]);

  const resetForm = () => {
    setLabel('');
    setDesc('');
    setPrice('');
    setDuration('45 mins');
    setPopular(false);
    setErrorMsg(null);
  };

  const isDirty = isEditing
    ? label !== (initialVariation?.label || '') ||
      desc !== (initialVariation?.desc || '') ||
      price !== String(initialVariation?.price || '') ||
      popular !== Boolean(initialVariation?.popular)
    : Boolean(label.trim()) || Boolean(desc.trim()) || Boolean(price.trim());

  const handleAttemptClose = () => {
    if (isDirty) {
      Alert.alert(
        'Discard Unsaved Changes?',
        'You have unsaved changes in this variation form. Are you sure you want to exit?',
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
    if (!label.trim()) return 'Variation title is required.';
    if (label.trim().length > 100) return 'Variation title cannot exceed 100 characters.';
    if (!desc.trim()) return 'Description is required.';
    if (desc.trim().length > 300) return 'Description cannot exceed 300 characters.';
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) return 'Price must be a valid positive number.';
    if (!duration.trim()) return 'Duration is required (e.g. 45 mins).';
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
      const payload = {
        label: label.trim(),
        desc: desc.trim(),
        price: Number(price),
        duration: duration.trim(),
        mcIcon: initialVariation?.mcIcon || 'check-circle',
        popular,
      };

      if (isEditing && variationId) {
        await providerApi.updateVariation(variationId, payload);
        Alert.alert('Updated', 'Service variation updated successfully!');
      } else {
        await providerApi.createVariation(serviceId, payload);
        Alert.alert('Created', 'New variation added to service!');
      }

      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.message || 'Failed to save variation. Please try again.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!variationId) return;

    Alert.alert(
      'Delete Variation',
      `Are you sure you want to delete "${label}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true);
            try {
              await providerApi.deleteVariation(variationId);
              Alert.alert('Deleted', 'Variation removed successfully.');
              resetForm();
              onSuccess();
              onClose();
            } catch (err: any) {
              const msg = err?.message || 'Failed to delete variation.';
              setErrorMsg(msg);
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
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
                <Text style={s.headerTitle}>
                  {isEditing ? 'Edit Variation' : 'Add Service Variation'}
                </Text>
                <Text style={s.headerSub}>
                  {serviceName ? `For: ${serviceName}` : 'Add custom scope or pricing tier'}
                </Text>
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
              {/* Variation Title */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Variation Title *</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. Premium Deep Cleaning"
                  placeholderTextColor="#94A3B8"
                  value={label}
                  onChangeText={setLabel}
                  editable={!saving && !deleting}
                />
              </View>

              {/* Price & Duration */}
              <View style={s.gridRow}>
                <View style={s.gridCol}>
                  <Text style={s.label}>Price (₹) *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="e.g. 699"
                    placeholderTextColor="#94A3B8"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    editable={!saving && !deleting}
                  />
                </View>

                <View style={s.gridCol}>
                  <Text style={s.label}>Duration *</Text>
                  <TextInput
                    style={s.input}
                    placeholder="e.g. 60 mins"
                    placeholderTextColor="#94A3B8"
                    value={duration}
                    onChangeText={setDuration}
                    editable={!saving && !deleting}
                  />
                </View>
              </View>

              {/* Scope Description */}
              <View style={s.fieldGroup}>
                <Text style={s.label}>Scope Description *</Text>
                <TextInput
                  style={[s.input, s.textArea]}
                  placeholder="Detailed breakdown of tasks included in this tier..."
                  placeholderTextColor="#94A3B8"
                  value={desc}
                  onChangeText={setDesc}
                  multiline
                  numberOfLines={3}
                  editable={!saving && !deleting}
                />
              </View>

              {/* Popular Tier Switch */}
              <View style={s.switchRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.switchLabel}>Highlight as Popular</Text>
                  <Text style={s.switchSub}>Displays a &apos;Most Popular&apos; badge on the booking card</Text>
                </View>
                <Switch
                  value={popular}
                  onValueChange={setPopular}
                  trackColor={{ false: '#E2E8F0', true: '#C7D2FE' }}
                  thumbColor={popular ? '#6366F1' : '#CBD5E1'}
                />
              </View>

              {/* Delete Variation Action (Edit Mode) */}
              {isEditing && (
                <TouchableOpacity
                  style={s.deleteActionBtn}
                  onPress={handleDelete}
                  disabled={deleting || saving}
                  activeOpacity={0.8}
                >
                  <Feather name="trash-2" size={15} color="#EF4444" />
                  <Text style={s.deleteActionTxt}>
                    {deleting ? 'Deleting...' : 'Delete This Variation'}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {/* Bottom Actions */}
            <View style={s.sheetFooter}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={handleAttemptClose}
                disabled={saving || deleting}
                activeOpacity={0.75}
              >
                <Text style={s.cancelBtnTxt}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.submitBtn, (saving || deleting) && s.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={saving || deleting}
                activeOpacity={0.85}
              >
                {saving ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={s.submitBtnTxt}>
                    {isEditing ? 'Save Changes' : 'Add Variation'}
                  </Text>
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
    maxHeight: '85%',
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
    maxHeight: 400,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  switchSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  deleteActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginTop: 12,
    gap: 6,
  },
  deleteActionTxt: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
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

export default VariationFormModal;
