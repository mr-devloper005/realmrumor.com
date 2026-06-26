'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'

type Comment = { id: string; name: string; comment: string; createdAt: string }

const storageKey = (slug: string) => `editable:article-comments:${slug}`

function timeAgo(value?: string) {
  if (!value) return ''
  const then = new Date(value).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.floor((Date.now() - then) / 60000))
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return new Date(then).toLocaleDateString()
}

function initial(name: string) {
  return (name.trim()[0] || 'G').toUpperCase()
}

export function EditableArticleComments({ slug, comments = [] }: { slug: string; comments?: Comment[] }) {
  const [stored, setStored] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey(slug))
      setStored(raw ? (JSON.parse(raw) as Comment[]) : [])
    } catch {
      setStored([])
    }
  }, [slug])

  const persist = (next: Comment[]) => {
    setStored(next)
    try {
      window.localStorage.setItem(storageKey(slug), JSON.stringify(next))
    } catch {
      /* storage unavailable */
    }
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = text.trim()
    if (!body) return
    const entry: Comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: name.trim() || 'Guest',
      comment: body,
      createdAt: new Date().toISOString(),
    }
    persist([entry, ...stored])
    setText('')
  }

  const all = useMemo(() => [...stored, ...comments], [stored, comments])

  return (
    <section className="mt-16 rounded-[2rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_18px_42px_rgba(9,20,19,0.06)] sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
            <MessageCircle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="editable-display text-2xl font-bold tracking-[-0.04em]">Comments</h2>
            <p className="text-sm text-[var(--tk-muted)]">{all.length} responses on this post</p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-3 rounded-[1.6rem] border border-[var(--tk-line)] bg-[var(--tk-bg)] p-4 sm:p-5">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="h-12 w-full rounded-2xl border border-[var(--tk-line)] bg-white px-4 text-sm outline-none transition focus:border-[var(--tk-accent)]"
        />
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          maxLength={1500}
          className="w-full resize-y rounded-2xl border border-[var(--tk-line)] bg-white px-4 py-3 text-sm leading-7 outline-none transition focus:border-[var(--tk-accent)]"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-bold text-[var(--tk-on-accent)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Post comment
          </button>
        </div>
      </form>

      <div className="mt-6 grid gap-4">
        {all.map((comment) => (
          <div key={comment.id} className="rounded-[1.5rem] border border-[var(--tk-line)] bg-[var(--tk-bg)] p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-sm font-bold text-[var(--tk-accent)]">
                {initial(comment.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--tk-text)]">{comment.name || 'Guest'}</p>
                {comment.createdAt ? <p className="text-xs text-[var(--tk-muted)]">{timeAgo(comment.createdAt)}</p> : null}
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--tk-text)]">{comment.comment}</p>
          </div>
        ))}
        {!all.length ? <p className="rounded-[1.5rem] border border-dashed border-[var(--tk-line)] bg-[var(--tk-bg)] px-5 py-6 text-sm text-[var(--tk-muted)]">Be the first to comment.</p> : null}
      </div>
    </section>
  )
}
