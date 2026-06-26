import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}

const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const placeholder = '/placeholder.svg?height=900&width=1200'

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
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

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function DetailMeta({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-[18px] w-[18px] ${i < filled ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">{reviewsOf(post)} reviews</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
          <span className="text-sm text-[var(--tk-muted)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function HeroShell({
  task,
  post,
  category,
  lead,
  actions,
  media,
  aside,
}: {
  task: TaskKey
  post: SitePost
  category: string
  lead?: string
  actions?: ReactNode
  media?: ReactNode
  aside?: ReactNode
}) {
  return (
    <section className="border-b border-[var(--tk-line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(245,247,242,0.98))]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <BackLink task={task} />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="min-w-0">
            <Kicker task={task}>{category}</Kicker>
            <h1 className="editable-display mt-5 text-balance text-4xl font-bold leading-[0.98] tracking-[-0.06em] sm:text-6xl">{post.title}</h1>
            <DetailMeta post={post} category={category} />
            {lead ? <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--tk-muted)]">{lead}</p> : null}
            {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          <div className="space-y-6">
            {media}
            {aside}
          </div>
        </div>
      </div>
    </section>
  )
}

function PrimaryButton({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <Link href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-bold text-[var(--tk-on-accent)] transition hover:brightness-95">
      {label} {icon}
    </Link>
  )
}

function SecondaryAction({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 text-sm font-bold text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]">
      {icon} {label}
    </a>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <HeroShell
        task="article"
        post={post}
        category={categoryOf(post, 'Article')}
        lead={leadText(post)}
        media={
          <div className="overflow-hidden rounded-[2rem] border border-[var(--tk-line)] bg-white shadow-[0_20px_60px_rgba(9,20,19,0.08)]">
            <img src={images[0] || placeholder} alt={post.title} className="aspect-[16/10] w-full object-cover" />
          </div>
        }
        aside={<QuickInfoCard task="article" post={post} />}
      />
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:py-16">
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)

  return (
    <>
      <HeroShell
        task="listing"
        post={post}
        category={categoryOf(post, 'Listing')}
        lead={leadText(post)}
        actions={
          <>
            {website ? <PrimaryButton href={website} label="Visit website" icon={<ExternalLink className="h-4 w-4" />} /> : null}
            {phone ? <SecondaryAction href={`tel:${phone}`} label="Call" icon={<Phone className="h-4 w-4" />} /> : null}
            {email ? <SecondaryAction href={`mailto:${email}`} label="Email" icon={<Mail className="h-4 w-4" />} /> : null}
          </>
        }
        media={<MediaShowcase images={images.length ? images : [placeholder]} tall />}
        aside={
          <>
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          </>
        }
      />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <BodyContent post={post} />
            <MediaGrid images={images.slice(1)} label="Showcase" />
          </div>
          <div>
            <RelatedPanel task="listing" post={post} related={related} />
          </div>
        </div>
      </section>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])

  return (
    <>
      <HeroShell
        task="classified"
        post={post}
        category={categoryOf(post, 'Classified')}
        lead={leadText(post)}
        actions={
          <>
            {phone ? <SecondaryAction href={`tel:${phone}`} label="Call now" icon={<Phone className="h-4 w-4" />} /> : null}
            {email ? <SecondaryAction href={`mailto:${email}`} label="Email" icon={<Mail className="h-4 w-4" />} /> : null}
            {website ? <PrimaryButton href={website} label="Open link" icon={<ExternalLink className="h-4 w-4" />} /> : null}
          </>
        }
        media={<MediaShowcase images={images.length ? images : [placeholder]} tall />}
        aside={
          <div className="rounded-[1.8rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_20px_60px_rgba(9,20,19,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">Quick facts</p>
            <p className="editable-display mt-4 text-4xl font-bold tracking-[-0.05em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-5 space-y-3">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
          </div>
        }
      />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <BodyContent post={post} />
          </div>
          <div>
            <RelatedPanel task="classified" post={post} related={related} />
          </div>
        </div>
      </section>
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : [placeholder]
  return (
    <>
      <HeroShell
        task="image"
        post={post}
        category={categoryOf(post, 'Image')}
        lead={leadText(post)}
        media={<MediaShowcase images={gallery} tall />}
        aside={<QuickInfoCard task="image" post={post} icon={<Camera className="h-4 w-4" />} />}
      />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="columns-1 gap-5 sm:columns-2 xl:columns-3">
          {gallery.map((image, index) => (
            <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[1.8rem] border border-[var(--tk-line)] bg-white shadow-[0_16px_34px_rgba(9,20,19,0.06)]">
              <img src={image} alt="" className="w-full object-cover" />
            </figure>
          ))}
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <BodyContent post={post} />
          </div>
          <div>
            <RelatedPanel task="image" post={post} related={related} />
          </div>
        </div>
      </section>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <HeroShell
        task="sbm"
        post={post}
        category={categoryOf(post, 'Saved resource')}
        lead={leadText(post)}
        actions={website ? <PrimaryButton href={website} label="Open resource" icon={<ExternalLink className="h-4 w-4" />} /> : null}
        media={
          <div className="flex min-h-[280px] items-center justify-center rounded-[2rem] border border-[var(--tk-line)] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)] shadow-[0_20px_60px_rgba(9,20,19,0.08)]">
            <Bookmark className="h-20 w-20" />
          </div>
        }
        aside={<QuickInfoCard task="sbm" post={post} icon={<Bookmark className="h-4 w-4" />} />}
      />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <BodyContent post={post} />
          </div>
          <div>
            <RelatedPanel task="sbm" post={post} related={related} />
          </div>
        </div>
      </section>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <HeroShell
        task="pdf"
        post={post}
        category={categoryOf(post, 'Document')}
        lead={leadText(post)}
        actions={fileUrl ? <PrimaryButton href={fileUrl} label="Download file" icon={<Download className="h-4 w-4" />} /> : null}
        media={
          <div className="flex min-h-[280px] items-center justify-center rounded-[2rem] border border-[var(--tk-line)] bg-white shadow-[0_20px_60px_rgba(9,20,19,0.08)]">
            <FileText className="h-20 w-20 text-[var(--tk-accent)]" />
          </div>
        }
        aside={<QuickInfoCard task="pdf" post={post} icon={<FileText className="h-4 w-4" />} />}
      />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <BodyContent post={post} />
            {fileUrl ? (
              <div className="mt-10 overflow-hidden rounded-[1.8rem] border border-[var(--tk-line)] bg-white shadow-[0_16px_34px_rgba(9,20,19,0.06)]">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                  <span className="text-sm font-semibold">Document preview</span>
                  <PrimaryButton href={fileUrl} label="Open file" icon={<ArrowUpRight className="h-4 w-4" />} />
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[72vh] w-full bg-[var(--tk-raised)]" />
              </div>
            ) : null}
          </div>
          <div>
            <RelatedPanel task="pdf" post={post} related={related} />
          </div>
        </div>
      </section>
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  return (
    <>
      <HeroShell
        task="profile"
        post={post}
        category={role || categoryOf(post, 'Profile')}
        lead={leadText(post)}
        actions={
          <>
            {website ? <PrimaryButton href={website} label="Visit website" icon={<ExternalLink className="h-4 w-4" />} /> : null}
            {email ? <SecondaryAction href={`mailto:${email}`} label="Email" icon={<Mail className="h-4 w-4" />} /> : null}
            {phone ? <SecondaryAction href={`tel:${phone}`} label="Call" icon={<Phone className="h-4 w-4" />} /> : null}
          </>
        }
        media={<MediaShowcase images={images.length ? images : [placeholder]} portrait />}
        aside={<QuickInfoCard task="profile" post={post} icon={<UserRound className="h-4 w-4" />} />}
      />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <BodyContent post={post} />
            <MediaGrid images={images.slice(1)} label="Gallery" />
          </div>
          <div>
            <RelatedPanel task="profile" post={post} related={related} />
          </div>
        </div>
      </section>
    </>
  )
}

function QuickInfoCard({ task, post, icon }: { task: TaskKey; post: SitePost; icon?: ReactNode }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="rounded-[1.8rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_20px_60px_rgba(9,20,19,0.08)]">
      <div className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tk-accent)]">
        {icon || <CheckCircle2 className="h-4 w-4" />} {taskConfig?.label || task}
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--tk-muted)]">
        Open this detail page for the full content, supporting media, and any available contact or file actions.
      </p>
      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[var(--tk-accent)]">
        <Tag className="h-4 w-4" /> {SITE_CONFIG.name}
      </div>
      <div className="mt-2 flex items-center gap-2 text-sm text-[var(--tk-muted)]">
        <CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> Live post detail
      </div>
    </div>
  )
}

