'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { CARDS, getCategoryById, getRandomCard } from '@/data/cards'
import type { Card } from '@/types'
import Timer from '@/components/Timer'
import SupportCards from '@/components/SupportCards'

function DialogContent() {
  const params = useSearchParams()
  const router = useRouter()
  const cardId = params.get('cardId')
  const mode = params.get('mode')

  const [card, setCard] = useState<Card | null>(null)
  const [history, setHistory] = useState<Card[]>([])

  useEffect(() => {
    if (mode === 'random') {
      const c = getRandomCard()
      setCard(c)
    } else if (cardId) {
      const c = CARDS.find((c) => c.id === cardId) ?? null
      setCard(c)
    }
  }, [cardId, mode])

  function drawNext() {
    if (card) setHistory((h) => [...h, card])
    const next = getRandomCard()
    setCard(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">カードを読み込み中...</p>
      </div>
    )
  }

  const category = getCategoryById(card.categoryId)

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-5">
        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/cards" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">対話カード</h1>
            {history.length > 0 && (
              <p className="text-xs text-gray-400">{history.length}枚目を使用中</p>
            )}
          </div>
          <Link
            href="/memo"
            className="ml-auto text-sm text-amber-700 hover:text-amber-900 underline underline-offset-2"
          >
            メモへ 📝
          </Link>
        </div>

        {/* カテゴリバッジ */}
        {category && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${category.bgColor} ${category.color} border ${category.borderColor}`}>
            <span>{category.emoji}</span>
            <span>{category.name}</span>
          </div>
        )}

        {/* メインカード */}
        {category && (
          <div className={`card-base ${category.bgColor} ${category.borderColor} p-8 text-center space-y-4 min-h-[220px] flex flex-col justify-center`}>
            <p className={`text-2xl font-bold leading-relaxed ${category.color}`}>
              {card.question}
            </p>
            {card.hint && (
              <p className="text-sm text-gray-500 mt-2">{card.hint}</p>
            )}
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex gap-3">
          <button
            onClick={drawNext}
            className="btn-primary flex-1"
          >
            🎲 次のカードを引く
          </button>
          <Link href="/cards" className="btn-secondary px-4">
            選び直す
          </Link>
        </div>

        {/* タイマー */}
        <Timer />

        {/* サポートカード */}
        <SupportCards />

        {/* 履歴 */}
        {history.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-bold text-gray-500">使ったカード</p>
            {history.map((h, i) => {
              const hCat = getCategoryById(h.categoryId)
              return (
                <div key={i} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400">{hCat?.emoji} {hCat?.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{h.question}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* メモへ誘導 */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-center space-y-2">
          <p className="text-sm text-amber-800">対話が終わったら貢献メモを書きましょう</p>
          <Link href="/memo" className="btn-primary inline-block px-6 py-2 text-sm">
            貢献メモを書く 📝
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function DialogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">読み込み中...</p></div>}>
      <DialogContent />
    </Suspense>
  )
}
