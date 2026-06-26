import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Smart discovery for modern students',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Discover visuals, people, and useful reads',
    primaryLinks: [
      { label: 'Explore', href: '/search' },
      { label: 'Profiles', href: '/profile' },
      { label: 'Images', href: '/image' },
      { label: 'About', href: '/about' },
    ],
    actions: {
      primary: { label: 'Start exploring', href: '/' },
      secondary: { label: 'Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Discovery built for curious students',
    description:
      'RealmRumor brings together image-led posts, profiles, reads, and useful resources in one clear discovery flow.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Images', href: '/image' },
          { label: 'Profiles', href: '/profile' },
          { label: 'Articles', href: '/article' },
          { label: 'Resources', href: '/pdf' },
        ],
      },
      {
        title: 'Around the site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Built for clean browsing, quick context, and mobile-friendly discovery.',
  },
  commonLabels: {
    readMore: 'Open post',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
