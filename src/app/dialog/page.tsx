'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { CARDS, getCategoryById, getRandomCard } from '@/data/cards'
import type { Card } from '@/types'
import Timer from '@/components/Timer'
import SessionTimer from '@/components/SessionTimer'
import SupportCards from '@/components/SupportCards'
import CardFace from '@/components/CardFace'

function DialogContent() {
  const params = useSearchParams()
  const cardId = params.get('cardId')
  const mode = params.get('mode')
  const useSessionTimer = params.get('timer') === '1'

  const [card, setCard] = useState<Card | null>(null)
  const [history, setHistory] = useState<Card[]>([])
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (mode === 'random' || useSessionTimer) {
      setCard(getRandomCard())
    } else if (cardId) {
      setCard(CARDS.find((c) => c.id === cardId) ?? null)
    }
  }, [cardId, mode, useSessionTimer])

  function drawNext() {
    setAnimating(true)
    setTimeout(() => {
      if (card) setHistory((h) => [...h, card])
      setCard(getRandomCard())
      setAnimating(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 200)
  }

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">カードを読み込み中...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/cards" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">対話カード</h1>
            {history.length > 0 && (
              <p className="text-xs text-gray-400">{history.length + 1}枚目</p>
            )}
          </div>
          <Link href="/memo" className="text-sm text-amber-700 hover:text-amber-900 underline underline-offset-2">
            メモへ 📝
          </Link>
        </div>

        {/* カード */}
        <div className={`transition-all duration-200 ${animating ? 'opacity-0 scale-95 -translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}>
          <CardFace card={card} index={history.length + 1} />
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3 pt-2">
          <button onClick={drawNext} className="btn-primary flex-1">
            🎲 次のカードを引く
          </button>
          <Link href="/cards" className="btn-secondary px-4">
            選び直す
          </Link>
        </div>

        {/* タイマー（セッションタイマー or 通常タイマー） */}
        {useSessionTimer ? <SessionTimer /> : <Timer />}

        {/* サポートカード */}
        <SupportCards />

        {/* 履歴 */}
        {history.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500">使ったカード</p>
            <div className="space-y-2">
              {history.map((h, i) => {
                const hCat = getCategoryById(h.categoryId)
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 px-4 py-3 opacity-60">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400">{hCat?.emoji} {hCat?.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{h.question}</p>
                  </div>
                )
              })}
            </div>
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
