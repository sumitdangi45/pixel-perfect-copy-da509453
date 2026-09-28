import { createOpenAI } from '@ai-sdk/openai'
import { streamText, type ModelMessage } from 'ai'
import { createLovableAiGatewayRunIdFetch } from './ai-run-id.server'

export async function analyzeScreenshots(reference: File, current: File) {
  const apiKey = process.env['LOVABLE_API_KEY']
  if (!apiKey) throw new Error('Lovable AI is not configured. Please try again later.')
  const run = createLovableAiGatewayRunIdFetch()
  const gateway = createOpenAI({
    baseURL: 'https://ai.gateway.lovable.dev/v1',
    apiKey,
    headers: { 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'vercel-ai-sdk' },
    fetch: run.fetch,
  })
  const messages: ModelMessage[] = [{
    role: 'user',
    content: [
      { type: 'text', text: 'Compare these TWO screenshots of a web page. The first is the TARGET REFERENCE and the second is the CURRENT PAGE. Identify visible differences only. Write a concise, actionable review in this exact format using markdown:\n## Biggest differences\n- 3–6 specific visible mismatches, including position, size, spacing, typography, colors, image crop, or content where applicable.\n## Layout changes\n1. 3–7 prioritized instructions with approximate relative measurements or CSS-oriented actions (e.g. move the form 30px left at 1440px viewport). Mention viewport mismatch if the screenshots have different dimensions and avoid asserting exact pixel differences then. Do not claim you changed the page or invent unseen details. No code fences.' },
      { type: 'image', image: new URL(`data:${reference.type};base64,${Buffer.from(await reference.arrayBuffer()).toString('base64')}`) },
      { type: 'image', image: new URL(`data:${current.type};base64,${Buffer.from(await current.arrayBuffer()).toString('base64')}`) },
    ],
  }]
  const result = streamText({
    model: gateway.responses('openai/gpt-6-astra'),
    messages,
    maxRetries: 0,
    providerOptions: { openai: { forceReasoning: true, reasoningEffort: 'medium', reasoningSummary: 'auto', store: false, include: ['reasoning.encrypted_content'] } },
  })
  return result
}
