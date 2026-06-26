import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[1.4rem] bg-[var(--slot4-accent-soft)]/45', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8', className)} aria-live="polite" aria-busy="true">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">{label}</p>
      <PulseBlock className="mt-5 h-14 w-3/4 max-w-4xl" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl" />
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <PulseBlock className="h-[360px] w-full rounded-[2rem]" />
        <div className="grid gap-4">
          <PulseBlock className="h-40 w-full" />
          <PulseBlock className="h-40 w-full" />
        </div>
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-[1.75rem] border border-[var(--editable-border)] bg-white p-4 shadow-[0_12px_28px_rgba(9,20,19,0.05)]">
          <PulseBlock className="h-44 w-full" />
          <PulseBlock className="mt-4 h-5 w-5/6" />
          <PulseBlock className="mt-3 h-4 w-2/3" />
          <PulseBlock className="mt-6 h-10 w-32 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div className={cn('mx-auto grid w-full max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8', className)} aria-live="polite" aria-busy="true">
      <PulseBlock className="h-[420px] w-full rounded-[2rem]" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--slot4-soft-muted-text)]">{label}</p>
        <PulseBlock className="mt-5 h-14 w-4/5" />
        <PulseBlock className="mt-5 h-4 w-full" />
        <PulseBlock className="mt-3 h-4 w-5/6" />
        <PulseBlock className="mt-3 h-4 w-2/3" />
        <PulseBlock className="mt-8 h-12 w-44 rounded-full" />
      </div>
    </div>
  )
}
