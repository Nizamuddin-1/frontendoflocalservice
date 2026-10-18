import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { VariationEditor, VariationItem } from './VariationEditor';
import { FontSize, FontWeight, Radii } from '@/src/theme';

export interface ServiceData {
  name: string;
  categoryLabel: string;
  shortDesc: string;
  price: string;
  originalPrice?: string;
  eta: string;
  mcIcon: string;
  variations: VariationItem[];
}

interface ProviderServiceStepProps {
  initialTradeCategory: string;
  onSubmit: (serviceData: ServiceData) => void;
  onSkip: () => void;
  onBack: () => void;
  loading: boolean;
}

const AVAILABLE_ICONS = [
  { icon: 'tools', label: 'General' },
  { icon: 'lightning-bolt', label: 'Electrical' },
  { icon: 'pipe-wrench', label: 'Plumbing' },
  { icon: 'broom', label: 'Cleaning' },
  { icon: 'air-conditioner', label: 'AC' },
  { icon: 'hammer', label: 'Carpentry' },
];

export const ProviderServiceStep: React.FC<ProviderServiceStepProps> = ({
  initialTradeCategory,
  onSubmit,
  onSkip,
  onBack,
  loading,
}) => {
  const [name, setName] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [price, setPrice] = useState('');
  const [eta, setEta] = useState('30-45 mins');
  const [mcIcon, setMcIcon] = useState('tools');
  const [variations, setVariations] = useState<VariationItem[]>([
    {
      id: '1',
      label: 'Standard Service',
      desc: 'Complete inspection & standard repair',
      price: '299',
      duration: '45 mins',
      mcIcon: 'tools',
      popular: true,
    },
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = () => {
    setError(null);
    if (!name.trim()) {
      setError('Service title is required.');
      return;
    }
    if (!shortDesc.trim()) {
      setError('Service description is required.');
      return;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Please provide a valid positive base price.');
      return;
    }
    if (!eta.trim()) {
      setError('Estimated turnaround time is required.');
      return;
    }

    // Validate variations if present
    for (const v of variations) {
      if (!v.label.trim()) {
        setError('Every variation must have an option name.');
        return;
      }
      if (!v.price || isNaN(Number(v.price)) || Number(v.price) <= 0) {
        setError(`Please provide a valid price for "${v.label}".`);
        return;
      }
    }

    onSubmit({
      name: name.trim(),
      categoryLabel: initialTradeCategory || 'Home Services',
      shortDesc: shortDesc.trim(),
      price: price.trim(),
      eta: eta.trim(),
      mcIcon,
      variations,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>Create Your First Service</Text>
      <Text style={styles.stepSub}>
        Define the primary service customers can book from your profile. You can also skip this and add services later.
      </Text>

      {error ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={16} color="#EF4444" style={{ marginRight: 6 }} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Service Name */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Ceiling Fan Installation & Repair"
          placeholderTextColor="#64748B"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
      </View>

      {/* Short Description */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Short Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g. Professional repair and installation with complete safety testing."
          placeholderTextColor="#64748B"
          value={shortDesc}
          onChangeText={setShortDesc}
          multiline
          numberOfLines={2}
          editable={!loading}
        />
      </View>

      {/* Price & ETA */}
      <View style={styles.row}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Base Price (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="299"
            placeholderTextColor="#64748B"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            editable={!loading}
          />
        </View>
        <View style={[styles.inputGroup, { flex: 1 }]}>
          <Text style={styles.label}>Turnaround ETA *</Text>
          <TextInput
            style={styles.input}
            placeholder="30-45 mins"
            placeholderTextColor="#64748B"
            value={eta}
            onChangeText={setEta}
            editable={!loading}
          />
        </View>
      </View>

      {/* Icon Picker */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Service Icon</Text>
        <View style={styles.iconRow}>
          {AVAILABLE_ICONS.map((item) => (
            <TouchableOpacity
              key={item.icon}
              style={[
                styles.iconChip,
                mcIcon === item.icon && styles.iconChipActive,
              ]}
              onPress={() => setMcIcon(item.icon)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={18}
                color={mcIcon === item.icon ? '#F59E0B' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.iconChipLabel,
                  mcIcon === item.icon && styles.iconChipLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Embedded Variations Editor */}
      <VariationEditor variations={variations} onChange={setVariations} />

      {/* Action Buttons */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={16} color="#94A3B8" />
          <Text style={styles.backBtnText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={onSkip}
          disabled={loading}
          activeOpacity={0.7}
        >
          <Text style={styles.skipBtnText}>Do it later</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.completeBtn, loading && styles.completeBtnDisabled]}
          onPress={handleComplete}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.completeBtnText}>Save & Finish</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 4,
  },
  stepTitle: {
    color: '#0F172A',
    fontSize: FontSize.lg ?? 16,
    fontWeight: FontWeight.bold,
  },
  stepSub: {
    color: '#64748B',
    fontSize: FontSize.xs,
    marginTop: 2,
    marginBottom: 12,
    lineHeight: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#F87171',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: FontSize.xs,
    flex: 1,
    fontWeight: FontWeight.medium,
  },
  inputGroup: {
    marginBottom: 10,
  },
  label: {
    color: '#1E293B',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 9,
    color: '#0F172A',
    fontSize: FontSize.base ?? 12,
  },
  textArea: {
    minHeight: 50,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  iconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  iconChipActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
  },
  iconChipLabel: {
    color: '#64748B',
    fontSize: FontSize.xs,
    marginLeft: 4,
  },
  iconChipLabelActive: {
    color: '#B45309',
    fontWeight: FontWeight.semibold,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 8,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  backBtnText: {
    color: '#334155',
    fontSize: FontSize.xs,
    marginLeft: 4,
    fontWeight: FontWeight.medium,
  },
  skipBtn: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  skipBtnText: {
    color: '#64748B',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    textDecorationLine: 'underline',
  },
  completeBtn: {
    flex: 1,
    backgroundColor: '#D97706',
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeBtnDisabled: {
    opacity: 0.65,
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: FontSize.base ?? 12,
    fontWeight: FontWeight.bold,
  },
});

export default ProviderServiceStep;
