/**
 * Design tokens extracted from the "1a Editorial" direction of the Claude
 * Design handoff (project/Fitness Dashboard Options.dc.html). Every screen
 * in the app should style itself from this file rather than hardcoding hex
 * values, so the whole product reads as one system.
 */

export const colors = {
  // screen / card surfaces (light mode — the app's primary mode)
  canvas: '#ecebe7',
  screen: '#faf9f6',
  cardMuted: '#f1efe8',
  cardMutedAlt: '#efede6',
  cardFlat: '#e4e1d8',

  // dark surfaces (hero cards, workout-live, race day, watch)
  ink: '#1c1c1a',
  inkRaised: '#1a1a18',
  inkDeep: '#161614',
  inkBlack: '#101010',

  // brand / semantic
  primary: '#2f6f4f', // buttons, progress, CTAs
  accent: '#2f9e64', // success / "on track" accents, brighter than primary
  warning: '#d4763f',
  danger: '#b0483a',
  info: '#3a5fa8',

  // text — light surfaces
  textPrimary: '#1c1c1a',
  textSecondary: '#6d6b63',
  textMuted: '#9a978c',
  textMutedAlt: '#8a887f',

  // text — dark surfaces
  textOnDark: '#faf9f6',
  textOnDarkSecondary: '#b0ad9f',
  textOnDarkMuted: '#8a887f',

  // borders / tracks — light surfaces
  border: '#e8e5da',
  borderStrong: '#1c1c1a',
  track: '#dfdcd1',
  trackAlt: '#d8d5ca',
  trackStrong: '#d5d2c6',
  divider: '#e0dccf',

  // borders / tracks — dark surfaces (workout live, race day)
  trackOnDark: '#2a2a27',

  white: '#faf9f6',
} as const;

/** Common rgba(250,249,246, a) overlays used on dark surfaces throughout the design. */
export const onDark = (alpha: number) => `rgba(250,249,246,${alpha})`;

export const spacing = {
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radii = {
  sm: 9,
  md: 14,
  lg: 20,
  xl: 24,
  pill: 999,
} as const;

export const fontFamily = {
  serif: 'Newsreader_500Medium',
  serifRegular: 'Newsreader_400Regular',
  serifSemibold: 'Newsreader_600SemiBold',
  mono: 'IBMPlexMono_500Medium',
  monoRegular: 'IBMPlexMono_400Regular',
  monoSemibold: 'IBMPlexMono_600SemiBold',
  sans: 'Manrope_400Regular',
  sansMedium: 'Manrope_500Medium',
  sansSemibold: 'Manrope_600SemiBold',
  sansBold: 'Manrope_700Bold',
  sansExtrabold: 'Manrope_800ExtraBold',
} as const;

/** Uppercase, letter-spaced mono label style shared by nearly every screen. */
export const monoLabel = {
  fontFamily: fontFamily.mono,
  letterSpacing: 1.2,
  textTransform: 'uppercase' as const,
};

export const shadow = {
  card: {
    shadowColor: '#1c1c1a',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  raised: {
    shadowColor: '#1c1c1a',
    shadowOpacity: 0.18,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
};
