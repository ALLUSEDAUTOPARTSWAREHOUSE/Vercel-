'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

const brandSlides = [
  { name: 'Acura', slug: 'acura', image: '/brand-cars/acura-car.png', caption: 'Precision parts, verified fitment' },
  { name: 'Ford', slug: 'ford', image: '/brand-cars/ford-car.png', caption: 'Dependable inventory, ready to ship' },
  { name: 'Chevrolet', slug: 'chevrolet', image: '/brand-cars/chevrolet-car.png', caption: 'OEM-quality used parts' },
]

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('error')
    const messages: Record<string, string> = {
      github_not_configured: 'GitHub sign-in is not configured. Use your email and password.',
      github_cancelled: 'GitHub sign-in was cancelled.',
      github_state_invalid: 'The GitHub sign-in request expired. Please try again.',
      github_exchange_failed: 'GitHub could not complete sign-in. Please try again.',
      github_identity_failed: 'We could not verify your GitHub account. Please try again.',
      github_not_authorized: 'This GitHub account is not authorized for the admin workspace.',
      github_signin_failed: 'GitHub sign-in failed. Please use your existing login.',
    }
    if (code && messages[code]) setError(messages[code])
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % brandSlides.length), 5000)
    return () => window.clearInterval(timer)
  }, [])

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const response = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password }),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Unable to sign in. Check your credentials and try again.')
        return
      }
      router.replace(data.redirectTo || '/admin/workspace')
      router.refresh()
    } catch {
      setError('We could not connect securely. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const activeBrand = brandSlides[slide]

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#171722] px-4 py-8 text-white sm:px-8 lg:px-12">
      <section className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/5 bg-[#0f0f17] shadow-2xl lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[650px] overflow-hidden bg-[#11111a] p-6 sm:p-10 lg:block">
          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="text-lg font-black tracking-[0.24em] text-violet-400">AUAPW</Link>
            <Link href="/" className="rounded-full bg-white/5 px-4 py-2 text-xs text-slate-300 transition hover:bg-white/10">Back to website <ArrowRight className="ml-1 inline size-3" /></Link>
          </div>
          <Link href={`/brands/${activeBrand.slug}`} className="absolute inset-6 top-24 overflow-hidden rounded-2xl sm:inset-10 sm:top-24">
            <Image src={activeBrand.image} alt={`${activeBrand.name} parts`} fill priority className="object-contain object-center opacity-90 transition duration-700" sizes="(min-width: 1024px) 42vw, 100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f17] via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-8 px-6">
              <p className="text-sm font-medium text-slate-300">{activeBrand.name} collection</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">{activeBrand.caption}</h2>
              <span className="mt-4 inline-flex text-xs font-semibold text-violet-300">Browse {activeBrand.name} parts <ArrowRight className="ml-1 size-3" /></span>
            </div>
          </Link>
          <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2" aria-label="Brand collection slides">
            {brandSlides.map((brand, index) => <button key={brand.slug} type="button" aria-label={`Show ${brand.name}`} onClick={() => setSlide(index)} className={`h-1 rounded-full transition-all ${index === slide ? 'w-7 bg-white' : 'w-3 bg-white/30'}`} />)}
          </div>
        </div>

        <div className="flex items-center justify-center bg-[#101018] p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link href="/" className="text-lg font-black tracking-[0.24em] text-violet-400">AUAPW</Link>
              <Link href="/" className="text-xs text-slate-400">Back to website <ArrowRight className="ml-1 inline size-3" /></Link>
            </div>
            <div className="mb-7 flex size-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400"><ShieldCheck className="size-6" /></div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Welcome back</h1>
            <p className="mt-3 text-sm leading-6 text-slate-400">Sign in to manage inventory, brands, orders, and your AUAPW workspace.</p>
            {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <div><label htmlFor="portal-email" className="mb-2 block text-sm font-medium text-slate-300">Email address</label><div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" /><input id="portal-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@yourcompany.com" required className="h-12 w-full rounded-xl border border-white/10 bg-white/[.04] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/15" /></div></div>
              <div><div className="mb-2 flex items-center justify-between"><label htmlFor="portal-password" className="text-sm font-medium text-slate-300">Password</label><Link href="/admin/forgot-password" className="text-xs font-semibold text-violet-400 hover:underline">Forgot password?</Link></div><div className="relative"><LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" /><input id="portal-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required className="h-12 w-full rounded-xl border border-white/10 bg-white/[.04] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/15" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:text-white">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div></div>
              <button type="submit" disabled={isLoading} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-4 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-400 disabled:opacity-60">{isLoading ? 'Signing you in…' : 'Sign in to AUAPW'} {!isLoading && <ArrowRight className="size-4" />}</button>
            </form>
            <p className="mt-7 text-center text-xs leading-5 text-slate-500">Authorized administrators and staff only. Customer accounts use <Link href="/sign-in" className="text-violet-400 hover:underline">customer sign in</Link>.</p>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck className="size-3.5" /> Protected sign-in · Role-based access</div>
          </div>
        </div>
      </section>
    </main>
  )
}
