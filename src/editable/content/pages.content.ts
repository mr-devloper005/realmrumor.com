import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Visual discovery, profiles, and useful reads',
      description: 'Explore images, profiles, guides, and curated posts in a bold discovery layout built for students.',
      openGraphTitle: 'Visual discovery, profiles, and useful reads',
      openGraphDescription: 'Browse image-led stories, profiles, and practical resources through a polished discovery experience.',
      keywords: ['student discovery', 'profiles', 'image posts', 'guides', 'resources'],
    },
    hero: {
      badge: 'Student-ready discovery',
      title: ['Find standout visuals, profiles,', 'and useful resources in one place.'],
      description:
        'Search across image posts, creator profiles, articles, and study-friendly resources with a cleaner, more confident browsing experience.',
      primaryCta: { label: 'Explore images', href: '/image' },
      secondaryCta: { label: 'Browse profiles', href: '/profile' },
      searchPlaceholder: 'Search by topic, name, visual idea, or category',
      focusLabel: 'Focus',
      featureCardBadge: 'featured stream',
      featureCardTitle: 'Fresh posts keep the front page moving with visuals first.',
      featureCardDescription: 'Recent images and profile-led posts shape the tone of the homepage while preserving the live feed.',
    },
    intro: {
      badge: 'What you can do here',
      title: 'Move from broad discovery to specific details without losing context.',
      paragraphs: [
        'The site brings image-led inspiration, profile browsing, and readable supporting content into one flow so visitors can keep exploring naturally.',
        'Instead of forcing every section into the same layout, each content type gets its own rhythm while the overall system stays consistent.',
        'That makes it easier to scan quickly on mobile, compare options on desktop, and keep discovering related material along the way.',
      ],
      sideBadge: 'Why it works',
      sidePoints: [
        'Search-first browsing for fast discovery.',
        'Image-led sections for stronger first impressions.',
        'Profile and detail pages with more context and proof.',
        'Flexible cards that make each section feel distinct.',
      ],
      primaryLink: { label: 'Browse images', href: '/image' },
      secondaryLink: { label: 'See profiles', href: '/profile' },
    },
    cta: {
      badge: 'Keep exploring',
      title: 'Jump into profiles, visuals, and practical reads without friction.',
      description: 'Follow the sections that matter to you and open individual posts for full details, media, and contact-friendly actions.',
      primaryCta: { label: 'View Profiles', href: '/profile' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About the platform',
    title: 'A clearer way to discover visuals, people, and ideas.',
    description: `${slot4BrandConfig.siteName} is designed to make discovery feel easier, more visual, and more useful for everyday browsing.`,
    paragraphs: [
      'The experience combines image-first sections, readable supporting content, and profile-driven pages so different kinds of posts can still feel connected.',
      'Whether someone starts from a search, a gallery, or a profile, the structure helps them continue exploring without confusion.',
    ],
    values: [
      {
        title: 'Visual clarity',
        description: 'Images, typography, and spacing are used to help people understand content quickly.',
      },
      {
        title: 'Flexible discovery',
        description: 'Different post types can look different while still feeling part of the same site.',
      },
      {
        title: 'Useful navigation',
        description: 'Search, category chips, and related content make it easier to keep moving forward.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Share a question, idea, or request.',
    description: 'Use the contact page for general inquiries, submissions, or feedback. The layout keeps things simple and direct.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search everything',
      title: 'Find visuals, people, guides, and resources faster.',
      description: 'Use keywords and categories to discover posts across every active section of the site.',
      placeholder: 'Search by keyword, category, name, or topic',
    },
    resultsTitle: 'Recent searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your workspace.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
