import { useEffect, useState } from 'react'

/**
 * Returns the Tailwind stroke color class based on the score value.
 * @param {number} score - A number in range [0, 100]
 * @returns {string} Tailwind stroke color class
 */
export function getScoreColor(score) {
  if (score < 50) return 'stroke-red-500'
  if (score < 75) return 'stroke-amber-500'
  return 'stroke-green-500'
}

/**
 * Animated SVG circular progress ring displaying a numeric score.
 * @param {{ score: number, size?: number, strokeWidth?: number }} props
 */
export default function ScoreRing({ score, size = 140, strokeWidth = 10 }) {
  const radius = size / 2 - strokeWidth
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - score / 100)

  const [dashOffset, setDashOffset] = useState(circumference)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashOffset(targetOffset)
    }, 50)
    return () => clearTimeout(timer)
  }, [targetOffset])

  const colorClass = getScoreColor(score)
  const center = size / 2

  return (
    <svg width={size} height={size} className="block">
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="stroke-gray-200"
      />
      {/* Progress arc */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
        className={colorClass}
      />
      {/* Centered score text */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-gray-800 font-bold"
        style={{ fontSize: size * 0.22, fontWeight: 700 }}
      >
        {score}
      </text>
    </svg>
  )
}
