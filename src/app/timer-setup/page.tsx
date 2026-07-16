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

export interface PartnerInfo {
  name: string
  company: string
  business: string
  purpose: string
}

export default function TimerSetupPage() {
  const router = useRouter()
  const [total, setTotal] = useState(DEFAULT_TOTAL)
  const [allocations, setAllocations] = useState<number[]>(() => distribute(DEFAULT_TOTAL, CATEGORIES.length))
  const [partner, setPartner] = useState<PartnerInfo>({ name: '', company: '', business: '', purpose: '' })

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

  function handleStart(withTimer: boolean) {
    // 相手情報を保存
    localStorage.setItem('bcc_partner_info', JSON.stringify(partner))
    // タイマー設定を保存
    if (withTimer) {
      localStorage.setItem('bcc_timer_settings', JSON.stringify({ total, allocations }))
      router.push('/dialog?timer=1')
    } else {
      router.push('/dialog')
    }
  }

  const isValid = diff === 0
  const hasPartner = partner.name.trim() !== ''

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">セッション準備</h1>
            <p className="text-sm text-gray-500">相手の情報とタイマーを設定してから始めましょう</p>
          </div>
        </div>

        {/* ステップ1：相手の情報 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <p className="font-bold text-gray-800">相手の情報を入力する</p>
            <span className="text-xs text-gray-400 ml-auto">対話後のメモに自動入力されます</span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">お名前 <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={partner.name}
                  onChange={(e) => setPartner({ ...partner, name: e.target.value })}
                  placeholder="山田太郎"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">会社・屋号</label>
                <input
                  type="text"
                  value={partner.company}
                  onChange={(e) => setPartner({ ...partner, company: e.target.value })}
                  placeholder="株式会社〇〇"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">事業・仕事の概要（事前メモ）</label>
              <textarea
                value={partner.business}
                onChange={(e) => setPartner({ ...partner, business: e.target.value })}
                placeholder="例：〇〇業、△△をされている方"
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">今日の対話で聞きたいこと・テーマ</label>
              <textarea
                value={partner.purpose}
                onChange={(e) => setPartner({ ...partner, purpose: e.target.value })}
                placeholder="例：新サービスへのフィードバックを聞きたい"
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ステップ2：全体時間 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <p className="font-bold text-gray-800">全体の時間</p>
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleTotalChange(total - 5)}
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center font-bold text-lg"
            >−</button>
            <span className="text-3xl font-bold text-amber-600 tabular-nums">{total}分</span>
            <button
              onClick={() => handleTotalChange(total + 5)}
              className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center font-bold text-lg"
            >+</button>
          </div>
          <input
            type="range" min={6} max={120} step={1} value={total}
            onChange={(e) => handleTotalChange(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>6分</span><span>60分</span><span>120分</span>
          </div>
        </div>

        {/* ステップ3：カテゴリ別配分 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
            <p className="font-bold text-gray-800">カテゴリ別の時間配分</p>
            <button
              onClick={autoDistribute}
              className="text-xs text-amber-600 border border-amber-300 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-full font-semibold ml-auto"
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
                      className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 flex items-center justify-center"
                    >−</button>
                    <span className="text-sm font-bold text-gray-700 w-10 text-center tabular-nums">{allocations[i]}分</span>
                    <button
                      onClick={() => handleAlloc(i, allocations[i] + 1)}
                      className="w-7 h-7 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 flex items-center justify-center"
                    >+</button>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 bg-gradient-to-r ${
                      cat.id === 'know-business'    ? 'from-blue-400 to-blue-500' :
                      cat.id === 'know-challenges'  ? 'from-purple-400 to-purple-500' :
                      cat.id === 'know-connections' ? 'from-green-400 to-green-500' :
                      cat.id === 'find-contribution'? 'from-yellow-400 to-amber-500' :
                      cat.id === 'verbalize-support'? 'from-orange-400 to-orange-500' :
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
              {!isValid && <span className="ml-2 font-normal">{diff > 0 ? `（${diff}分 オーバー）` : `（${Math.abs(diff)}分 少ない）`}</span>}
              {isValid && ' ✓'}
            </span>
          </div>
        </div>

        {/* スタートボタン */}
        <div className="space-y-3">
          <button
            onClick={() => handleStart(true)}
            disabled={!isValid || !hasPartner}
            className={`w-full py-4 rounded-2xl text-lg font-bold shadow-sm transition-all duration-150 ${
              isValid && hasPartner
                ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {!hasPartner ? 'お名前を入力してください' : !isValid ? '合計時間を全体時間に合わせてください' : '▶ タイマーをスタート'}
          </button>

          <button
            onClick={() => handleStart(false)}
            disabled={!hasPartner}
            className={`w-full py-3 rounded-2xl text-base font-semibold border transition-all duration-150 ${
              hasPartner
                ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            タイマーなしで始める
          </button>
        </div>

      </div>
    </main>
  )
}
