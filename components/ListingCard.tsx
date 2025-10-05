import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { theme } from '../lib/theme'

type Listing = {
  id: string
  title: string
  location: string
  price: number
  rooms: number
  size?: number
  image: string
}

export default function ListingCard({ listing, onPress }: { listing: Listing, onPress?: () => void }){
  return (
    <TouchableOpacity style={[styles.container, theme.shadow({ elevation: 2 })]} onPress={onPress} activeOpacity={0.88}>
      <Image source={{ uri: listing.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
        <Text style={styles.meta}>{listing.location} • {listing.rooms} комн.</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{listing.price} BYN</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: theme.radii.md, marginBottom: theme.spacing.sm, overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.outline },
  image: { width: 110, height: 90, backgroundColor: theme.colors.surfaceVariant },
  content: { flex: 1, padding: theme.spacing.sm, justifyContent: 'center' },
  title: { fontSize: theme.type.h3, fontWeight: '700', color: theme.colors.onSurface },
  meta: { color: theme.colors.onSurfaceVariant, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { color: theme.colors.primary, fontWeight: '800', fontSize: theme.type.body }
})
