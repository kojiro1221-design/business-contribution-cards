'use client'

import { useState } from 'react'
import { SUPPORT_CARDS } from '@/data/cards'

export default function SupportCards() {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
      <p className="text-sm font-bold text-gray-700">💬 サポートカード</p>
      <p className="text-xs text-gray-400">会話が行き詰まったときに使いましょう</p>
      <div className="flex gap-2 flex-wrap">
        {SUPPORT_CARDS.map((card) => (
          <button
            key={card.id}
            onClick={() => setActive(active === card.id ? null : card.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-150 ${
              active === card.id
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            {card.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <p className="text-sm text-amber-800">
            {SUPPORT_CARDS.find((c) => c.id === active)?.description}
          </p>
        </div>
      )}
    </div>
  )
}
