// Design tokens shared across the app — mirrors the palette used in the
// business blueprint (iron/chalk neutrals, rust accent, plate-green for
// positive/AI states) so the product and the pitch deck look related.
export const colors = {
  bg: '#17140F',
  surface: '#211D17',
  surfaceAlt: '#2A2418',
  border: '#3B3527',
  ink: '#F1ECE0',
  inkMuted: '#B5AC98',
  accent: '#E2794F',
  accentInk: '#1A1108',
  good: '#5FB49A',
  gold: '#D9B85B',
  danger: '#D9614F',
};

export const spacing = (n: number) => n * 4;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: colors.ink },
  h2: { fontSize: 20, fontWeight: '700' as const, color: colors.ink },
  h3: { fontSize: 15, fontWeight: '600' as const, color: colors.ink },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.ink, lineHeight: 21 },
  muted: { fontSize: 13, fontWeight: '400' as const, color: colors.inkMuted },
  mono: { fontSize: 15, fontWeight: '600' as const, color: colors.ink },
};
