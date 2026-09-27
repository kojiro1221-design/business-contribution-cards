'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES, CARDS, DIRECTION_META } from '@/data/cards'

const CATEGORY_GRADIENTS: Record<string, string> = {
  'know-business':    'from-blue-400 to-blue-600',
  'know-challenges':  'from-purple-400 to-purple-600',
  'know-connections': 'from-green-400 to-green-600',
  'find-contribution':'from-yellow-400 to-amber-500',
  'verbalize-support':'from-orange-400 to-orange-600',
  'next-step':        'from-red-400 to-rose-600',
}

function CardsContent() {
  const router = useRouter()
  const params = useSearchParams()
  const catParam = params.get('cat')

  const initialIndex = catParam
    ? Math.max(0, CATEGORIES.findIndex((c) => c.id === catParam))
    : 0

  const [activeIndex, setActiveIndex] = useState(initialIndex)

  const activeCategory = CATEGORIES[activeIndex]
  const activeCards = CARDS.filter((c) => c.categoryId === activeCategory.id)

  function goToCard(cardId: string) {
    router.push(`/dialog?cardId=${cardId}&cat=${activeCategory.id}`)
  }

  function goNext() {
    if (activeIndex < CATEGORIES.length - 1) {
      setActiveIndex(activeIndex + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goPrev() {
    if (activeIndex > 0) setActiveIndex(activeIndex - 1)
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-5">

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">カードを選ぶ</h1>
            <p className="text-sm text-gray-500">カテゴリを順番に進みましょう</p>
          </div>
          <Link href="/dialog?mode=random" className="text-sm text-amber-700 hover:text-amber-900 underline underline-offset-2">
            🎲 ランダム
          </Link>
        </div>

        {/* ステップインジケーター */}
        <div className="flex items-center gap-1">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setActiveIndex(i)}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <div className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                i < activeIndex ? 'bg-amber-400' :
                i === activeIndex ? 'bg-amber-500' :
                'bg-gray-200'
              }`} />
              <span className={`text-xs hidden sm:block truncate transition-colors ${
                i === activeIndex ? 'text-amber-600 font-bold' : 'text-gray-300'
              }`}>{cat.emoji}</span>
            </button>
          ))}
        </div>

        {/* アクティブカテゴリ */}
        <div className="space-y-3">

          {/* カテゴリヘッダーカード */}
          <div className={`rounded-2xl overflow-hidden shadow-sm`}>
            <div className={`bg-gradient-to-r ${CATEGORY_GRADIENTS[activeCategory.id]} px-5 py-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl drop-shadow">{activeCategory.emoji}</span>
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">{activeCategory.name}</p>
                    <p className="text-white/70 text-xs">
                      STEP {activeIndex + 1} / {CATEGORIES.length}　{activeCards.length}枚
                    </p>
                  </div>
                </div>
                {/* 前後ナビ */}
                <div className="flex gap-1">
                  <button
                    onClick={goPrev}
                    disabled={activeIndex === 0}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center text-sm font-bold"
                  >←</button>
                  <button
                    onClick={goNext}
                    disabled={activeIndex === CATEGORIES.length - 1}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center text-sm font-bold"
                  >→</button>
                </div>
              </div>
            </div>

            {/* 凡例 */}
            <div className="bg-white border-x border-b border-gray-100 px-4 py-2 flex gap-2 flex-wrap">
              {(['ask', 'self', 'both'] as const).map((d) => {
                const m = DIRECTION_META[d]
                return (
                  <span key={d} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${m.bg} ${m.text} ${m.border}`}>
                    {m.icon} {m.label}
                  </span>
                )
              })}
            </div>
          </div>

          {/* カード一覧 */}
          <div className="space-y-2">
            {activeCards.map((card, i) => {
              const dir = DIRECTION_META[card.direction]
              return (
                <button
                  key={card.id}
                  onClick={() => goToCard(card.id)}
                  className={`w-full text-left bg-white rounded-2xl border-2 ${activeCategory.borderColor} px-5 py-4 hover:shadow-md active:scale-95 transition-all duration-150 group`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-gray-300 text-xs font-mono pt-0.5 shrink-0">Q{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-base leading-snug">{card.question}</p>
                      {card.hint && <p className="text-xs text-gray-400 mt-1">{card.hint}</p>}
                    </div>
                    <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${dir.bg} ${dir.text} ${dir.border}`}>
                      {dir.icon}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 次のカテゴリへ */}
          <div className="pt-2">
            {activeIndex < CATEGORIES.length - 1 ? (
              <button
                onClick={goNext}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                次のカテゴリへ
                <span className="text-lg">{CATEGORIES[activeIndex + 1].emoji}</span>
                <span className="font-normal text-sm opacity-80">{CATEGORIES[activeIndex + 1].name}</span>
                <span>→</span>
              </button>
            ) : (
              <Link href="/memo" className="btn-primary block w-full text-center">
                🎉 すべてのカテゴリ完了！貢献メモを書く
              </Link>
            )}
          </div>
        </div>

        {/* 他カテゴリへのジャンプ（折りたたみ） */}
        <details className="group">
          <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 text-center list-none select-none">
            ▾ 他のカテゴリに直接移動する
          </summary>
          <div className="mt-3 space-y-1.5">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => { setActiveIndex(i); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  i === activeIndex
                    ? `${cat.bgColor} ${cat.borderColor} ${cat.color} font-bold`
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span className="text-sm">{cat.name}</span>
                {i < activeIndex && <span className="ml-auto text-xs text-gray-400">✓</span>}
                {i === activeIndex && <span className="ml-auto text-xs font-normal opacity-60">← 現在</span>}
              </button>
            ))}
          </div>
        </details>

      </div>
    </main>
  )
}

export default function CardsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">読み込み中...</p></div>}>
      <CardsContent />
    </Suspense>
  )
}