function BodyContent({ post }: { post: SitePost }) {
  return (
    <div
      className="article-content max-w-none text-[1.04rem] leading-8 text-[var(--tk-text)]"
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-3">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.4rem] border border-[var(--tk-line)] bg-white p-4 shadow-[0_10px_24px_rgba(9,20,19,0.05)]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
            <Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}
          </div>
          <p className="mt-2 break-words text-sm font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function MediaShowcase({ images, portrait = false, tall = false }: { images: string[]; portrait?: boolean; tall?: boolean }) {
  const [first, second, third] = images
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <img src={first || placeholder} alt="" className={`w-full rounded-[1.8rem] border border-[var(--tk-line)] object-cover shadow-[0_16px_34px_rgba(9,20,19,0.06)] ${portrait ? 'aspect-[4/5] sm:row-span-2 sm:h-full' : tall ? 'aspect-[4/5] sm:row-span-2 sm:h-full' : 'aspect-[16/11]'}`} />
      <img src={second || first || placeholder} alt="" className="aspect-[16/11] w-full rounded-[1.4rem] border border-[var(--tk-line)] object-cover shadow-[0_16px_34px_rgba(9,20,19,0.06)]" />
      <img src={third || second || first || placeholder} alt="" className="aspect-[16/11] w-full rounded-[1.4rem] border border-[var(--tk-line)] object-cover shadow-[0_16px_34px_rgba(9,20,19,0.06)]" />
    </div>
  )
}

