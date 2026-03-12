import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarStyle: { display: 'none' }, // your HomeScreen has custom nav
    }}>
      <Tabs.Screen name="index" />
    </Tabs>
  );
}
 