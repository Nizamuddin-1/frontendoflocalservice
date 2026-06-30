import { useColorScheme } from '@/hooks/use-color-scheme';
import { RoleProvider } from '@/src/context/RoleContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Later: derive the initial role from auth → const { role } = useAuthStore();
  return (
    <RoleProvider initialRole="consumer">
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          {/* Later: add auth screens here */}
          {/* <Stack.Screen name="(auth)" /> */}
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </RoleProvider>
  );
}