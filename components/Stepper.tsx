import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { theme } from '../lib/theme'

export default function Stepper({ steps, currentIndex }: { steps: string[], currentIndex: number }){
  return (
    <View style={styles.container} accessible accessibilityRole="progressbar" accessibilityValue={{ now: currentIndex+1, min: 1, max: steps.length }}>
      {steps.map((label, i) => {
        const state = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'idle'
        return (
          <View key={label} style={styles.stepRow}>
            <View style={[styles.circle, state === 'active' && styles.activeCircle, state === 'done' && styles.doneCircle]}>
              <Text style={[styles.number, state === 'done' && styles.doneNumber]}>{i+1}</Text>
            </View>
            <Text style={[styles.label, state === 'active' && styles.activeLabel, state === 'done' && styles.doneLabel]} numberOfLines={2}>{label}</Text>
            {i < steps.length - 1 && <View style={styles.line} />}
          </View>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { padding: theme.spacing.md, flexDirection: 'column' },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  circle: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outline, alignItems: 'center', justifyContent: 'center', marginRight: theme.spacing.md },
  activeCircle: { borderColor: theme.colors.primary, backgroundColor: theme.hexToRgba(theme.colors.primary, 0.08) },
  doneCircle: { backgroundColor: theme.colors.success, borderColor: theme.colors.success },
  number: { color: theme.colors.onSurface, fontWeight: '700' },
  doneNumber: { color: '#fff' },
  label: { color: theme.colors.onSurfaceVariant, flex: 1 },
  activeLabel: { color: theme.colors.onSurface },
  doneLabel: { color: '#fff' },
  line: { height: 1, backgroundColor: theme.colors.outline, flex: 1, marginLeft: theme.spacing.md }
})
