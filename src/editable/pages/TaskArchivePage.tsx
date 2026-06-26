import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, Star, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const placeholder = '/placeholder.svg?height=900&width=1200'

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo) || asText(content.avatar)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.7 + (hashStr(post.slug || post.id || post.title || 'x') % 13) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function Stars({ post }: { post: SitePost }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i < filled ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">({reviewsOf(post)})</span>
    </div>
  )
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const [featured, ...rest] = posts

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="border-b border-[var(--tk-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(245,247,242,0.98))]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--tk-accent)]">
                  <span>{theme.kicker}</span>
                  <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
                  <span className="text-[var(--tk-muted)]">{voice.eyebrow}</span>
                </div>
                <h1 className="editable-display mt-5 max-w-4xl text-balance text-[2.8rem] font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl">
                  {voice.headline}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--tk-muted)]">{voice.description}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="rounded-full border border-[var(--tk-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--tk-muted)]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--tk-line)] bg-white p-5 shadow-[0_20px_60px_rgba(9,20,19,0.08)]">
                <p className="text-sm font-semibold text-[var(--tk-text)]">Refine this section</p>
                <form action={basePath} className="mt-4 space-y-3">
                  <label className="flex items-center overflow-hidden rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-bg)]">
                    <Search className="ml-4 h-4 w-4 text-[var(--tk-muted)]" />
                    <input
                      name="q"
                      type="search"
                      placeholder={`Search ${label.toLowerCase()}`}
                      className="h-12 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-[var(--tk-muted)]"
                    />
                  </label>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                      <select
                        name="category"
                        defaultValue={category}
                        className="h-12 w-full appearance-none rounded-2xl border border-[var(--tk-line)] bg-[var(--tk-bg)] pl-4 pr-10 text-sm font-medium outline-none"
                        aria-label={voice.filterLabel}
                      >
                        <option value="all">All categories</option>
                        {CATEGORY_OPTIONS.map((item) => (
                          <option key={item.slug} value={item.slug}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                    </div>
                    <button className="inline-flex h-12 items-center justify-center rounded-2xl bg-[var(--tk-dark-bg,var(--slot4-dark-bg))] px-5 text-sm font-bold text-white transition hover:bg-[var(--tk-accent)]">
                      Apply
                    </button>
                  </div>
                </form>
                <div className="mt-4 flex items-center justify-between text-sm text-[var(--tk-muted)]">
                  <span>
                    <span className="font-bold text-[var(--tk-text)]">{posts.length}</span> posts
                  </span>
                  <span>{categoryLabel}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
          {!posts.length ? (
            <div className="mx-auto max-w-xl rounded-[2rem] border border-dashed border-[var(--tk-line)] bg-white px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-3xl font-bold tracking-[-0.04em]">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--tk-muted)]">Try another category, or check back after new {label.toLowerCase()} are published.</p>
            </div>
          ) : (
            <>
              {featured ? <ArchiveFeaturedCard task={task} post={featured} href={`${basePath}/${featured.slug}` || buildPostUrl(task, featured.slug)} /> : null}

              <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="space-y-5">
                  {rest.slice(0, 4).map((post, index) => (
                    <ArchiveHorizontalCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} task={task} index={index} />
                  ))}
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  {rest.slice(4, 8).map((post, index) => (
                    <ArchiveCompactCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} task={task} index={index} />
                  ))}
                </div>
              </div>

              {rest.slice(8).length ? (
                <div className="mt-12">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <h2 className="editable-display text-3xl font-bold tracking-[-0.04em]">More to explore</h2>
                    <Link href={basePath} className="hidden items-center gap-2 text-sm font-bold text-[var(--tk-accent)] sm:inline-flex">
                      View all <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                  <div className={task === 'image' ? 'columns-1 gap-5 sm:columns-2 xl:columns-3' : 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3'}>
                    {rest.slice(8).map((post, index) => (
                      <ArchiveVarietyCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} task={task} index={index} />
                    ))}
                  </div>
                </div>
              ) : null}

              <nav className="mt-14 flex items-center justify-center gap-3 text-sm">
                {pagination.hasPrevPage ? (
                  <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 font-semibold transition hover:border-[var(--tk-accent)]">
                    Previous
                  </Link>
                ) : null}
                <span className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 font-semibold text-[var(--tk-muted)]">
                  Page {page} of {pagination.totalPages || 1}
                </span>
                {pagination.hasNextPage ? (
                  <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 font-semibold transition hover:border-[var(--tk-accent)]">
                    Next
                  </Link>
                ) : null}
              </nav>
            </>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchiveFeaturedCard({ task, post, href }: { task: TaskKey; post: SitePost; href: string }) {
  const title = getCategory(post, getTaskConfig(task)?.label || task)
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[2rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_24px_70px_rgba(9,20,19,0.1)] lg:grid-cols-[1fr_1fr]">
      <div className="relative min-h-[320px]">
        <img src={getImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--tk-accent)]">{title}</p>
        <h2 className="editable-display mt-4 text-4xl font-bold leading-[1] tracking-[-0.06em] sm:text-[3.5rem]">{post.title}</h2>
        <Stars post={post} />
        <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--tk-muted)]">{getSummary(post) || 'Open this post to view more details.'}</p>
        <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[var(--tk-accent)]">
          Open featured post <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function ArchiveHorizontalCard({ post, href, task, index }: { post: SitePost; href: string; task: TaskKey; index: number }) {
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return (
    <Link href={href} className="group grid gap-4 overflow-hidden rounded-[1.7rem] border border-[var(--tk-line)] bg-white p-4 shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1 sm:grid-cols-[220px_minmax(0,1fr)]">
      <img src={getImage(post)} alt={post.title} className="aspect-[4/3] w-full rounded-[1.2rem] object-cover" />
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">
          {getCategory(post, 'Post')} · {String(index + 1).padStart(2, '0')}
        </p>
        <h3 className="mt-2 line-clamp-2 text-2xl font-bold leading-tight tracking-[-0.04em] text-[var(--tk-text)]">{post.title}</h3>
        <Stars post={post} />
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post) || 'Open this post for more details.'}</p>
      </div>
    </Link>
  )
}

