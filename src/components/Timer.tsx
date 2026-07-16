'use client'

import { useState, useEffect, useRef } from 'react'

const PRESETS = [
  { label: '5分', seconds: 5 * 60 },
  { label: '10分', seconds: 10 * 60 },
  { label: '15分', seconds: 15 * 60 },
]

export default function Timer() {
  const [selected, setSelected] = useState<number | null>(null)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setRunning(false)
            setFinished(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, remaining])

  function selectPreset(seconds: number) {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setSelected(seconds)
    setRemaining(seconds)
    setRunning(false)
    setFinished(false)
  }

  function toggle() {
    if (finished) return
    setRunning((r) => !r)
  }

  function reset() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (selected !== null) setRemaining(selected)
    setRunning(false)
    setFinished(false)
  }

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const progress = selected ? ((selected - remaining) / selected) * 100 : 0

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-base font-bold text-gray-700">⏱ タイマー</span>
      </div>

      {/* プリセット */}
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.seconds}
            onClick={() => selectPreset(p.seconds)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
              selected === p.seconds
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-amber-50 hover:border-amber-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 表示 */}
      {selected !== null && (
        <div className="space-y-2">
          {/* プログレスバー */}
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ${finished ? 'bg-red-400' : 'bg-amber-400'}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className={`text-3xl font-mono font-bold tabular-nums ${finished ? 'text-red-500' : 'text-gray-800'}`}>
              {finished ? '時間です！' : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
            </span>
            <div className="flex gap-2">
              <button
                onClick={toggle}
                disabled={finished}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  finished
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : running
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-amber-500 text-white hover:bg-amber-600'
                }`}
              >
                {running ? '一時停止' : 'スタート'}
              </button>
              <button
                onClick={reset}
                className="px-3 py-1.5 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
