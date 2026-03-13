// HomeScreen.js
import React from 'react';
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width } = Dimensions.get('window');

// ─── DATA ────────────────────────────────────────────────────────────────────
 
 
const BottonNavigationBar = ()=>{
    const tabs = [
    { id: 'home', icon: 'home', label: 'Home', activeIcon: 'home', iconFamily: 'MaterialIcons' },
    { id: 'bookings', icon: 'calendar-check', label: 'Bookings', activeIcon: 'calendar-check', iconFamily: 'MaterialCommunityIcons' },
    { id: 'wallet', icon: 'wallet', label: 'Wallet', activeIcon: 'wallet', iconFamily: 'MaterialCommunityIcons' },
    { id: 'profile', icon: 'account-circle', label: 'Profile', activeIcon: 'account-circle', iconFamily: 'MaterialIcons' },
  ];
  return (
      <View>

      </View> 
  )
}
// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────

export default function HomeScreen({ navigation }) {
  

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

       

       
    </SafeAreaView>
  );
}

// ─── UPDATED STYLES ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1, backgroundColor: '#FFFFFF' },

  
   
});