import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';

import RoleSelectScreen from '@/screens/auth/RoleSelectScreen';
import ClientHomeScreen from '@/screens/client/ClientHomeScreen';
import EbookStoreScreen from '@/screens/client/EbookStoreScreen';
import CoachingScreen from '@/screens/client/CoachingScreen';
import BookConsultationScreen from '@/screens/client/BookConsultationScreen';
import FormCheckScreen from '@/screens/client/FormCheckScreen';
import AIChatScreen from '@/screens/client/AIChatScreen';
import ProfileScreen from '@/screens/client/ProfileScreen';
import ProgressScreen from '@/screens/client/ProgressScreen';
import HealthScreeningScreen from '@/screens/client/HealthScreeningScreen';
import SettingsScreen from '@/screens/shared/SettingsScreen';
import TrainerDashboardScreen from '@/screens/trainer/TrainerDashboardScreen';
import ClientListScreen from '@/screens/trainer/ClientListScreen';
import EarningsScreen from '@/screens/trainer/EarningsScreen';
import ClientDetailScreen from '@/screens/trainer/ClientDetailScreen';
import ReviewFormCheckScreen from '@/screens/trainer/ReviewFormCheckScreen';

const Stack = createNativeStackNavigator();
const ClientStack = createNativeStackNavigator();
const TrainerStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    primary: colors.accent,
  },
};

const modalHeaderOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.ink,
  headerTitleStyle: { color: colors.ink },
};

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkMuted,
      }}
    >
      <Tab.Screen name="Home" component={ClientHomeScreen} />
      <Tab.Screen name="Form Check" component={FormCheckScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="AI Coach" component={AIChatScreen} />
      <Tab.Screen name="Ebooks" component={EbookStoreScreen} />
      <Tab.Screen name="Coaching" component={CoachingScreen} />
      <Tab.Screen name="Book" component={BookConsultationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function ClientNavigator() {
  return (
    <ClientStack.Navigator>
      <ClientStack.Screen name="Tabs" component={ClientTabs} options={{ headerShown: false }} />
      <ClientStack.Screen
        name="HealthScreening"
        component={HealthScreeningScreen}
        options={{ ...modalHeaderOptions, title: 'Health screening', presentation: 'modal' }}
      />
    </ClientStack.Navigator>
  );
}

function TrainerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.inkMuted,
      }}
    >
      <Tab.Screen name="Dashboard" component={TrainerDashboardScreen} />
      <Tab.Screen name="Clients" component={ClientListScreen} />
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function TrainerNavigator() {
  return (
    <TrainerStack.Navigator>
      <TrainerStack.Screen name="Tabs" component={TrainerTabs} options={{ headerShown: false }} />
      <TrainerStack.Screen
        name="ReviewFormCheck"
        component={ReviewFormCheckScreen}
        options={{ ...modalHeaderOptions, title: 'Review form-check' }}
      />
      <TrainerStack.Screen
        name="ClientDetail"
        component={ClientDetailScreen}
        options={{ ...modalHeaderOptions, title: 'Client' }}
      />
    </TrainerStack.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        ) : user.role === 'client' ? (
          <Stack.Screen name="ClientNavigator" component={ClientNavigator} />
        ) : (
          <Stack.Screen name="TrainerNavigator" component={TrainerNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
