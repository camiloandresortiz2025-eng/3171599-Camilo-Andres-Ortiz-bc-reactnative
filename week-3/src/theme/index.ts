// COMO: Define constantes de diseño centralizadas (colores, tipografía, espaciado)
// PARA: Mantener consistencia visual en toda la app desde un único punto de verdad
// IMPACTO: Cambiar un color aquí lo actualiza en todos los componentes que lo usan

export const COLORS = {
  primary: '#61DAFB',       // Requerido por la rúbrica — color activo del tab
  background: '#1A1A2E',
  surface: '#16213E',
  card: '#0F3460',
  text: '#EAEAEA',
  textSecondary: '#A0A0B0',
  accent: '#E94560',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  border: '#2A2A4A',
};

export const TYPOGRAPHY = {
  heading: { fontSize: 22, fontWeight: '700' as const, color: COLORS.text },
  subheading: { fontSize: 17, fontWeight: '600' as const, color: COLORS.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: COLORS.text },
  caption: { fontSize: 12, fontWeight: '400' as const, color: COLORS.textSecondary },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 20,
};
