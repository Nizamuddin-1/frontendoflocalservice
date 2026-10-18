import { useColorScheme } from '@/hooks/use-color-scheme';
import { RoleProvider, type Role } from '@/src/context/RoleContext';
import { Provider } from 'react-redux';
import store from '@/src/redux/store';
import { config } from '@/src/config/env';
import { DevAutoLogin } from '@/src/services/devAutoLogin';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';
  const initialRole: Role = isDev && config.devAutoLogin && config.devAutoLoginRole === 'provider'
    ? 'provider'
    : 'consumer';

  return (
    <Provider store={store}>
      <RoleProvider initialRole={initialRole}>
        <DevAutoLogin />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </RoleProvider>
    </Provider>
  );
}