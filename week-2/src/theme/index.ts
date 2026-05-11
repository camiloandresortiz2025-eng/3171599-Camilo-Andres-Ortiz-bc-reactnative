export const COLORS = {
  background: '#0d1117',
  surface: '#161b22',
  surfaceAlt: '#21262d',

  border: '#30363d',
  borderLight: '#21262d',

  textPrimary: '#e6edf3',
  textSecondary: '#8b949e',
  textMuted: '#6e7681',

  // Dorado cálido — identidad visual Catering Elite
  accent: '#D4A017',
  accentDim: '#D4A01722',

  success: '#3fb950',
  warning: '#f0883e',
  error: '#f85149',
  info: '#58a6ff',
} as const;

export const TYPOGRAPHY = {
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 30,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  full: 9999,
} as const;
