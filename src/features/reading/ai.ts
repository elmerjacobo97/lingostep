import type Groq from 'groq-sdk'

export type WordExplanation = {
  meaning_es: string
  part_of_speech: string
  example_en: string
}

export async function explainWord(
  client: Groq,
  model: string,
  word: string,
  context: string
): Promise<WordExplanation> {
  const response = await client.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are an English tutor for Spanish-speaking software developers. Respond ONLY with valid JSON matching this schema: {"meaning_es": string, "part_of_speech": string, "example_en": string}',
      },
      {
        role: 'user',
        content: `Word: "${word}"\nContext: "${context}"\n\nExplain the word meaning in Spanish, its part of speech in English (noun, verb, adjective, etc.), and provide a short example sentence in English related to software development.`,
      },
    ],
    max_tokens: 200,
  })

  const text = response.choices[0]?.message?.content ?? '{}'
  return JSON.parse(text) as WordExplanation
}

export type WritingGrade = {
  score: number
  feedback_es: string
  corrected_en: string
}

export async function gradeAnswer(
  client: Groq,
  model: string,
  question: string,
  userAnswer: string
): Promise<WritingGrade> {
  const response = await client.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content:
          'You are an English tutor for Spanish-speaking software developers. Respond ONLY with valid JSON matching this schema: {"score": number (0-100), "feedback_es": string, "corrected_en": string}',
      },
      {
        role: 'user',
        content: `Question: "${question}"\nStudent answer: "${userAnswer}"\n\nGrade the answer from 0 to 100. Give brief feedback in Spanish explaining grammar or vocabulary issues. Provide a corrected version in English.`,
      },
    ],
    max_tokens: 300,
  })

  const text = response.choices[0]?.message?.content ?? '{}'
  return JSON.parse(text) as WritingGrade
}
