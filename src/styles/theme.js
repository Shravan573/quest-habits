export const COLORS = {
  bgDarkest: '#0a0a1a',
  bgDark: '#1a1a2e',
  bgMedium: '#16213e',
  bgLight: '#0f3460',

  neonGreen: '#39ff14',
  neonCyan: '#00ffcc',
  neonPink: '#ff00ff',
  neonBlue: '#00bfff',

  fireOrange: '#ff6600',
  fireRed: '#ff4444',
  bloodRed: '#8b0000',
  gold: '#ffd700',

  white: '#ffffff',
  textPrimary: '#e0e0e0',
  textSecondary: '#888888',
  textMuted: '#555555',
  border: '#333366',
  borderLight: '#4a4a8a',

  barEmpty: '#222222',
  barBorder: '#111111',
};

export const FONTS = {
  pixel: '"Press Start 2P", cursive',
};

export const SIZES = {
  fontXs: 8,
  fontSm: 10,
  fontMd: 12,
  fontLg: 16,
  fontXl: 20,
  fontTitle: 24,
  spacing: 8,
  borderWidth: 3,
};

export const PIXEL_BORDER = {
  border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
  boxShadow: `inset -${SIZES.borderWidth}px -${SIZES.borderWidth}px 0 0 ${COLORS.bgDarkest}, inset ${SIZES.borderWidth}px ${SIZES.borderWidth}px 0 0 ${COLORS.borderLight}`,
};

export const CARD_STYLE = {
  backgroundColor: COLORS.bgDark,
  padding: SIZES.spacing * 2,
  ...PIXEL_BORDER,
};

export const BUTTON_BASE = {
  fontFamily: FONTS.pixel,
  fontSize: SIZES.fontSm,
  padding: `${SIZES.spacing}px ${SIZES.spacing * 2}px`,
  backgroundColor: COLORS.bgMedium,
  color: COLORS.neonGreen,
  cursor: 'pointer',
  border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
  boxShadow: `inset -${SIZES.borderWidth}px -${SIZES.borderWidth}px 0 0 ${COLORS.bgDarkest}, inset ${SIZES.borderWidth}px ${SIZES.borderWidth}px 0 0 ${COLORS.borderLight}`,
  transition: 'background-color 0.1s',
};

export const INPUT_BASE = {
  fontFamily: FONTS.pixel,
  fontSize: SIZES.fontSm,
  padding: `${SIZES.spacing}px ${SIZES.spacing * 1.5}px`,
  backgroundColor: COLORS.bgDarkest,
  color: COLORS.textPrimary,
  border: `${SIZES.borderWidth}px solid ${COLORS.border}`,
  boxShadow: `inset ${SIZES.borderWidth}px ${SIZES.borderWidth}px 0 0 ${COLORS.bgDarkest}`,
  outline: 'none',
  width: '100%',
};
