import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from '@expo/vector-icons'

import ListingsScreen from './screens/ListingsScreen'
import ListingDetailScreen from './screens/ListingDetailScreen'
import BookingsScreen from './screens/BookingsScreen'
import ProfileScreen from './screens/ProfileScreen'
import RentalFlowScreen from './screens/RentalFlowScreen'
import ActiveRentalScreen from './screens/ActiveRentalScreen'
import AdminConfirmationsScreen from './screens/AdminConfirmationsScreen'
import { theme } from './lib/theme'

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ListingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Listings" component={ListingsScreen} />
      <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
    </Stack.Navigator>
  )
}

function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.outline },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, any> = {
            'Главная': 'home',
            'Бронирования': 'calendar',
            'Профиль': 'person'
          }
          const name = icons[route.name] ?? 'ellipse'
          return <Ionicons name={name as any} size={size} color={color} />
        }
      })}
    >
      <Tab.Screen name="Главная" component={ListingsStack} />
      <Tab.Screen name="Бронирования" component={BookingsScreen} />
      <Tab.Screen name="Профиль" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container} edges={["top"]}>
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Main" component={RootTabs} />
            <RootStack.Screen name="RentalFlow" component={RentalFlowScreen} />
            <RootStack.Screen name="ActiveRental" component={ActiveRentalScreen} />
            <RootStack.Screen name="AdminConfirmations" component={AdminConfirmationsScreen} />
          </RootStack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  }
});
