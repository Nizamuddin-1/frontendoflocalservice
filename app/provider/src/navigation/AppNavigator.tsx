
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer }       from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';

import HomeScreen           from '../screens/1_providerStats';
import BookingDetailsScreen from '../screens/2_bookingDetails';
import ActiveJobScreen      from '../screens/3_activeJobDetails';
import DashboardScreen      from '../screens/4_dashboard';
import JobCompleteScreen    from '../screens/5_jobComplete';
import ProfileScreen        from '../screens/6_profileScreen';

import { Colors, FontWeight, FontSize } from '../theme';
import type { RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator<MainTabParamList>();

// ─────────────────────────────────────────────
//  Tab icons
// ─────────────────────────────────────────────

const TAB_ICONS: Record<keyof MainTabParamList, string> = {
  Home:      '🏠',
  Dashboard: '⊞',
  Profile:   '👤',
};

// ─────────────────────────────────────────────
//  Custom Tab Bar
// ─────────────────────────────────────────────

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={tabStyles.container}>
      {state.routes.map((route, index) => {
        const isActive = state.index === index;
        const icon     = TAB_ICONS[route.name as keyof MainTabParamList];

        return (
          <TouchableOpacity
            key={route.key}
            style={tabStyles.tab}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Text style={[tabStyles.icon, isActive && tabStyles.iconActive]}>
              {icon}
            </Text>
            <Text style={[tabStyles.label, isActive && tabStyles.labelActive]}>
              {route.name}
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
    backgroundColor: Colors.card,
    borderTopWidth:  1,
    borderTopColor:  Colors.border,
    paddingTop:      10,
    paddingBottom:   14,
  },
  tab:         { flex: 1, alignItems: 'center', gap: 3 },
  icon:        { fontSize: 20, opacity: 0.35 },
  iconActive:  { opacity: 1 },
  label:       { fontSize: 9, fontWeight: FontWeight.semibold, color: Colors.ink4, letterSpacing: 0.3 },
  labelActive: { color: Colors.accent },
});

// ─────────────────────────────────────────────
//  Main Tabs
// ─────────────────────────────────────────────

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
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
    // NO NavigationContainer here
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
  );
}
