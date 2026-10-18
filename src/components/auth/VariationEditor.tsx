import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontSize, FontWeight, Radii } from '@/src/theme';

export interface VariationItem {
  id: string;
  label: string;
  desc: string;
  price: string;
  originalPrice?: string;
  duration: string;
  mcIcon: string;
  popular?: boolean;
}

interface VariationEditorProps {
  variations: VariationItem[];
  onChange: (variations: VariationItem[]) => void;
}

export const VariationEditor: React.FC<VariationEditorProps> = ({
  variations,
  onChange,
}) => {
  const addVariation = () => {
    const newItem: VariationItem = {
      id: Date.now().toString(),
      label: '',
      desc: '',
      price: '',
      duration: '30 mins',
      mcIcon: 'tools',
      popular: false,
    };
    onChange([...variations, newItem]);
  };

  const removeVariation = (id: string) => {
    onChange(variations.filter((v) => v.id !== id));
  };

  const updateField = (id: string, field: keyof VariationItem, value: any) => {
    onChange(
      variations.map((v) => {
        if (v.id === id) {
          return { ...v, [field]: value };
        }
        return v;
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Service Variations</Text>
          <Text style={styles.subtitle}>Offer tiers or options (e.g. Basic, Premium)</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={addVariation}
          activeOpacity={0.8}
        >
          <Ionicons name="add-circle-outline" size={16} color="#D97706" style={{ marginRight: 4 }} />
          <Text style={styles.addBtnText}>Add Option</Text>
        </TouchableOpacity>
      </View>

      {variations.length === 0 ? (
        <View style={styles.emptyCard}>
          <MaterialCommunityIcons name="layers-outline" size={28} color="#64748B" />
          <Text style={styles.emptyText}>No variations added yet.</Text>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            onPress={addVariation}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyAddBtnText}>+ Add First Variation</Text>
          </TouchableOpacity>
        </View>
      ) : (
        variations.map((v, index) => (
          <View key={v.id} style={styles.card}>
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Option {index + 1}</Text>
              </View>
              <TouchableOpacity
                onPress={() => removeVariation(v.id)}
                style={styles.deleteBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>

            {/* Variation Label */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 2, marginRight: 8 }]}>
                <Text style={styles.label}>Option Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Standard Repair"
                  placeholderTextColor="#64748B"
                  value={v.label}
                  onChangeText={(val) => updateField(v.id, 'label', val)}
                />
              </View>
              <View style={[styles.field, { flex: 1 }]}>
                <Text style={styles.label}>Price (₹) *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="299"
                  placeholderTextColor="#64748B"
                  value={v.price}
                  keyboardType="numeric"
                  onChangeText={(val) => updateField(v.id, 'price', val)}
                />
              </View>
            </View>

            {/* Duration & Description */}
            <View style={styles.row}>
              <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Duration *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 45 mins"
                  placeholderTextColor="#64748B"
                  value={v.duration}
                  onChangeText={(val) => updateField(v.id, 'duration', val)}
                />
              </View>
              <View style={[styles.field, { flex: 2 }]}>
                <Text style={styles.label}>Scope Description *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Includes inspection & testing"
                  placeholderTextColor="#64748B"
                  value={v.desc}
                  onChangeText={(val) => updateField(v.id, 'desc', val)}
                />
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#0F172A',
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  subtitle: {
    color: '#64748B',
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D97706',
  },
  addBtnText: {
    color: '#B45309',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#64748B',
    fontSize: FontSize.xs,
    marginTop: 6,
    marginBottom: 8,
  },
  emptyAddBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
  },
  emptyAddBtnText: {
    color: '#B45309',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#B45309',
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },
  deleteBtn: {
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  field: {
    justifyContent: 'center',
  },
  label: {
    color: '#475569',
    fontSize: FontSize.xs,
    marginBottom: 4,
    fontWeight: FontWeight.medium,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 10,
    paddingVertical: 7,
    color: '#0F172A',
    fontSize: FontSize.base ?? 12,
  },
});

export default VariationEditor;
