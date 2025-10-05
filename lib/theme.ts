export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
}

export const radii = {
  sm: 6,
  md: 12,
  lg: 16,
  round: 999,
}

export const type = {
  h1: 32,
  h2: 22,
  h3: 18,
  body: 16,
  small: 13,
}

export const colors = {
  primary: '#0066FF',
  primaryVariant: '#004ECC',
  onPrimary: '#FFFFFF',
  background: '#F6F7FB',
  surface: '#FFFFFF',
  surfaceVariant: '#F1F3F8',
  onSurface: '#0B1A2B',
  onSurfaceVariant: '#6B7380',
  outline: '#E6E9F0',
  success: '#16A34A',
  error: '#EF4444',
  transparent: 'transparent',
}

// small helper to build rgba strings from hex
function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const theme = {
  spacing,
  radii,
  type,
  colors,
  hexToRgba,
  shadow: ({ elevation = 2 } = {}) => ({
    shadowColor: '#000',
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.08,
    shadowRadius: elevation * 2,
    elevation,
  }),
}
