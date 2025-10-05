import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import { theme } from '../lib/theme'
import { rentalService } from '../lib/rentalService'
import { mockListings } from '../data/mockListings'

export default function ActiveRentalScreen(){
  const route = useRoute<RouteProp<Record<string, object | undefined>, string>>()
  const navigation = useNavigation()
  const params: any = (route.params ?? {})
  const requestId = params.requestId

  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    async function load(){
      setLoading(true)
      const r = await rentalService.getRequest(requestId)
      if (!mounted) return
      setRequest(r)
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <View style={[styles.container, styles.center]}><ActivityIndicator color={theme.colors.primary} /></View>

  if (!request) return (
    <View style={[styles.container, styles.center]}>
      <Text style={styles.title}>Данные не найдены</Text>
      <Text style={styles.text}>Не удалось найти информацию о текущем найме.</Text>
    </View>
  )

  const listing = mockListings.find(l => l.id === request.listingId)

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Текущий наём</Text>
      <View style={styles.card}>
        <Text style={styles.title}>{listing?.title ?? 'Квартира'}</Text>
        <Text style={styles.text}>{listing?.location}</Text>
        <Text style={styles.price}>{listing?.price} BYN / мес</Text>

        <View style={{ marginTop: theme.spacing.md }}>
          <Text style={styles.small}>Статус</Text>
          <Text style={[styles.text, { marginTop: 6 }]}>{request.status}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Профиль' as any)}>
          <Text style={styles.buttonText}>Перейти в профиль</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: theme.type.h2, fontWeight: '700', color: theme.colors.onSurface, padding: theme.spacing.md, paddingTop: theme.spacing.lg },
  card: { margin: theme.spacing.md, backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, padding: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.outline },
  title: { fontSize: theme.type.h3, fontWeight: '700', color: theme.colors.onSurface },
  text: { color: theme.colors.onSurfaceVariant },
  price: { color: theme.colors.primary, fontWeight: '700', marginTop: theme.spacing.sm },
  small: { color: theme.colors.onSurfaceVariant, fontSize: theme.type.small },
  button: { marginTop: theme.spacing.md, backgroundColor: theme.colors.primary, padding: theme.spacing.md, borderRadius: theme.radii.md, alignItems: 'center' },
  buttonText: { color: theme.colors.onPrimary, fontWeight: '700' }
})
