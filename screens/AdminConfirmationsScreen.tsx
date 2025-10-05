import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { theme } from '../lib/theme'
import { rentalService } from '../lib/rentalService'
import { mockListings } from '../data/mockListings'
import StatusBadge from '../components/StatusBadge'

export default function AdminConfirmationsScreen(){
  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState<any[]>([])

  async function load(){
    setLoading(true)
    const all = await rentalService.listRequests()
    setRequests(all)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function changeStatus(id: string, status: any){
    try{
      await rentalService.adminSetStatus(id, status)
      await load()
    }catch(e){ Alert.alert('Ошибка', String(e)) }
  }

  if (loading) return <View style={[styles.container, styles.center]}><ActivityIndicator color={theme.colors.primary} /></View>

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Админ: Заявки на просмотр</Text>
      {requests.length === 0 ? (
        <View style={[styles.center, { flex: 1 }]}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Нет новых заявок</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => {
            const listing = mockListings.find(l => l.id === item.listingId)
            return (
              <View style={styles.card}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={styles.title}>{listing?.title ?? 'Квартира'}</Text>
                    <Text style={styles.text}>{listing?.location}</Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>

                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.action} onPress={() => changeStatus(item.id, 'invited')}>
                    <Text style={styles.actionText}>Пригласить</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => changeStatus(item.id, 'contract_signed')}>
                    <Text style={styles.actionText}>Договор</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.action} onPress={() => changeStatus(item.id, 'paid')}>
                    <Text style={styles.actionText}>Оплата</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          }}
          contentContainerStyle={{ padding: theme.spacing.md }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: theme.type.h2, fontWeight: '700', color: theme.colors.onSurface, padding: theme.spacing.md, paddingTop: theme.spacing.lg },
  card: { backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.radii.md, marginBottom: theme.spacing.sm, borderWidth: 1, borderColor: theme.colors.outline },
  title: { fontSize: theme.type.h3, fontWeight: '700', color: theme.colors.onSurface },
  text: { color: theme.colors.onSurfaceVariant },
  actionsRow: { flexDirection: 'row', marginTop: theme.spacing.sm },
  action: { marginRight: theme.spacing.sm, backgroundColor: theme.colors.surfaceVariant, padding: theme.spacing.sm, borderRadius: theme.radii.sm },
  actionText: { color: theme.colors.primary, fontWeight: '700' }
})
