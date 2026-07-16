'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { CATEGORIES } from '@/data/cards'

interface TimerSettings {
  total: number
  allocations: number[]
}

const CATEGORY_GRADIENTS = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-green-400 to-green-600',
  'from-yellow-400 to-amber-500',
  'from-orange-400 to-orange-600',
  'from-red-400 to-rose-600',
]

function playBeep(frequency: number, duration: number, volume = 0.4) {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = frequency
    osc.type = 'sine'
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {}
}

function playNotification() {
  playBeep(880, 0.15)
  setTimeout(() => playBeep(880, 0.15), 200)
  setTimeout(() => playBeep(1100, 0.4), 400)
}

function playFinish() {
  playBeep(660, 0.2)
  setTimeout(() => playBeep(880, 0.2), 250)
  setTimeout(() => playBeep(1100, 0.5), 500)
}

export default function SessionTimer() {
  const [settings, setSettings] = useState<TimerSettings | null>(null)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [notifying, setNotifying] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const notifyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('bcc_timer_settings')
      if (raw) {
        const s: TimerSettings = JSON.parse(raw)
        setSettings(s)
        setRemaining(s.allocations[0] * 60)
      }
    } catch {}
  }, [])

  const goNextPhase = useCallback((phase: number, s: TimerSettings) => {
    const next = phase + 1
    if (next >= CATEGORIES.length) {
      setFinished(true)
      setRunning(false)
      playFinish()
      setNotifying(true)
      notifyTimeoutRef.current = setTimeout(() => setNotifying(false), 4000)
      if (Notification.permission === 'granted') {
        new Notification('対話セッション終了！', { body: 'お疲れさまでした。貢献メモを書きましょう。', icon: '/favicon.ico' })
      }
    } else {
      setCurrentPhase(next)
      setRemaining(s.allocations[next] * 60)
      playNotification()
      setNotifying(true)
      notifyTimeoutRef.current = setTimeout(() => setNotifying(false), 3000)
      if (Notification.permission === 'granted') {
        new Notification(`次のカテゴリへ：${CATEGORIES[next].name}`, {
          body: `${s.allocations[next]}分間の対話を始めましょう`,
          icon: '/favicon.ico',
        })
      }
    }
  }, [])

  useEffect(() => {
    if (!running || !settings) return
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          goNextPhase(currentPhase, settings)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, currentPhase, settings, goNextPhase])

  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  function handleStart() {
    requestNotificationPermission()
    setRunning(true)
  }

  function handlePause() { setRunning(false) }

  function handleReset() {
    if (!settings) return
    setRunning(false)
    setFinished(false)
    setCurrentPhase(0)
    setRemaining(settings.allocations[0] * 60)
    if (intervalRef.current) clearInterval(intervalRef.current)
  }

  if (!settings) return null

  const totalSeconds = settings.total * 60
  const elapsedTotal = settings.allocations.slice(0, currentPhase).reduce((a, b) => a + b, 0) * 60
    + (settings.allocations[currentPhase] * 60 - remaining)
  const overallProgress = Math.min(100, (elapsedTotal / totalSeconds) * 100)
  const phaseProgress = Math.min(100, ((settings.allocations[currentPhase] * 60 - remaining) / (settings.allocations[currentPhase] * 60)) * 100)

  const minutes = Math.floor(remaining / 60)
  const seconds = remaining % 60
  const cat = CATEGORIES[currentPhase]
  const gradient = CATEGORY_GRADIENTS[currentPhase]

  return (
    <div className={`rounded-2xl border-2 shadow-sm overflow-hidden transition-all duration-500 ${
      notifying ? 'border-amber-400 shadow-amber-200' : 'border-gray-200'
    }`}>
      {/* カテゴリヘッダー */}
      <div className={`bg-gradient-to-r ${gradient} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{cat.emoji}</span>
          <span className="text-white font-bold text-sm">{cat.name}</span>
          <span className="text-white/60 text-xs">（{currentPhase + 1}/{CATEGORIES.length}）</span>
        </div>
        <span className="text-white/80 text-xs font-semibold">
          {settings.allocations[currentPhase]}分間
        </span>
      </div>

      <div className="bg-white p-5 space-y-4">
        {/* フェーズ内プログレス */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <span>このカテゴリの進捗</span>
            <span>{Math.round(phaseProgress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000`}
              style={{ width: `${phaseProgress}%` }}
            />
          </div>
        </div>

        {/* カウントダウン */}
        <div className="flex items-center justify-between">
          <span className={`text-4xl font-mono font-bold tabular-nums ${
            finished ? 'text-green-500' : remaining <= 60 && running ? 'text-red-500' : 'text-gray-800'
          }`}>
            {finished ? '完了！' : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
          </span>

          <div className="flex gap-2">
            {!finished && (
              <>
                <button
                  onClick={running ? handlePause : handleStart}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                    running
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  {running ? '⏸ 一時停止' : '▶ スタート'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl text-sm text-gray-400 border border-gray-200 hover:bg-gray-50"
                >
                  リセット
                </button>
              </>
            )}
            {finished && (
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-green-100 text-green-700 hover:bg-green-200"
              >
                もう一度
              </button>
            )}
          </div>
        </div>

        {/* 通知バナー */}
        {notifying && !finished && (
          <div className={`bg-gradient-to-r ${gradient} rounded-xl px-4 py-3 text-white text-sm font-bold animate-pulse text-center`}>
            🔔 次のカテゴリへ：{cat.name}
          </div>
        )}
        {notifying && finished && (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 text-sm font-bold text-center">
            🎉 セッション終了！お疲れさまでした
          </div>
        )}

        {/* 全体進捗 */}
        <div className="space-y-1 pt-1 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-400">
            <span>全体進捗</span>
            <span>{Math.round(overallProgress)}%（{settings.total}分中）</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 flex gap-0.5 overflow-hidden">
            {CATEGORIES.map((c, i) => {
              const width = (settings.allocations[i] / settings.total) * 100
              const isCurrent = i === currentPhase
              const isDone = i < currentPhase
              return (
                <div
                  key={c.id}
                  style={{ width: `${width}%` }}
                  className={`h-full transition-all duration-500 ${
                    isDone ? 'opacity-100' :
                    isCurrent ? 'opacity-100' :
                    'opacity-20'
                  } bg-gradient-to-r ${CATEGORY_GRADIENTS[i]}`}
                />
              )
            })}
          </div>
          {/* カテゴリラベル */}
          <div className="flex mt-1" style={{ fontSize: '9px' }}>
            {CATEGORIES.map((c, i) => {
              const width = (settings.allocations[i] / settings.total) * 100
              return (
                <div
                  key={c.id}
                  style={{ width: `${width}%` }}
                  className={`text-center truncate leading-tight ${
                    i === currentPhase ? 'text-gray-600 font-bold' : 'text-gray-300'
                  }`}
                >
                  {c.emoji}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
