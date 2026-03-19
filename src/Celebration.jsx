import { useEffect, useState } from 'react'

const COLORS = ['#aa3bff', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899']
const COUNT = 60

export function Celebration() {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    setPieces(
      Array.from({ length: COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 80,
        delay: Math.random() * 0.8,
        duration: 2 + Math.random() * 1.5,
        color: COLORS[i % COLORS.length],
        size: 6 + Math.random() * 6,
        rotation: Math.random() * 360,
      }))
    )
  }, [])

  return (
    <div className="floword-celebration" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="floword-confetti"
          style={{
            '--left': `${p.left}%`,
            '--drift': `${p.drift}px`,
            '--delay': `${p.delay}s`,
            '--duration': `${p.duration}s`,
            '--color': p.color,
            '--size': `${p.size}px`,
            '--rotation': `${p.rotation}deg`,
          }}
        />
      ))}
    </div>
  )
}
