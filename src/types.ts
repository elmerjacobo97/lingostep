export type Settings = {
  groqApiKey: string
  model: string
}

export type Progress = {
  completedLessons: string[]
  scores: Record<string, number>
  xp: number
  streak: { count: number; lastDay: string }
}

export type Question = {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

export type Lesson = {
  id: string
  title: string
  level: 'A2' | 'B1' | 'B2'
  topic: string
  passage: string
  questions: Question[]
  xpReward: number
}

