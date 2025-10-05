import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';

export default function HeaderLogo() {
  // use the shared theme directly
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}
          accessibilityRole="header">
      <Image
        source={{ uri: 'https://i.postimg.cc/xjN20hRD/image.png' }}
        style={styles.icon}
        resizeMode="contain"
        accessibilityLabel="wiwi rent logo"
      />
      <Text style={styles.text}>
        <Text style={{ color: theme.colors.primary }}>wiwi </Text>
        <Text style={{ color: '#000' }}>rent</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  icon: {
    width: 36,
    height: 36,
    marginRight: 10,
    borderRadius: 6,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
