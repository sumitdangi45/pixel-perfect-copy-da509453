import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ImagePlus, LoaderCircle, LogOut, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { lovable } from '@/integrations/lovable/index'
import type { User } from '@supabase/supabase-js'

export const Route = createFileRoute('/editor')({
  head: () => ({ meta: [
    { title: 'Visual Review | Anni Web Solutions' },
    { name: 'description', content: 'Compare a reference screenshot with your current page and get actionable visual layout feedback.' },
    { property: 'og:title', content: 'Visual Review | Anni Web Solutions' },
    { property: 'og:description', content: 'Screenshot comparison and layout feedback for the Anni Web Solutions editor.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: EditorPage,
})

type Slot = 'reference' | 'current'
const MAX_FILE = 5 * 1024 * 1024
const allowed = ['image/png', 'image/jpeg', 'image/webp']

function EditorPage() {
  const [user, setUser] = useState<User | null>(null)
  const [checking, setChecking] = useState(true)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState('')
  const [files, setFiles] = useState<{ reference: File | null; current: File | null }>({ reference: null, current: null })
  const [previews, setPreviews] = useState<{ reference: string; current: string }>({ reference: '', current: '' })
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(({ data }) => { if (active) { setUser(data.user); setChecking(false) } }).catch(() => { if (active) setChecking(false) })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => { if (active) { setUser(session?.user ?? null); setChecking(false) } })
    return () => { active = false; data.subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    const urls = { reference: files.reference ? URL.createObjectURL(files.reference) : '', current: files.current ? URL.createObjectURL(files.current) : '' }
    setPreviews(urls)
    return () => { if (urls.reference) URL.revokeObjectURL(urls.reference); if (urls.current) URL.revokeObjectURL(urls.current) }
  }, [files])

  function setFile(slot: Slot, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!allowed.includes(file.type) || !file.size || file.size > MAX_FILE) { setError('Use a PNG, JPG, or WebP image under 5 MB.'); return }
    setFiles(previous => ({ ...previous, [slot]: file }))
    setResult(''); setError('')
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAuthError(''); setAuthBusy(true)
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '')
    const password = String(data.get('password') || '')
    const response = authMode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/editor` } })
    if (response.error) setAuthError(response.error.message)
    else if (authMode === 'signup' && !response.data.session) setAuthError('Check your email to confirm your account, then sign in.')
    setAuthBusy(false)
  }

  async function handleGoogle() {
    setAuthError(''); setAuthBusy(true)
    const response = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin })
    if (response.error) setAuthError(response.error.message)
    if (!response.redirected) setAuthBusy(false)
  }

  async function compare() {
    if (!files.reference || !files.current || busy) return
    setBusy(true); setResult(''); setError('')
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      if (!token) throw new Error('Your session has expired. Sign in again.')
      const form = new FormData()
      form.append('reference', files.reference)
      form.append('current', files.current)
      const response = await fetch('/api/visual-review', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
      if (!response.ok) throw new Error(await response.text())
      if (!response.body) throw new Error('No response was returned. Please try again.')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let text = ''
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        text += decoder.decode(value, { stream: true })
        const failure = text.indexOf('[VISUAL_REVIEW_ERROR]')
        if (failure !== -1) throw new Error(text.slice(failure + '[VISUAL_REVIEW_ERROR]'.length).trim())
        setResult(text)
      }
      text += decoder.decode()
      setResult(text)
      if (!text.trim()) throw new Error('No visual feedback was returned. Please try again.')
    } catch (issue) { setError(issue instanceof Error ? issue.message : 'The comparison could not be completed.') }
    finally { setBusy(false) }
  }

  return <main className="review-page">
    <header className="review-header"><Link to="/" className="review-back"><ArrowLeft size={17} /> Anni Web Solutions</Link><span className="review-header-label">VISUAL REVIEW</span>{user && <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}><LogOut size={15} /> Sign out</Button>}</header>
    <div className="review-content">
      <div className="review-heading"><span className="review-kicker"><Sparkles size={15} /> EDITOR WORKSPACE</span><h1>Visual review</h1><p>Compare your page against a reference and pinpoint what needs to change.</p></div>
      {checking ? <div className="review-status"><LoaderCircle className="review-spin" /> Checking access…</div> : !user ? <div className="review-auth"><h2>{authMode === 'signin' ? 'Sign in to continue' : 'Create your account'}</h2><p>Screenshot reviews are available to signed-in editors.</p><form onSubmit={handleAuth}><label>Email<input name="email" type="email" autoComplete="email" required placeholder="you@example.com" /></label><label>Password<input name="password" type="password" autoComplete={authMode === 'signin' ? 'current-password' : 'new-password'} minLength={6} required placeholder="At least 6 characters" /></label><Button type="submit" disabled={authBusy}>{authBusy ? 'Please wait…' : authMode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight size={16} /></Button></form><div className="review-auth-divider">or</div><Button variant="outline" disabled={authBusy} onClick={handleGoogle}>Continue with Google</Button><p className="review-switch">{authMode === 'signin' ? 'New here?' : 'Already have an account?'} <Button variant="link" onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError('') }}>{authMode === 'signin' ? 'Create account' : 'Sign in'}</Button></p>{authError && <p className="review-error" role="alert">{authError}</p>}</div> : <>
        <div className="review-uploads">{(['reference', 'current'] as const).map((slot, index) => <section className="review-upload" key={slot}><div className="review-upload-head"><span className="review-step">0{index + 1}</span><div><h2>{slot === 'reference' ? 'Reference screenshot' : 'Current page screenshot'}</h2><p>{slot === 'reference' ? 'The layout you want to match' : 'The page as it looks now'}</p></div>{files[slot] && <Button variant="ghost" size="icon" aria-label={`Remove ${slot} screenshot`} title="Remove screenshot" onClick={() => { setFiles(previous => ({ ...previous, [slot]: null })); setResult('') }}><X size={17} /></Button>}</div><label className={`review-drop ${previews[slot] ? 'review-drop-filled' : ''}`}><input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => setFile(slot, event)} aria-label={`Upload ${slot} screenshot`} />{previews[slot] ? <img src={previews[slot]} alt={`${slot} screenshot preview`} /> : <span className="review-empty"><ImagePlus size={31} /><strong>Choose screenshot</strong><small>PNG, JPG or WebP · max 5 MB</small></span>}</label>{files[slot] && <p className="review-file">{files[slot]?.name}</p>}</section>)}</div>
        <div className="review-action"><Button variant="quote" onClick={compare} disabled={!files.reference || !files.current || busy}>{busy ? <LoaderCircle className="review-spin" size={17} /> : <Sparkles size={17} />}{busy ? 'Comparing screenshots…' : 'Compare screenshots'} {!busy && <ArrowRight size={17} />}</Button><span>Compare screenshots taken at the same screen size for the best feedback.</span></div>
        {error && <div className="review-error" role="alert">{error}</div>}
        {(result || busy) && <section className="review-results" aria-live="polite"><div className="review-results-title"><Sparkles size={18} /><h2>Visual differences & layout changes</h2></div>{result ? <div className="review-result-text">{result.split('\n').map((line, i) => line.startsWith('## ') ? <h3 key={i}>{line.slice(3)}</h3> : line.trim() ? <p key={i}>{line}</p> : null)}</div> : <p>Looking closely at both screenshots…</p>}</section>}
      </>}
    </div>
  </main>
}
