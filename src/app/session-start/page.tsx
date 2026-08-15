'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export default function SessionStartPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [business, setBusiness] = useState('')
  const [purpose, setPurpose] = useState('')

  function handleStart() {
    const session = {
      id: generateId(),
      date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      partnerName: [name.trim(), company.trim()].filter(Boolean).join('（') + (company.trim() ? '）' : ''),
      business: business.trim(),
      purpose: purpose.trim(),
      items: [] as string[],
      nextAction: '',
    }
    localStorage.setItem('bcc_active_session', JSON.stringify(session))
    router.push('/cards')
  }

  function skipStart() {
    // セッション情報なしでカードへ
    localStorage.removeItem('bcc_active_session')
    router.push('/cards')
  }

  const canStart = name.trim() !== ''

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">セッション開始</h1>
            <p className="text-sm text-gray-500">相手の情報を入力してから始めましょう</p>
          </div>
        </div>

        {/* 相手情報入力 */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
          <p className="font-bold text-gray-800">👤 相手の情報</p>
          <p className="text-xs text-gray-400 -mt-2">セッション中のメモに自動で引き継がれます</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">お名前 <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="山田太郎"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600">会社・屋号</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="株式会社〇〇"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">事業・仕事の概要（事前メモ）</label>
            <textarea
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="例：〇〇業、△△をされている方"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">今日の対話テーマ・聞きたいこと</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="例：新サービスへのフィードバックを聞きたい"
              rows={2}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>

        {/* ボタン */}
        <div className="space-y-3">
          <button
            onClick={handleStart}
            disabled={!canStart}
            className={`w-full py-4 rounded-2xl text-lg font-bold shadow-sm transition-all ${
              canStart
                ? 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {canStart ? '▶ セッションを開始する' : 'お名前を入力してください'}
          </button>
          <button
            onClick={skipStart}
            className="w-full py-3 rounded-2xl text-sm text-gray-400 hover:text-gray-600 underline underline-offset-2"
          >
            入力せずに始める
          </button>
        </div>

      </div>
    </main>
  )
}
