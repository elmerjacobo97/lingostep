import type { Settings, Progress } from '@/types'

const KEYS = {
  settings: 'lingostep.settings',
  progress: 'lingostep.progress',
} as const

const DEFAULT_SETTINGS: Settings = {
  groqApiKey: '',
  model: 'llama-3.3-70b-versatile',
}

const DEFAULT_PROGRESS: Progress = {
  completedLessons: [],
  scores: {},
  xp: 0,
  streak: { count: 0, lastDay: '' },
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function save<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadSettings(): Settings {
  return { ...DEFAULT_SETTINGS, ...load<Settings>(KEYS.settings, DEFAULT_SETTINGS) }
}

export function saveSettings(s: Settings): void {
  save(KEYS.settings, s)
}

export function loadProgress(): Progress {
  return { ...DEFAULT_PROGRESS, ...load<Progress>(KEYS.progress, DEFAULT_PROGRESS) }
}

export function saveProgress(p: Progress): void {
  save(KEYS.progress, p)
}

export function recordLessonComplete(
  progress: Progress,
  lessonId: string,
  score: number,
  xpReward: number
): Progress {
  const today = new Date().toISOString().split('T')[0]
  const { streak } = progress
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  const newStreak =
    streak.lastDay === today
      ? streak
      : streak.lastDay === yesterday
        ? { count: streak.count + 1, lastDay: today }
        : { count: 1, lastDay: today }

  return {
    ...progress,
    completedLessons: progress.completedLessons.includes(lessonId)
      ? progress.completedLessons
      : [...progress.completedLessons, lessonId],
    scores: { ...progress.scores, [lessonId]: score },
    xp: progress.xp + xpReward,
    streak: newStreak,
  }
}
