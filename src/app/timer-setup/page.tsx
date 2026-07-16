'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CATEGORIES } from '@/data/cards'

const DEFAULT_TOTAL = 30
const MIN_PER_CATEGORY = 1

function distribute(total: number, count: number): number[] {
  const base = Math.floor(total / count)
  const remainder = total - base * count
  return Array.from({ length: count }, (_, i) => base + (i < remainder ? 1 : 0))
}

export default function TimerSetupPage() {
  const router = useRouter()
  const [total, setTotal] = useState(DEFAULT_TOTAL)
  const [allocations, setAllocations] = useState<number[]>(() => distribute(DEFAULT_TOTAL, CATEGORIES.length))

  const allocSum = allocations.reduce((a, b) => a + b, 0)
  const diff = allocSum - total

  function handleTotalChange(val: number) {
    const t = Math.max(6, Math.min(120, val))
    setTotal(t)
    setAllocations(distribute(t, CATEGORIES.length))
  }

  function handleAlloc(index: number, val: number) {
    const next = [...allocations]
    next[index] = Math.max(MIN_PER_CATEGORY, val)
    setAllocations(next)
  }

  function autoDistribute() {
    setAllocations(distribute(total, CATEGORIES.length))
  }

  function handleStart() {
    const settings = { total, allocations }
    localStorage.setItem('bcc_timer_settings', JSON.stringify(settings))
    router.push('/dialog?timer=1')
  }

  const isValid = diff === 0

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">タイマー設定</h1>
            <p className="text-sm text-gray-500">全体時間とカテゴリ別の時間配分を設定</p>
          </div>
        </div>

        {/* 全体時間 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-gray-800">⏱ 全体の時間</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTotalChange(total - 5)}
                className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center font-bold"
              >−</button>
              <span className="text-2xl font-bold text-amber-600 w-16 text-center tabular-nums">{total}分</span>
              <button
                onClick={() => handleTotalChange(total + 5)}
                className="w-8 h-8 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center font-bold"
              >+</button>
            </div>
          </div>
          <input
            type="range"
            min={6} max={120} step={1}
            value={total}
            onChange={(e) => handleTotalChange(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>6分</span><span>60分</span><span>120分</span>
          </div>
        </div>

        {/* カテゴリ別配分 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-gray-800">📋 カテゴリ別の時間</p>
            <button
              onClick={autoDistribute}
              className="text-xs text-amber-600 border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full font-semibold"
            >
              均等に配分
            </button>
          </div>

          <div className="space-y-3">
            {CATEGORIES.map((cat, i) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.emoji}</span>
                    <span className={`text-sm font-semibold ${cat.color}`}>{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAlloc(i, allocations[i] - 1)}
                      className="w-6 h-6 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 flex items-center justify-center text-sm"
                    >−</button>
                    <span className="text-sm font-bold text-gray-700 w-10 text-center tabular-nums">
                      {allocations[i]}分
                    </span>
                    <button
                      onClick={() => handleAlloc(i, allocations[i] + 1)}
                      className="w-6 h-6 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 flex items-center justify-center text-sm"
                    >+</button>
                  </div>
                </div>
                {/* ミニバー */}
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 bg-gradient-to-r ${
                      cat.id === 'know-business' ? 'from-blue-400 to-blue-500' :
                      cat.id === 'know-challenges' ? 'from-purple-400 to-purple-500' :
                      cat.id === 'know-connections' ? 'from-green-400 to-green-500' :
                      cat.id === 'find-contribution' ? 'from-yellow-400 to-amber-500' :
                      cat.id === 'verbalize-support' ? 'from-orange-400 to-orange-500' :
                      'from-red-400 to-rose-500'
                    }`}
                    style={{ width: `${Math.min(100, (allocations[i] / total) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 合計チェック */}
          <div className={`rounded-xl px-4 py-3 flex items-center justify-between text-sm font-semibold ${
            isValid ? 'bg-green-50 text-green-700 border border-green-200' :
            diff > 0 ? 'bg-red-50 text-red-600 border border-red-200' :
            'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <span>カテゴリ合計</span>
            <span>
              {allocSum}分
              {!isValid && (
                <span className="ml-2 font-normal">
                  {diff > 0 ? `（${diff}分 オーバー）` : `（${Math.abs(diff)}分 少ない）`}
                </span>
              )}
              {isValid && ' ✓'}
            </span>
          </div>
        </div>

        {/* スタートボタン */}
        <button
          onClick={handleStart}
          disabled={!isValid}
          className={`w-full py-4 rounded-2xl text-lg font-bold shadow-sm transition-all duration-150 ${
            isValid
              ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isValid ? '▶ タイマーをスタート' : '合計時間を全体時間に合わせてください'}
        </button>

        <Link href="/dialog" className="block text-center text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2">
          タイマーなしで始める
        </Link>
      </div>
    </main>
  )
}
