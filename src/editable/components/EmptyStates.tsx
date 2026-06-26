import Link from 'next/link'
import { ArrowRight, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

export function EmptyState({
  title = 'Nothing published here yet',
  description = 'Fresh posts will appear here automatically once this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section className={cn('rounded-[2rem] border border-[var(--editable-border)] bg-white p-8 text-center shadow-[0_18px_42px_rgba(9,20,19,0.06)]', className)}>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
        <SearchX className="h-7 w-7" />
      </div>
      <h2 className="editable-display mt-5 text-3xl font-bold tracking-[-0.04em]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)]">{description}</p>
      <Link href={actionHref} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--slot4-accent)]">
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} will appear here automatically when new content is available.`}
      actionLabel="Explore the homepage"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <EmptyState
      className={className}
      title="Message received"
      description="Thanks for reaching out. Your request has been saved successfully."
      actionLabel="Return home"
      actionHref="/"
    />
  )
}
