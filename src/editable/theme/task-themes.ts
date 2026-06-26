import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Space Grotesk', 'Sora', system-ui, sans-serif"
const BODY_FONT = "'Plus Jakarta Sans', system-ui, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f5f7f2',
  surface: '#ffffff',
  raised: '#edf4ee',
  text: '#091413',
  muted: '#4e6860',
  line: 'rgba(40, 90, 72, 0.14)',
  accent: '#285a48',
  accentSoft: '#b0e4cc',
  onAccent: '#f8fffb',
  glow: 'rgba(64, 138, 113, 0.16)',
  radius: '1.75rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Guides', note: 'A cleaner reading lane for longer explainers, essays, and study notes.' },
  listing: { ...base, kicker: 'Directory', note: 'Helpful listings with quick comparison cues and easy next steps.' },
  classified: { ...base, kicker: 'Opportunities', note: 'Fast-moving posts designed to scan, compare, and act on quickly.' },
  image: { ...base, kicker: 'Gallery', note: 'Image-first discovery with stronger surfaces and broader visual rhythm.' },
  sbm: { ...base, kicker: 'Resources', note: 'Saved links and references arranged like curated tool shelves.' },
  pdf: { ...base, kicker: 'Library', note: 'Documents presented like a useful study archive, not a plain file dump.' },
  profile: { ...base, kicker: 'People', note: 'Profiles with identity, proof, and context up front.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': '#408a71',
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
