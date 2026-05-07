import React, { useContext, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import Home from './screens/Home';
import RealmsOverview from './screens/RealmsOverview';
import RealmDetail from './screens/RealmDetail';
import BindingVow from './screens/BindingVow';
import BindingVowForm from './screens/BindingVowForm';
import VowDetail from './screens/VowDetail';
import CustomCalendar from './screens/CustomCalendar';
import Codex from './screens/Codex';
import ThreeSecondProtocol from './screens/ThreeSecondProtocol';
import VoidSession from './screens/VoidSession';
import TemporalAnchor from './screens/TemporalAnchor';
import Profile from './screens/Profile';

import AuthContextProvider, { AuthContext } from './store/auth-context';
import CalendarContextProvider from './store/calendar-context';
import { ThemeProvider, useTheme } from './store/theme-context';
import { VoidProvider } from './store/void-context';
import { CharacterProvider } from './store/character-context';
import { Tokens, getTheme } from './constants/styles';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

SplashScreen.preventAutoHideAsync().catch(() => {});

function buildNavTheme(t) {
  return {
    ...DefaultTheme,
    dark: true,
    colors: {
      ...DefaultTheme.colors,
      primary: t.accent,
      background: t.background,
      card: t.background,
      text: t.textPrimary,
      border: t.hairline,
      notification: t.primary,
    },
  };
}

function AuthStack() {
  const { theme } = useTheme();
  const t = getTheme(theme);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: t.background },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

function tabIcon(name) {
  return ({ color, size, focused }) => (
    <View style={[styles.tabIconWrap, focused && { transform: [{ translateY: -2 }] }]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

function TabTitle({ label, focused, t }) {
  return (
    <Text
      style={{
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: focused ? t.accent : t.textTertiary,
      }}
    >
      {label}
    </Text>
  );
}

function MainTabs() {
  const { theme } = useTheme();
  const t = getTheme(theme);
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.textTertiary,
        tabBarStyle: {
          backgroundColor: t.background,
          borderTopColor: t.hairline,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="Today"
        component={Home}
        options={{
          tabBarIcon: tabIcon('flame-outline'),
          tabBarLabel: ({ focused }) => <TabTitle label="Today" focused={focused} t={t} />,
        }}
      />
      <Tabs.Screen
        name="Realms"
        component={RealmsOverview}
        options={{
          tabBarIcon: tabIcon('layers-outline'),
          tabBarLabel: ({ focused }) => <TabTitle label="Realms" focused={focused} t={t} />,
        }}
      />
      <Tabs.Screen
        name="Vows"
        component={BindingVow}
        options={{
          tabBarIcon: tabIcon('diamond-outline'),
          tabBarLabel: ({ focused }) => <TabTitle label="Vows" focused={focused} t={t} />,
        }}
      />
      <Tabs.Screen
        name="Ledger"
        component={CustomCalendar}
        options={{
          tabBarIcon: tabIcon('calendar-outline'),
          tabBarLabel: ({ focused }) => <TabTitle label="Ledger" focused={focused} t={t} />,
        }}
      />
      <Tabs.Screen
        name="Codex"
        component={Codex}
        options={{
          tabBarIcon: tabIcon('book-outline'),
          tabBarLabel: ({ focused }) => <TabTitle label="Codex" focused={focused} t={t} />,
        }}
      />
      <Tabs.Screen
        name="Self"
        component={Profile}
        options={{
          tabBarIcon: tabIcon('person-outline'),
          tabBarLabel: ({ focused }) => <TabTitle label="Self" focused={focused} t={t} />,
        }}
      />
    </Tabs.Navigator>
  );
}

function AuthenticatedStack() {
  const { theme } = useTheme();
  const t = getTheme(theme);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: t.background },
        headerTintColor: t.textPrimary,
        headerTitleStyle: { ...Tokens.font.h3, color: t.textPrimary },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: t.background },
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="TemporalAnchor"
        component={TemporalAnchor}
        options={{ presentation: 'fullScreenModal', headerShown: false }}
      />
      <Stack.Screen
        name="ThreeSecondProtocol"
        component={ThreeSecondProtocol}
        options={{ presentation: 'modal', title: '3-Second Rule' }}
      />
      <Stack.Screen
        name="VoidSession"
        component={VoidSession}
        options={{ presentation: 'modal', title: 'Log Session' }}
      />
      <Stack.Screen
        name="BindingVowForm"
        component={BindingVowForm}
        options={{ presentation: 'modal', title: 'Inscribe Vow' }}
      />
      <Stack.Screen name="VowDetail" component={VowDetail} options={{ title: 'Vow' }} />
      <Stack.Screen name="RealmDetail" component={RealmDetail} options={{ title: 'Realm' }} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { theme } = useTheme();
  const t = getTheme(theme);
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer theme={buildNavTheme(t)}>
      {authCtx.isAuthenticated ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedUserId = await AsyncStorage.getItem('userId');
        const storedExpiration = await AsyncStorage.getItem('tokenExpiration');
        if (storedToken && storedUserId && storedExpiration) {
          const remaining = new Date(storedExpiration).getTime() - Date.now();
          if (remaining > 60000) {
            authCtx.authenticate(storedToken, storedUserId);
            setTimeout(authCtx.logout, remaining);
          } else {
            authCtx.logout();
          }
        }
      } catch {
        authCtx.logout();
      } finally {
        setIsTryingLogin(false);
        SplashScreen.hideAsync().catch(() => {});
      }
    })();
  }, []);

  if (isTryingLogin) return null;
  return <Navigation />;
}

export default function App() {
  return (
    <ThemeProvider>
      <StatusBar style="light" />
      <AuthContextProvider>
        <CalendarContextProvider>
          <VoidProvider>
            <CharacterProvider>
              <Root />
            </CharacterProvider>
          </VoidProvider>
        </CalendarContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: { alignItems: 'center', justifyContent: 'center' },
});
