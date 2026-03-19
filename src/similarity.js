const DATAMUSE = 'https://api.datamuse.com/words'

async function fetchRelated(word, param = 'ml') {
  try {
    const res = await fetch(`${DATAMUSE}?${param}=${encodeURIComponent(word)}&max=15`)
    if (!res.ok) return []
    const data = await res.json()
    return (data || []).map((x) => (x.word || '').toLowerCase()).filter(Boolean)
  } catch {
    return []
  }
}

/**
 * Returns { percentage, summary } for how close two words are in meaning.
 * Uses Datamuse API (free, no key). Set VITE_OPENAI_API_KEY to use OpenAI for richer summaries.
 */
export async function getSimilarity(word1, word2) {
  const a = (word1 || '').trim().toLowerCase()
  const b = (word2 || '').trim().toLowerCase()
  if (!a || !b) return { percentage: 0, summary: 'Need both words.' }
  if (a === b) return { percentage: 100, summary: 'Perfect match!' }

  const [openaiKey] = [import.meta.env.VITE_OPENAI_API_KEY].filter(Boolean)
  if (openaiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: `Rate how related these two words are from 0 to 100, then in one short phrase (under 12 words) say why. Reply in this exact format:\nNUMBER%\nPHRASE\n\nWords: "${a}", "${b}"`,
            },
          ],
          max_tokens: 60,
        }),
      })
      if (!res.ok) throw new Error('OpenAI request failed')
      const data = await res.json()
      const text = data?.choices?.[0]?.message?.content?.trim() || ''
      const [line1, ...rest] = text.split('\n').map((s) => s.trim()).filter(Boolean)
      const num = parseInt(String(line1).replace(/\D/g, ''), 10)
      const percentage = Math.min(100, Math.max(0, Number.isNaN(num) ? 70 : num))
      const summary = rest.join(' ').trim() || 'Related in meaning or context.'
      return { percentage, summary }
    } catch {
      // fall through to Datamuse
    }
  }

  const [list1, list2] = await Promise.all([
    fetchRelated(a),
    fetchRelated(b),
  ])
  const set1 = new Set(list1)
  const set2 = new Set(list2)
  if (set1.has(b) || set2.has(a)) {
    return { percentage: 92, summary: 'Very close — similar or related meaning.' }
  }
  const overlap = list1.filter((w) => set2.has(w))
  if (overlap.length >= 2) {
    const theme = overlap[0]
    return {
      percentage: 85,
      summary: `Very close! Both relate to "${theme}" or similar.`,
    }
  }
  if (overlap.length === 1) {
    return {
      percentage: 72,
      summary: `Some connection: both link to "${overlap[0]}" or related ideas.`,
    }
  }
  const relTrg1 = await fetchRelated(a, 'rel_trg')
  const relTrg2 = await fetchRelated(b, 'rel_trg')
  const trgOverlap = relTrg1.filter((w) => relTrg2.includes(w))
  if (trgOverlap.length > 0) {
    return {
      percentage: 68,
      summary: 'Related concepts but not the same idea.',
    }
  }
  return {
    percentage: 45,
    summary: 'Different concepts; harder to match.',
  }
}
