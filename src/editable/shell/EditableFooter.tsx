'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(64,138,113,0.2),rgba(9,20,19,0.95))] p-8 sm:p-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/12 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.16)]">
                  <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
                </span>
                <span className="editable-display text-[2.2rem] font-extrabold tracking-[-0.08em] text-white">
                  {SITE_CONFIG.name.replace(/\.[^.]+$/, '')}
                  <span className="text-[var(--slot4-accent-soft)]">.</span>
                </span>
              </Link>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/72">{globalContent.footer.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Images', 'Profiles', 'Guides', 'Resources'].map((item) => (
                  <span key={item} className="rounded-full border border-white/14 bg-white/6 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-soft)]">Sections</h3>
              <div className="mt-5 grid gap-3">
                {taskLinks.map((task) => (
                  <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm text-white/76 transition hover:text-white">
                    {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-soft)]">Useful</h3>
              <div className="mt-5 grid gap-3 text-sm text-white/76">
                <Link href="/about" className="transition hover:text-white">About</Link>
                <Link href="/contact" className="transition hover:text-white">Contact</Link>
                <Link href="/search" className="transition hover:text-white">Search</Link>
                {session ? <Link href="/create" className="transition hover:text-white">Create</Link> : null}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--slot4-accent-soft)]">Account</h3>
              <div className="mt-5 grid gap-3 text-sm text-white/76">
                {session ? (
                  <>
                    <Link href="/create" className="transition hover:text-white">Create post</Link>
                    <button type="button" onClick={logout} className="text-left transition hover:text-white">Logout</button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="transition hover:text-white">Login</Link>
                    <Link href="/signup" className="transition hover:text-white">Join</Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/58 sm:flex-row sm:items-center sm:justify-between">
            <p>{globalContent.footer.bottomNote}</p>
            <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
