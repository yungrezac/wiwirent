import React, { useState } from 'react'
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ListingCard from '../components/ListingCard'
import HeaderLogo from '../components/HeaderLogo'
import { mockListings } from '../data/mockListings'
import { theme } from '../lib/theme'
import { Ionicons } from '@expo/vector-icons'

export default function ListingsScreen() {
  const navigation = useNavigation()
  const [viewMode, setViewMode] = useState<'list'|'map'>('list')

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <HeaderLogo />

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={() => setViewMode(v => v === 'list' ? 'map' : 'list')} style={styles.iconBtn}>
            <Ionicons name={viewMode === 'list' ? 'map' : 'list'} size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => { /* TODO: open filters modal */ }}>
            <Ionicons name='filter' size={20} color={theme.colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchRow}>
        <TextInput placeholder="Поиск: район, метро, цена" placeholderTextColor={theme.colors.onSurfaceVariant} style={styles.searchInput} />
      </View>

      {viewMode === 'map' ? (
        <View style={styles.mapPlaceholder}>
          <Text style={{ color: theme.colors.onSurfaceVariant }}>Здесь будет карта (react-native-maps). Нажмите на метку, чтобы открыть карточку.</Text>
        </View>
      ) : (
        <FlatList
          data={mockListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              onPress={() => navigation.navigate('ListingDetail' as any, { id: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { padding: theme.spacing.md, paddingTop: theme.spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: theme.type.h2, color: theme.colors.onSurface, fontWeight: '700' },
  subtitle: { fontSize: theme.type.body, color: theme.colors.onSurfaceVariant, marginTop: 6 },
  actionsRow: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: theme.spacing.sm, backgroundColor: theme.colors.surface, padding: theme.spacing.xs, borderRadius: theme.radii.sm, borderWidth: 1, borderColor: theme.colors.outline },
  searchRow: { paddingHorizontal: theme.spacing.md, marginTop: theme.spacing.sm },
  searchInput: { backgroundColor: theme.colors.surface, padding: theme.spacing.sm, borderRadius: theme.radii.md, borderColor: theme.colors.outline, borderWidth: 1, color: theme.colors.onSurface },
  listContent: { padding: theme.spacing.md, paddingBottom: 60 },
  mapPlaceholder: { margin: theme.spacing.md, padding: theme.spacing.md, backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.outline }
})