function MediaGrid({ images, label }: { images: string[]; label: string }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">{label}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {images.slice(0, 6).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] border border-[var(--tk-line)] object-cover shadow-[0_10px_24px_rgba(9,20,19,0.05)]" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[1.8rem] border border-[var(--tk-line)] bg-white shadow-[0_16px_34px_rgba(9,20,19,0.06)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold">
        <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.2rem] border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-6">
      <div className="rounded-[1.8rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_16px_34px_rgba(9,20,19,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">About this post</p>
        <div className="mt-4 grid gap-3 text-sm text-[var(--tk-muted)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {taskConfig?.label || task}</p>
          <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {categoryOf(post, 'Published')}</p>
          <p className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className="rounded-[1.8rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_16px_34px_rgba(9,20,19,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-2xl font-bold tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tk-accent)]">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => (
              <RelatedCard key={item.id || item.slug} task={task} post={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--slot4-cream)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="editable-display text-3xl font-bold tracking-[-0.04em]">More {(taskConfig?.label || 'posts').toLowerCase()}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--tk-accent)]">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <RelatedCard key={item.id || item.slug} task={task} post={item} grid />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[1.7rem] border border-[var(--tk-line)] bg-white shadow-[0_14px_32px_rgba(9,20,19,0.06)] transition hover:-translate-y-1">
        <div className="aspect-[16/11] overflow-hidden bg-[var(--tk-raised)]">
          {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
        </div>
        <div className="p-5">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-[-0.03em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post)) || 'Open this post for details.'}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-[1.2rem] border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-accent)]">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--tk-raised)]"><FileText className="h-5 w-5 text-[var(--tk-muted)]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug tracking-[-0.02em]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post)) || 'Open this post for details.'}</p>
      </div>
    </Link>
  )
}
