import Groq from 'groq-sdk'
import type { Settings } from '@/types'

export function createGroqClient(settings: Settings): Groq | null {
  if (!settings.groqApiKey) return null
  return new Groq({ apiKey: settings.groqApiKey, dangerouslyAllowBrowser: true })
}
