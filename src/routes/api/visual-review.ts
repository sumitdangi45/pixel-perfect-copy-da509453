import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { analyzeScreenshots } from '@/lib/visual-review.server'

const MAX_FILE = 5 * 1024 * 1024
const accepted = ['image/png', 'image/jpeg', 'image/webp']
const message = (text: string, status: number) => new Response(text, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } })

export const Route = createFileRoute('/api/visual-review')({
  server: { handlers: { POST: async ({ request }) => {
    const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1]
    if (!token) return message('Sign in to compare screenshots.', 401)
    const url = process.env['SUPABASE_URL']
    const key = process.env['SUPABASE_PUBLISHABLE_KEY']
    if (!url || !key) return message('Sign-in service is unavailable.', 503)
    const auth = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (input, init) => {
      const headers = new Headers(init?.headers)
      if (headers.get('Authorization') === `Bearer ${key}`) headers.delete('Authorization')
      headers.set('apikey', key)
      return fetch(input, { ...init, headers })
    } } })
    const { data, error } = await auth.auth.getUser(token)
    if (error || !data.user) return message('Your session has expired. Sign in again.', 401)
    const size = Number(request.headers.get('content-length') || 0)
    if (size > MAX_FILE * 2 + 100000) return message('Each screenshot must be under 5 MB.', 413)
    let body: FormData
    try { body = await request.formData() } catch { return message('Please upload two image files.', 400) }
    const reference = body.get('reference')
    const current = body.get('current')
    if (!(reference instanceof File) || !(current instanceof File)) return message('Upload both screenshots to compare.', 400)
    if ([reference, current].some(file => !accepted.includes(file.type) || file.size === 0 || file.size > MAX_FILE)) return message('Use PNG, JPG, or WebP screenshots under 5 MB each.', 400)
    const signatures = await Promise.all([reference, current].map(async file => {
      const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
      if (file.type === 'image/png') return bytes[0] === 137 && bytes[1] === 80 && bytes[2] === 78 && bytes[3] === 71
      if (file.type === 'image/jpeg') return bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      return bytes[0] === 82 && bytes[1] === 73 && bytes[2] === 70 && bytes[3] === 70 && bytes[8] === 87 && bytes[9] === 69 && bytes[10] === 66 && bytes[11] === 80
    }))
    if (signatures.some(valid => !valid)) return message('One of the uploaded files is not a valid image.', 400)
    try {
      const result = await analyzeScreenshots(reference, current)
      return result.toTextStreamResponse({ headers: { 'Cache-Control': 'no-store' } })
    } catch (error) {
      return message(error instanceof Error ? error.message : 'Screenshot analysis is unavailable.', 502)
    }
  } } },
})
