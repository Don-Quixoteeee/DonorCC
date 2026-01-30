// AI utility for donor retention risk prediction
// Uses API key from .env and calls external AI service (e.g., OpenAI)

export async function predictDonorRisk(donor) {
  const apiKey = process.env.AI_API_KEY
  if (!apiKey) throw new Error('Missing AI_API_KEY')

  // Example: Call OpenAI API (replace with your provider as needed)
  const prompt = `Given the following donor data, predict the retention risk (low, medium, high):\n${JSON.stringify(donor)}`
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a nonprofit data analyst.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 16,
      temperature: 0.2,
    }),
  })
  if (!response.ok) throw new Error('AI API error')
  const data = await response.json()
  // Extract risk from AI response (assume plain text answer)
  const answer = data.choices?.[0]?.message?.content?.trim().toLowerCase()
  if (answer.includes('high')) return 'HIGH'
  if (answer.includes('medium')) return 'MEDIUM'
  if (answer.includes('low')) return 'LOW'
  return 'UNKNOWN'
}
