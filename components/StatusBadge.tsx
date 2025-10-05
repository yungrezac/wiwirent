import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../lib/theme'

export default function StatusBadge({ status }: { status: string }){
  const map: Record<string, { label: string, color: string, bg: string }> = {
    requested: { label: 'Заявка', color: theme.colors.onSurface, bg: theme.colors.surface },
    invited: { label: 'Приглашён', color: theme.colors.primary, bg: theme.hexToRgba(theme.colors.primary, 0.08) },
    contract_signed: { label: 'Договор подписан', color: theme.colors.success, bg: theme.hexToRgba(theme.colors.success, 0.08) },
    paid: { label: 'Оплачен', color: theme.colors.success, bg: theme.hexToRgba(theme.colors.success, 0.08) },
    active: { label: 'Активен', color: theme.colors.onPrimary, bg: theme.colors.success }
  }
  const m = map[status] || { label: status, color: theme.colors.onSurface, bg: theme.colors.surface }
  return (
    <View style={[styles.container, { backgroundColor: m.bg }]} accessibilityLabel={`status-${status}`}>
      <Text style={[styles.text, { color: m.color }]}>{m.label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: theme.radii.round, alignSelf: 'flex-start' },
  text: { fontSize: theme.type.small, fontWeight: '600' }
})
