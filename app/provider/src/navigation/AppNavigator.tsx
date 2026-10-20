
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer }       from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen           from '../screens/1_providerStats';
import BookingDetailsScreen from '../screens/2_bookingDetails';
import ActiveJobScreen      from '../screens/3_activeJobDetails';
import DashboardScreen      from '../screens/4_dashboard';
import JobCompleteScreen    from '../screens/5_jobComplete';
import ProfileScreen        from '../screens/6_profileScreen';

import type { RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<MainTabParamList>();

// ─────────────────────────────────────────────
//  Custom Tab Bar (Professional Vector Icons)
// ─────────────────────────────────────────────

function CustomTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[tabStyles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isActive = state.index === index;
        const color = isActive ? '#0A1628' : '#94A3B8';
        const label =
          options.tabBarLabel !== undefined
            ? (typeof options.tabBarLabel === 'function'
                ? options.tabBarLabel({ focused: isActive, color, position: 'below-icon', children: route.name })
                : options.tabBarLabel)
            : options.title !== undefined
            ? options.title
            : route.name;

        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.tab}
            onPress={() => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isActive && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isActive ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            <View style={[tabStyles.iconWrap, isActive && tabStyles.iconWrapActive]}>
              {options.tabBarIcon ? (
                options.tabBarIcon({ focused: isActive, color, size: 22 })
              ) : null}
            </View>
            <Text style={[tabStyles.label, isActive && tabStyles.labelActive]}>
              {label as string}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth:  1,
    borderTopColor:  '#EEF1F8',
    paddingTop:      8,
    shadowColor:     '#0A1628',
    shadowOffset:    { width: 0, height: -3 },
    shadowOpacity:   0.04,
    shadowRadius:    8,
    elevation:       8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 36,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: '#F0F2F8',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  labelActive: {
    color: '#0A1628',
    fontWeight: '700',
  },
});

// ─────────────────────────────────────────────
//  Main Tabs
// ─────────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#0A1628',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ellipse-outline';
          if (route.name === 'Home') {
            iconName = focused ? 'speedometer' : 'speedometer-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size || 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"      component={HomeScreen}      />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile"   component={ProfileScreen}   />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────
//  Slide-up card transition for modal screens
// ─────────────────────────────────────────────

const slideUpOptions: StackNavigationOptions = {
  cardStyleInterpolator: ({ current, layouts }) => ({
    cardStyle: {
      transform: [
        {
          translateY: current.progress.interpolate({
            inputRange:  [0, 1],
            outputRange: [layouts.screen.height * 0.5, 0],
          }),
        },
      ],
      opacity: current.progress,
    },
    overlayStyle: {
      opacity: current.progress.interpolate({
        inputRange:  [0, 1],
        outputRange: [0, 0.35],
      }),
    },
  }),
};

// ─────────────────────────────────────────────
//  Root Stack
// ─────────────────────────────────────────────

export default function AppNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => ({
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width * 0.25, 0],
                  }),
                },
              ],
              opacity: current.progress,
            },
          }),
        }}
      >
        <Stack.Screen name="MainTabs"       component={MainTabs} />
        <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={slideUpOptions} />
        <Stack.Screen name="ActiveJob"      component={ActiveJobScreen} />
        <Stack.Screen name="JobComplete"    component={JobCompleteScreen} options={slideUpOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
