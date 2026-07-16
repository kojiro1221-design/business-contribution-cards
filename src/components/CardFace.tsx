'use client'

import type { Card } from '@/types'
import { getCategoryById, DIRECTION_META } from '@/data/cards'

interface Props {
  card: Card
  index?: number
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  'know-business':    'from-blue-400 to-blue-600',
  'know-challenges':  'from-purple-400 to-purple-600',
  'know-connections': 'from-green-400 to-green-600',
  'find-contribution':'from-yellow-400 to-amber-500',
  'verbalize-support':'from-orange-400 to-orange-600',
  'next-step':        'from-red-400 to-rose-600',
}

export default function CardFace({ card, index }: Props) {
  const category = getCategoryById(card.categoryId)
  const dir = DIRECTION_META[card.direction]
  const gradient = CATEGORY_GRADIENTS[card.categoryId] ?? 'from-gray-400 to-gray-600'

  return (
    <div className="relative w-full select-none">
      {/* カード本体 */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">

        {/* カードヘッダー（グラデーション帯） */}
        <div className={`bg-gradient-to-r ${gradient} px-5 pt-5 pb-8`}>
          <div className="flex items-center justify-between">
            {/* カテゴリ */}
            <div className="flex items-center gap-2">
              <span className="text-xl drop-shadow">{category?.emoji}</span>
              <span className="text-white text-xs font-bold tracking-wide drop-shadow">
                {category?.name}
              </span>
            </div>
            {/* カード番号 */}
            {index !== undefined && (
              <span className="text-white/60 text-xs font-mono">
                #{String(index).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        {/* 波形の区切り */}
        <div className={`bg-gradient-to-r ${gradient} h-4`}>
          <svg viewBox="0 0 400 20" className="w-full h-4 fill-white" preserveAspectRatio="none">
            <path d="M0,10 Q50,20 100,10 Q150,0 200,10 Q250,20 300,10 Q350,0 400,10 L400,20 L0,20 Z" />
          </svg>
        </div>

        {/* 質問テキスト */}
        <div className="px-6 py-8 min-h-[160px] flex flex-col justify-center">
          <p className="text-gray-800 text-xl font-bold leading-relaxed text-center">
            {card.question}
          </p>
          {card.hint && (
            <p className="text-gray-400 text-xs text-center mt-4 leading-relaxed">
              {card.hint}
            </p>
          )}
        </div>

        {/* カードフッター */}
        <div className="px-5 pb-5 flex items-center justify-between">
          {/* 向きバッジ */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${dir.bg} ${dir.text} ${dir.border}`}>
            <span>{dir.icon}</span>
            <span>{dir.label}</span>
          </span>

          {/* ロゴマーク */}
          <span className="text-gray-200 text-xs font-medium tracking-widest">BCC</span>
        </div>
      </div>

      {/* カードの影（奥行き演出） */}
      <div className="absolute -bottom-2 left-3 right-3 h-4 bg-gray-200 rounded-b-3xl -z-10 opacity-50" />
      <div className="absolute -bottom-4 left-6 right-6 h-4 bg-gray-100 rounded-b-3xl -z-20 opacity-30" />
    </div>
  )
}
