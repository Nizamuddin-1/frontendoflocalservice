import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radii } from '@/src/theme';

export interface InlineVariationRow {
  id: string;
  label: string;
  desc: string;
  price: string;
  duration: string;
}

interface Props {
  variations: InlineVariationRow[];
  onChange: (rows: InlineVariationRow[]) => void;
}

export const VariationRowEditor: React.FC<Props> = ({ variations, onChange }) => {
  const addRow = () => {
    const newRow: InlineVariationRow = {
      id: Date.now().toString(),
      label: '',
      desc: '',
      price: '',
      duration: '45 mins',
    };
    onChange([...variations, newRow]);
  };

  const removeRow = (id: string) => {
    onChange(variations.filter((r) => r.id !== id));
  };

  const updateField = (id: string, field: keyof InlineVariationRow, value: string) => {
    onChange(
      variations.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  return (
    <View style={s.container}>
      <View style={s.headerRow}>
        <View>
          <Text style={s.headerTitle}>Service Variations (Optional)</Text>
          <Text style={s.headerSub}>Add packages, tiers, or addon options</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={addRow} activeOpacity={0.75}>
          <Feather name="plus" size={14} color="#6366F1" />
          <Text style={s.addBtnTxt}>Add Tier</Text>
        </TouchableOpacity>
      </View>

      {variations.length === 0 ? (
        <TouchableOpacity style={s.emptyBox} onPress={addRow} activeOpacity={0.8}>
          <Feather name="layers" size={20} color="#94A3B8" />
          <Text style={s.emptyTitle}>No variations added yet</Text>
          <Text style={s.emptySub}>Tap to add standard, premium, or express options</Text>
        </TouchableOpacity>
      ) : (
        variations.map((row, index) => (
          <View key={row.id} style={s.rowCard}>
            <View style={s.cardTop}>
              <View style={s.badge}>
                <Text style={s.badgeTxt}>Tier #{index + 1}</Text>
              </View>
              <TouchableOpacity
                style={s.removeBtn}
                onPress={() => removeRow(row.id)}
                activeOpacity={0.7}
              >
                <Feather name="trash-2" size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>

            <View style={s.inputGrid}>
              <View style={s.inputHalf}>
                <Text style={s.label}>Title *</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. Deep Cleaning"
                  placeholderTextColor="#94A3B8"
                  value={row.label}
                  onChangeText={(val) => updateField(row.id, 'label', val)}
                />
              </View>

              <View style={s.inputQuarter}>
                <Text style={s.label}>Price (₹) *</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. 599"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={row.price}
                  onChangeText={(val) => updateField(row.id, 'price', val)}
                />
              </View>

              <View style={s.inputQuarter}>
                <Text style={s.label}>ETA *</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. 45 mins"
                  placeholderTextColor="#94A3B8"
                  value={row.duration}
                  onChangeText={(val) => updateField(row.id, 'duration', val)}
                />
              </View>
            </View>

            <View style={{ marginTop: 6 }}>
              <Text style={s.label}>Description</Text>
              <TextInput
                style={[s.input, s.descInput]}
                placeholder="What's included in this variation?"
                placeholderTextColor="#94A3B8"
                value={row.desc}
                onChangeText={(val) => updateField(row.id, 'desc', val)}
              />
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  addBtnTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
    marginLeft: 4,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginTop: 6,
  },
  emptySub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  rowCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4F46E5',
    textTransform: 'uppercase',
  },
  removeBtn: {
    padding: 4,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  inputHalf: {
    flex: 2,
  },
  inputQuarter: {
    flex: 1.2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 3,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    color: '#0F172A',
  },
  descInput: {
    paddingVertical: 6,
  },
});

export default VariationRowEditor;
