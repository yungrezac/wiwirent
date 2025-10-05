import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ScrollView } from 'react-native'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import { mockListings } from '../data/mockListings'
import { theme } from '../lib/theme'
import { Ionicons } from '@expo/vector-icons'

export default function ListingDetailScreen() {
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>()
  const navigation = useNavigation()
  const params: any = (route.params ?? {})
  const id = params.id ?? mockListings[0].id
  const listing = mockListings.find(l => l.id === id) || mockListings[0]

  function handlePay() {
    // Placeholder for payment integration (Stripe/ApplePay/GooglePay)
    Alert.alert('Оплата', 'Здесь будет интеграция оплаты. (тестовая реализация)')
  }

  function handleRent() {
    // Запускаем пошаговый поток аренды
    navigation.navigate('RentalFlow' as any, { id: listing.id })
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Объявление</Text>
      </View>

      <Image source={{ uri: listing.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.meta}>{listing.location} • {listing.rooms} комн. • {listing.size} м²</Text>
        <Text style={styles.price}>{listing.price} BYN / мес</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Описание</Text>
          <Text style={styles.sectionText}>{listing.description}</Text>
        </View>

        <TouchableOpacity style={styles.rentButton} onPress={handleRent} activeOpacity={0.85}>
          <Text style={styles.rentButtonText}>Арендовать — отправить заявку</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.payButton} onPress={handlePay} activeOpacity={0.8}>
          <Text style={styles.payButtonText}>Быстрая оплата</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: theme.spacing.md, paddingTop: theme.spacing.lg },
  backBtn: { marginRight: theme.spacing.sm, padding: theme.spacing.xs, borderRadius: theme.radii.sm, backgroundColor: theme.colors.surface },
  headerTitle: { fontSize: theme.type.h3, fontWeight: '700', color: theme.colors.onSurface },
  image: { width: '100%', height: 260, backgroundColor: theme.colors.surfaceVariant },
  content: { padding: theme.spacing.md },
  title: { fontSize: theme.type.h2, fontWeight: '700', color: theme.colors.onSurface },
  meta: { color: theme.colors.onSurfaceVariant, marginTop: 6 },
  price: { marginTop: 12, fontSize: theme.type.h3, color: theme.colors.primary, fontWeight: '700' },
  section: { marginTop: theme.spacing.md },
  sectionTitle: { fontSize: theme.type.h3, fontWeight: '600', color: theme.colors.onSurface },
  sectionText: { marginTop: 8, color: theme.colors.onSurfaceVariant, lineHeight: 20 },
  rentButton: { marginTop: 18, backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radii.md, alignItems: 'center' },
  rentButtonText: { color: theme.colors.onPrimary, fontWeight: '700' },
  payButton: { marginTop: 12, backgroundColor: theme.colors.surface, borderColor: theme.colors.outline, borderWidth: 1, padding: theme.spacing.md, borderRadius: theme.radii.md, alignItems: 'center' },
  payButtonText: { color: theme.colors.onSurface, fontWeight: '700' }
})
