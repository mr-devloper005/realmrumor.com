'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Globe, LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })),
    []
  )
  const visibleNavItems = navItems.filter((item) => !['Image', 'Profile'].includes(item.label))

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[86px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl border border-[var(--editable-border)] bg-white shadow-[0_8px_20px_rgba(9,20,19,0.06)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="editable-display text-[2.1rem] font-extrabold leading-none tracking-[-0.08em] text-[var(--slot4-page-text)]">
            {SITE_CONFIG.name.replace(/\.[^.]+$/, '')}
            <span className="text-[var(--slot4-accent-fill)]">.</span>
          </span>
        </Link>

        <form action="/search" className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
          <div className="flex w-full max-w-[36rem] items-center overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white shadow-[0_10px_30px_rgba(9,20,19,0.06)]">
            <input
              name="q"
              type="search"
              placeholder="What are you looking for today?"
              className="h-12 min-w-0 flex-1 bg-transparent px-5 text-sm font-medium outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
            <button className="flex h-12 w-14 items-center justify-center bg-[var(--slot4-dark-bg)] text-white transition hover:bg-[var(--slot4-accent)]" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>

        <div className="ml-auto hidden items-center gap-6 text-sm font-semibold lg:flex">
          <span className="inline-flex items-center gap-2 text-[var(--slot4-muted-text)]">
            <Globe className="h-4 w-4" /> English
          </span>
          <Link href="/contact" className="hover:text-[var(--slot4-accent)]">
            Contact
          </Link>
          {session ? (
            <>
              <Link href="/create" className="hover:text-[var(--slot4-accent)]">
                Create
              </Link>
              <button type="button" onClick={logout} className="text-[var(--slot4-muted-text)] hover:text-[var(--slot4-accent)]">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[var(--slot4-accent)]">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border border-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-bold transition hover:bg-[var(--slot4-dark-bg)] hover:text-white"
              >
                Join
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--editable-border)] bg-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-cream)] px-4 py-5 lg:hidden">
          <form action="/search" className="flex items-center overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-white">
            <input
              name="q"
              type="search"
              placeholder="Search everything"
              className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
            />
            <button className="flex h-12 w-12 items-center justify-center bg-[var(--slot4-dark-bg)] text-white" aria-label="Search">
              <Search className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-5 grid gap-2">
            {[{ label: 'Home', href: '/' }, ...visibleNavItems, { label: 'Contact', href: '/contact' }].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${active ? 'bg-[var(--slot4-dark-bg)] text-white' : 'bg-white text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]'}`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-5 grid gap-2">
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--slot4-accent-fill)] px-4 py-3 text-sm font-bold text-white">
                  <PlusCircle className="h-4 w-4" /> Create
                </Link>
                <button type="button" onClick={logout} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-semibold">
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--slot4-dark-bg)] px-4 py-3 text-sm font-bold text-white">
                  <UserPlus className="h-4 w-4" /> Join
                </Link>
              </>
            )}
          </div>

          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[var(--slot4-soft-muted-text)]">{globalContent.nav.tagline}</p>
        </div>
      ) : null}
    </header>
  )
}
