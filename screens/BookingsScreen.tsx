import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../lib/theme'

export default function BookingsScreen(){
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Бронирования</Text>
        <Text style={styles.subtitle}>Здесь будут ваши оплаченные брони</Text>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Пока нет бронирований</Text>
        <Text style={styles.emptyText}>Найдите квартиру и оплатите её прямо в приложении.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: theme.spacing.md, paddingTop: theme.spacing.lg },
  title: { fontSize: theme.type.h2, color: theme.colors.onSurface, fontWeight: '700' },
  subtitle: { fontSize: theme.type.body, color: theme.colors.onSurfaceVariant, marginTop: 6 },
  emptyState: { marginTop: theme.spacing.lg, alignItems: 'center' },
  emptyTitle: { fontSize: theme.type.h3, color: theme.colors.onSurface },
  emptyText: { color: theme.colors.onSurfaceVariant, marginTop: 8 }
})
