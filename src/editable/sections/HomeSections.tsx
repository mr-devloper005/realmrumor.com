import Link from 'next/link'
import { ArrowRight, Bookmark, Building2, Camera, ChevronRight, FileText, Globe, Image as ImageIcon, Search, Sparkles, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, getEditableExcerpt, getEditableCategory, postHref } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Sparkles,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: FileText,
  profile: UserRound,
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function latestPostImages(posts: SitePost[], max = 10) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const image = getEditablePostImage(post)
    if (!image || image.includes('placeholder') || seen.has(image)) continue
    seen.add(image)
    out.push(image)
    if (out.length >= max) break
  }
  return out
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Discover the best of ${SITE_CONFIG.name}`

  return (
    <section className="relative overflow-hidden border-b border-[var(--editable-border)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(176,228,204,0.45),transparent_36%)]" />
      <div className="relative">
        <div className="relative h-[540px] overflow-hidden lg:h-[680px]">
          <EditableHeroCollage images={heroImages} />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,20,19,0.92)_0%,rgba(9,20,19,0.68)_42%,rgba(9,20,19,0.34)_100%)]" />
          <div className={`relative flex h-full items-center ${container}`}>
            <div className="max-w-3xl pt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-soft)]">{pagesContent.home.hero.badge}</p>
              <h1 className="editable-display mt-5 text-balance text-5xl font-bold leading-[0.98] tracking-[-0.07em] text-white sm:text-6xl lg:text-[5.4rem]">
                {heroTitle}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">{pagesContent.home.hero.description}</p>

              <form action="/search" className="mt-8 flex w-full max-w-[46rem] overflow-hidden rounded-2xl border border-white/14 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.26)]">
                <div className="flex min-w-0 flex-1 items-center gap-3 px-5">
                  <Search className="h-5 w-5 shrink-0 text-[var(--slot4-soft-muted-text)]" />
                  <input
                    name="q"
                    placeholder={pagesContent.home.hero.searchPlaceholder}
                    className="h-14 w-full min-w-0 bg-transparent text-sm font-medium text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </div>
                <button className="shrink-0 bg-[var(--slot4-dark-bg)] px-6 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent)] sm:px-8">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="bg-[var(--slot4-dark-bg)]/96 text-white">
          <div className={`flex flex-wrap items-center gap-x-8 gap-y-3 py-4 text-sm ${container}`}>
            <span className="font-semibold text-white/92">Trusted by student teams:</span>
            {['Media clubs', 'Portfolio builders', 'Study circles', 'Campus orgs', 'Creators'].map((label) => (
              <span key={label} className="text-white/76">{label}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="hidden">
        <Link href={primaryRoute}>Browse {taskLabel(primaryTask)}</Link>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 8)
  if (!pool.length) return null

  return (
    <section className="bg-[var(--slot4-cream)] py-16 sm:py-20">
      <div className={container}>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="editable-display text-4xl font-bold tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-[3.6rem]">
              Popular discoveries
            </h2>
            <p className="mt-3 max-w-2xl text-lg text-[var(--slot4-muted-text)]">
              A rotating set of image-led posts and standout profiles pulled from the live feed.
            </p>
          </div>
          <Link href={primaryRoute} className="hidden items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent)] sm:inline-flex">
            Explore all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 flex gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {pool.map((post, index) => (
            <Link
              key={post.id || post.slug || post.title}
              href={postHref(primaryTask, post, primaryRoute)}
              className="group w-[270px] shrink-0 overflow-hidden rounded-[1.6rem] border border-[var(--editable-border)] bg-[var(--slot4-accent)] text-white shadow-[0_18px_40px_rgba(9,20,19,0.14)] transition hover:-translate-y-1"
            >
              <div className="p-4">
                <p className="text-sm font-bold">{getEditableCategory(post)}</p>
              </div>
              <div className="mx-3 mb-3 overflow-hidden rounded-[1.2rem] bg-white/16">
                <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.05]" />
              </div>
              <div className="px-4 pb-5">
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Spotlight {String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 line-clamp-2 text-2xl font-bold leading-tight tracking-[-0.04em]">{post.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedStoryCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] text-white shadow-[0_28px_70px_rgba(9,20,19,0.22)] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="p-7 sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent-soft)]">Featured story</p>
        <h3 className="editable-display mt-4 text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-[3.8rem]">{post.title}</h3>
        <p className="mt-5 max-w-xl text-base leading-8 text-white/76">{getEditableExcerpt(post, 220)}</p>
        <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[var(--slot4-page-text)]">
          Open feature <ArrowRight className="h-4 w-4" />
        </span>
      </div>
      <div className="relative min-h-[320px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,20,19,0.08),rgba(9,20,19,0.32))]" />
      </div>
    </Link>
  )
}

function HorizontalStoryCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid gap-4 overflow-hidden rounded-[1.6rem] border border-[var(--editable-border)] bg-white p-4 shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1 sm:grid-cols-[180px_minmax(0,1fr)]">
      <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] w-full rounded-[1.2rem] object-cover" />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-bold leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}

function CompactTile({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group rounded-[1.45rem] border border-[var(--editable-border)] bg-white p-5 shadow-[0_12px_24px_rgba(9,20,19,0.05)] transition hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <span className="text-xs font-bold text-[var(--slot4-soft-muted-text)]">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 84)}</p>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 7)
  if (!activity.length) return null

  const [featured, ...rest] = activity

  return (
    <section className="py-16 sm:py-20">
      <div className={container}>
        <div className="grid gap-7 lg:grid-cols-[1.12fr_0.88fr]">
          <FeaturedStoryCard post={featured} href={postHref(primaryTask, featured, primaryRoute)} />

          <div className="grid gap-5">
            {rest.slice(0, 3).map((post) => (
              <HorizontalStoryCard key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.slice(3, 7).map((post, index) => (
            <CompactTile key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function EditorialRow({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid gap-5 border-b border-[var(--editable-border)] py-6 sm:grid-cols-[auto_minmax(0,1fr)_220px] sm:items-center">
      <span className="editable-display text-2xl font-bold tracking-[-0.05em] text-[var(--slot4-soft-muted-text)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-bold leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 150)}</p>
      </div>
      <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/3] w-full rounded-[1.2rem] object-cover" />
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.75rem] border border-[var(--editable-border)] bg-white shadow-[0_16px_34px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <img src={getEditablePostImage(post)} alt={post.title} className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.03em] text-[var(--slot4-page-text)]">{post.title}</h3>
      </div>
    </Link>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'New this week', title: 'What students are opening now' },
  browse: { eyebrow: 'Popular this month', title: 'Fresh picks across the site' },
  index: { eyebrow: 'Keep exploring', title: 'More posts worth your time' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, sectionIndex) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const items = section.posts.slice(0, 8)
        return (
          <section key={section.key} className={sectionIndex % 2 === 0 ? 'bg-transparent' : 'bg-[var(--slot4-cream)]'}>
            <div className={`py-16 sm:py-20 ${container}`}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{copy.eyebrow}</p>
                  <h2 className="editable-display mt-3 text-4xl font-bold tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-[3.2rem]">
                    {copy.title}
                  </h2>
                </div>
                <Link href={section.href || primaryRoute} className="hidden items-center gap-2 text-sm font-bold text-[var(--slot4-accent)] sm:inline-flex">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  {items.slice(0, 3).map((post, index) => (
                    <EditorialRow key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                  ))}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {items.slice(3, 7).map((post) => (
                    <ImageFirstCard key={post.id || post.slug || post.title} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="py-16 sm:py-20">
      <div className={container}>
        <div className="overflow-hidden rounded-[2.2rem] bg-[linear-gradient(135deg,#5b1f33_0%,#4a1529_32%,#611b31_100%)] px-6 py-12 text-center text-white shadow-[0_28px_64px_rgba(74,21,41,0.24)] sm:px-10 sm:py-16">
          <h2 className="editable-display text-balance text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-[4rem]">
            Discovery at your fingertips
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-white/76">
            Browse profiles, visuals, and useful resources with a layout built to feel fast, modern, and easy to keep exploring.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[var(--slot4-page-text)] transition hover:-translate-y-0.5">
              Join now
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/24 px-7 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              Contact
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-white/68">
            <span className="inline-flex items-center gap-2"><Camera className="h-4 w-4" /> Image-first posts</span>
            <span className="inline-flex items-center gap-2"><UserRound className="h-4 w-4" /> Profile details</span>
            <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4" /> Search across sections</span>
          </div>
        </div>
      </div>
    </section>
  )
}