function ArchiveCompactCard({ post, href, task, index }: { post: SitePost; href: string; task: TaskKey; index: number }) {
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.6rem] border border-[var(--tk-line)] bg-white shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <img src={getImage(post)} alt={post.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">{getCategory(post, 'Post')}</p>
        <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.03em] text-[var(--tk-text)]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post) || 'Open this post for more details.'}</p>
      </div>
    </Link>
  )
}

function ArchiveVarietyCard({ post, href, task, index }: { post: SitePost; href: string; task: TaskKey; index: number }) {
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (index % 3 === 0) return <EditorialArchiveCard post={post} href={href} index={index} />
  return <ArchiveCompactCard post={post} href={href} task={task} index={index} />
}

function EditorialArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">
        Editorial pick · {String(index + 1).padStart(2, '0')}
      </p>
      <h3 className="mt-3 line-clamp-3 text-2xl font-bold leading-tight tracking-[-0.04em] text-[var(--tk-text)]">{post.title}</h3>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post) || 'Open this post for more details.'}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--tk-accent)]">
        Read more <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group flex items-center gap-5 rounded-[1.7rem] border border-[var(--tk-line)] bg-white p-5 shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.2rem] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-8 w-8 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">Directory pick</p>
        <h3 className="mt-2 truncate text-xl font-bold tracking-[-0.03em] text-[var(--tk-text)]">{post.title}</h3>
        <Stars post={post} />
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium text-[var(--tk-muted)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group flex h-full flex-col rounded-[1.7rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-3xl font-bold tracking-[-0.04em] text-[var(--tk-accent)]">{price || 'Open offer'}</span>
        {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">{condition}</span> : null}
      </div>
      <h3 className="mt-5 text-xl font-bold leading-snug tracking-[-0.03em]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post) || 'Open this post for more details.'}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span>{location || 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)]" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[1.75rem] border border-[var(--tk-line)] bg-white shadow-[0_18px_40px_rgba(9,20,19,0.08)] transition hover:-translate-y-1">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={getImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(9,20,19,0.78))]" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">{getCategory(post, 'Image')}</p>
          <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.03em]">{post.title}</h3>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group flex h-full gap-4 rounded-[1.7rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">Saved · {String(index + 1).padStart(2, '0')}</span>
        <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--tk-muted)]">{getSummary(post) || 'Open this post for more details.'}</p>
        {website ? <p className="mt-3 truncate text-xs font-semibold text-[var(--tk-accent)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group flex h-full flex-col rounded-[1.7rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <FileText className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
          {getCategory(post, 'Document')}
        </span>
      </div>
      <h3 className="mt-6 text-xl font-bold leading-snug tracking-[-0.03em]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post) || 'Open this post for more details.'}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--tk-accent)]">
        Open document <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group flex items-center gap-5 rounded-[1.7rem] border border-[var(--tk-line)] bg-white p-5 shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-9 w-9 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">Profile spotlight</p>
        <h3 className="mt-2 text-xl font-bold tracking-[-0.03em]">{post.title}</h3>
        {role ? <p className="mt-2 text-sm font-medium text-[var(--tk-muted)]">{role}</p> : null}
        <Stars post={post} />
      </div>
    </Link>
  )
}
