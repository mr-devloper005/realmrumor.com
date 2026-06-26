import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f5f7f2',
  '--slot4-page-text': '#091413',
  '--slot4-panel-bg': '#eef5ef',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#4e6860',
  '--slot4-soft-muted-text': '#70877f',
  '--slot4-accent': '#285a48',
  '--slot4-accent-fill': '#408a71',
  '--slot4-accent-soft': '#b0e4cc',
  '--slot4-on-accent': '#f8fffb',
  '--slot4-dark-bg': '#091413',
  '--slot4-dark-text': '#f7fff9',
  '--slot4-media-bg': '#dfe9e3',
  '--slot4-cream': '#f8fbf7',
  '--slot4-warm': '#edf3ee',
  '--slot4-lavender': '#eef6f1',
  '--slot4-gray': '#e5ede8',
  '--slot4-body-gradient':
    'radial-gradient(circle at top, rgba(176,228,204,0.45), transparent 28%), linear-gradient(180deg, #f8fbf7 0%, #f3f7f4 42%, #eef4f0 100%)',
  '--editable-page-bg': '#f5f7f2',
  '--editable-page-text': '#091413',
  '--editable-container': '1480px',
  '--editable-border': 'rgba(40, 90, 72, 0.14)',
  '--editable-nav-bg': 'rgba(248, 251, 247, 0.96)',
  '--editable-nav-text': '#091413',
  '--editable-nav-active': '#285a48',
  '--editable-nav-active-text': '#f8fffb',
  '--editable-cta-bg': '#091413',
  '--editable-cta-text': '#f7fff9',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#091413',
  '--editable-footer-text': '#effaf3',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_14px_42px_rgba(9,20,19,0.08)]',
  shadowStrong: 'shadow-[0_24px_70px_rgba(9,20,19,0.22)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(9,20,19,0.04),rgba(9,20,19,0.76))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[220px] shrink-0 snap-start sm:w-[250px]',
  },
  type: {
    eyebrow: 'text-xs font-semibold uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    heroTitle: 'text-4xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-[4.4rem]',
    sectionTitle: 'text-3xl font-semibold tracking-[-0.03em] sm:text-4xl lg:text-[3.2rem]',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[1.75rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[1.75rem] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-bold tracking-[0.01em] text-[var(--slot4-on-accent)] transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent)] active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 text-sm font-bold tracking-[0.01em] text-[var(--slot4-page-text)] transition duration-200 hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)] active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-bold text-[var(--slot4-on-accent)] transition duration-200 hover:-translate-y-0.5 hover:brightness-95 active:scale-[0.98]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.5rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_42px_rgba(9,20,19,0.14)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Keep the marketplace-style green palette in editableRootStyle so all editable surfaces stay visually unified.',
  'Preserve dynamic data sources; redesign structure and copy, not the post plumbing.',
  'Use at least one featured card, one compact tile, one horizontal list card, one editorial row, and one image-first card.',
  'Favor rounded surfaces, strong spacing, and broad readable sections over cramped dashboards.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
