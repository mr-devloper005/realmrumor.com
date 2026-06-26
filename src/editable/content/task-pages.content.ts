import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Guides and reads',
    headline: 'Readable posts arranged like a smart editorial catalog.',
    description: 'Article pages should feel easy to browse, with stronger sectioning, better highlights, and useful search/filter cues.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Give longer content breathing room without making the archive feel slow.',
    chips: ['Editorial cards', 'Reading flow', 'Topic filters'],
  },
  classified: {
    eyebrow: 'Opportunities',
    headline: 'Quick-scan posts for offers, asks, and time-sensitive updates.',
    description: 'Classified pages should be fast, practical, and easy to compare at a glance.',
    filterLabel: 'Filter opportunity category',
    secondaryNote: 'Lead with price, availability, and clear next actions.',
    chips: ['Action ready', 'Fast scan', 'Quick compare'],
  },
  sbm: {
    eyebrow: 'Resource board',
    headline: 'Curated links presented like useful shelves of saved references.',
    description: 'Bookmark pages should feel organized, lightweight, and practical instead of generic.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Help visitors scan link value before opening the detail page.',
    chips: ['Useful links', 'Collections', 'Reference flow'],
  },
  profile: {
    eyebrow: 'Profiles',
    headline: 'Identity-first browsing with cleaner context and stronger trust cues.',
    description: 'Profile pages should make people and organizations feel easy to understand from the first screen.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Use portraits, role labels, and compact proof points up front.',
    chips: ['Identity first', 'Role labels', 'Context blocks'],
  },
  pdf: {
    eyebrow: 'Resource library',
    headline: 'Documents presented as a practical library for browsing and download.',
    description: 'PDF pages should make file content and access obvious without losing the visual polish of the rest of the site.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Balance browsing, previewing, and quick access.',
    chips: ['Downloadable', 'Useful archive', 'Study-ready'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Listings built for comparison, context, and easier contact.',
    description: 'Directory pages should feel structured and trustworthy, with strong scan patterns and useful metadata.',
    filterLabel: 'Filter listing category',
    secondaryNote: 'Make it easy to compare location, role, and website cues.',
    chips: ['Compare fast', 'Contact cues', 'Discovery friendly'],
  },
  image: {
    eyebrow: 'Visual stream',
    headline: 'Image posts with a stronger gallery rhythm and richer first impressions.',
    description: 'Image pages should feel portfolio-like, with masonry-inspired browsing and bold image surfaces.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let the imagery lead, then support it with short context blocks.',
    chips: ['Gallery first', 'Image-heavy', 'Mood-led'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
