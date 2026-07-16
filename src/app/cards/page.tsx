'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CATEGORIES, CARDS, getCategoryById, DIRECTION_META } from '@/data/cards'

export default function CardsPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categoryCards = selectedCategory ? CARDS.filter((c) => c.categoryId === selectedCategory) : []
  const category = selectedCategory ? getCategoryById(selectedCategory) : null

  function handleCardClick(cardId: string) {
    router.push(`/dialog?cardId=${cardId}`)
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">カードを選ぶ</h1>
            <p className="text-sm text-gray-500">カテゴリを選んでカードを引きましょう</p>
          </div>
        </div>

        {/* カテゴリ選択 */}
        {!selectedCategory && (
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const count = CARDS.filter((c) => c.categoryId === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left card-base ${cat.bgColor} ${cat.borderColor} px-5 py-4 hover:shadow-md active:scale-95`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.emoji}</span>
                      <span className={`font-bold text-base ${cat.color}`}>{cat.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{count}枚 →</span>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* カード一覧 */}
        {selectedCategory && category && (
          <div className="space-y-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-amber-600 hover:text-amber-800 text-sm underline"
            >
              ← カテゴリに戻る
            </button>

            <div className={`rounded-xl px-4 py-3 ${category.bgColor} border ${category.borderColor}`}>
              <span className="text-lg mr-2">{category.emoji}</span>
              <span className={`font-bold ${category.color}`}>{category.name}</span>
            </div>

            {/* 凡例 */}
            <div className="flex flex-wrap gap-2 py-1">
              {(['ask', 'self', 'both'] as const).map((d) => {
                const m = DIRECTION_META[d]
                return (
                  <span key={d} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${m.bg} ${m.text} ${m.border}`}>
                    {m.icon} {m.label}
                  </span>
                )
              })}
            </div>

            <div className="space-y-2">
              {categoryCards.map((card) => {
                const dir = DIRECTION_META[card.direction]
                return (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`w-full text-left bg-white rounded-2xl border-2 ${category.borderColor} px-5 py-4 hover:shadow-md active:scale-95 transition-all duration-150`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-gray-800 text-base leading-snug flex-1">{card.question}</p>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold border ${dir.bg} ${dir.text} ${dir.border}`}>
                        {dir.icon}
                      </span>
                    </div>
                    {card.hint && (
                      <p className="text-xs text-gray-400 mt-1.5">{card.hint}</p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ランダムボタン */}
        <div className="pt-2">
          <Link href="/dialog?mode=random" className="btn-secondary block w-full text-center">
            🎲 ランダムに1枚引く
          </Link>
        </div>
      </div>
    </main>
  )
}
