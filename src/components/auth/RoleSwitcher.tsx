import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { type Role } from '@/src/context/RoleContext';
import { Colors, FontSize, FontWeight, Radii } from '@/src/theme';

interface RoleSwitcherProps {
  selectedRole: Role;
  onRoleChange: (role: Role) => void;
}

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({
  selectedRole,
  onRoleChange,
}) => {
  const isConsumer = selectedRole === 'consumer';

  return (
    <View style={styles.container}>
      {/* Consumer Option */}
      <TouchableOpacity
        style={[
          styles.segment,
          isConsumer && styles.segmentActiveConsumer,
        ]}
        onPress={() => onRoleChange('consumer')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Select Consumer Role"
        accessibilityState={{ selected: isConsumer }}
      >
        <MaterialCommunityIcons
          name="home-heart"
          size={18}
          color={isConsumer ? '#FFFFFF' : '#94A3B8'}
          style={styles.icon}
        />
        <View>
          <Text style={[styles.title, isConsumer ? styles.titleActive : styles.titleInactive]}>
            Consumer
          </Text>
          <Text style={[styles.subtitle, isConsumer ? styles.subActive : styles.subInactive]}>
            Book Services
          </Text>
        </View>
      </TouchableOpacity>

      {/* Provider Option */}
      <TouchableOpacity
        style={[
          styles.segment,
          !isConsumer && styles.segmentActiveProvider,
        ]}
        onPress={() => onRoleChange('provider')}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Select Provider Role"
        accessibilityState={{ selected: !isConsumer }}
      >
        <MaterialCommunityIcons
          name="briefcase-account"
          size={18}
          color={!isConsumer ? '#FFFFFF' : '#94A3B8'}
          style={styles.icon}
        />
        <View>
          <Text style={[styles.title, !isConsumer ? styles.titleActive : styles.titleInactive]}>
            Provider
          </Text>
          <Text style={[styles.subtitle, !isConsumer ? styles.subActive : styles.subInactive]}>
            Grow Business
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radii.lg ?? 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  segmentActiveConsumer: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  segmentActiveProvider: {
    backgroundColor: '#D97706',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  titleActive: {
    color: '#FFFFFF',
  },
  titleInactive: {
    color: '#334155',
  },
  subtitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
  },
  subActive: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  subInactive: {
    color: '#64748B',
  },
});

export default RoleSwitcher;
