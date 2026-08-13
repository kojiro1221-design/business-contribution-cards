'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { CARDS, CATEGORIES, getCategoryById, getRandomCard } from '@/data/cards'
import type { Card } from '@/types'
import Timer from '@/components/Timer'
import SessionTimer from '@/components/SessionTimer'
import SupportCards from '@/components/SupportCards'
import CardFace from '@/components/CardFace'

function DialogContent() {
  const params = useSearchParams()
  const cardId = params.get('cardId')
  const mode = params.get('mode')
  const catParam = params.get('cat')         // 元のカテゴリID
  const useSessionTimer = params.get('timer') === '1'

  const [card, setCard] = useState<Card | null>(null)
  const [randomHistory, setRandomHistory] = useState<Card[]>([])
  const [animating, setAnimating] = useState(false)

  const isRandom = mode === 'random'

  // 元カテゴリの次カテゴリを求める
  const currentCatIndex = catParam ? CATEGORIES.findIndex((c) => c.id === catParam) : -1
  const nextCategory = currentCatIndex >= 0 && currentCatIndex < CATEGORIES.length - 1
    ? CATEGORIES[currentCatIndex + 1]
    : null

  useEffect(() => {
    if (isRandom || useSessionTimer) {
      setCard(getRandomCard())
    } else if (cardId) {
      setCard(CARDS.find((c) => c.id === cardId) ?? null)
    }
  }, [cardId, isRandom, useSessionTimer])

  function drawNextRandom() {
    setAnimating(true)
    setTimeout(() => {
      if (card) setRandomHistory((h) => [...h, card])
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

  const backUrl = catParam ? `/cards?cat=${catParam}` : '/cards'

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href={backUrl} className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">対話カード</h1>
            {isRandom && randomHistory.length > 0 && (
              <p className="text-xs text-gray-400">{randomHistory.length + 1}枚目</p>
            )}
          </div>
          <Link href="/memo" className="text-sm text-amber-700 hover:text-amber-900 underline underline-offset-2">
            メモへ 📝
          </Link>
        </div>

        {/* カード */}
        <div className={`transition-all duration-200 ${animating ? 'opacity-0 scale-95 -translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`}>
          <CardFace card={card} index={isRandom ? randomHistory.length + 1 : undefined} />
        </div>

        {/* アクションボタン */}
        {isRandom ? (
          /* ランダムモード：次を引く */
          <div className="flex gap-3 pt-2">
            <button onClick={drawNextRandom} className="btn-primary flex-1">
              🎲 次のカードを引く
            </button>
            <Link href="/cards" className="btn-secondary px-4">
              カテゴリ選択へ
            </Link>
          </div>
        ) : (
          /* カテゴリモード：カード一覧に戻る or 次カテゴリへ */
          <div className="space-y-2 pt-2">
            <Link href={backUrl} className="btn-primary flex items-center justify-center gap-2 w-full">
              ← このカテゴリの他のカードを見る
            </Link>
            {nextCategory && (
              <Link
                href={`/cards?cat=${nextCategory.id}`}
                className="btn-secondary flex items-center justify-center gap-2 w-full"
              >
                次のカテゴリへ
                <span>{nextCategory.emoji}</span>
                <span className="text-sm">{nextCategory.name}</span>
                →
              </Link>
            )}
            {!nextCategory && catParam && (
              <Link href="/memo" className="btn-secondary flex items-center justify-center gap-2 w-full">
                🎉 すべて完了！貢献メモを書く
              </Link>
            )}
          </div>
        )}

        {/* タイマー */}
        {useSessionTimer ? <SessionTimer /> : <Timer />}

        {/* サポートカード */}
        <SupportCards />

        {/* ランダムモードの履歴 */}
        {isRandom && randomHistory.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500">使ったカード</p>
            <div className="space-y-2">
              {randomHistory.map((h, i) => {
                const hCat = getCategoryById(h.categoryId)
                return (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 px-4 py-3 opacity-60">
                    <p className="text-xs text-gray-400 mb-0.5">{hCat?.emoji} {hCat?.name}</p>
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
