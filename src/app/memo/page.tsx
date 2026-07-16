'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Memo } from '@/types'

const STORAGE_KEY = 'bcc_memos'
const PARTNER_KEY = 'bcc_partner_info'

interface PartnerInfo {
  name: string
  company: string
  business: string
  purpose: string
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function loadMemos(): Memo[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}

function saveMemos(memos: Memo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
}

function loadPartner(): PartnerInfo | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PARTNER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function clearPartner() {
  localStorage.removeItem(PARTNER_KEY)
}

function today() {
  return new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function MemoPage() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [editing, setEditing] = useState<Memo | null>(null)
  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo | null>(null)
  const [preNotes, setPreNotes] = useState('')   // 事前メモ（編集中のみ表示）
  const [copied, setCopied] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'edit'>('list')
  const [showDraft, setShowDraft] = useState(false)

  useEffect(() => {
    setMemos(loadMemos())
    const p = loadPartner()
    if (p && p.name) {
      setPartnerInfo(p)
      setShowDraft(true)
    }
  }, [])

  function startFromPartner() {
    if (!partnerInfo) return
    const m: Memo = {
      id: generateId(),
      date: today(),
      partnerName: [partnerInfo.name, partnerInfo.company].filter(Boolean).join('（') + (partnerInfo.company ? '）' : ''),
      contributions: '',
      nextAction: '',
    }
    setEditing(m)
    setPreNotes([
      partnerInfo.business ? `【事業メモ】${partnerInfo.business}` : '',
      partnerInfo.purpose  ? `【今日のテーマ】${partnerInfo.purpose}` : '',
    ].filter(Boolean).join('\n'))
    setView('edit')
    setShowDraft(false)
  }

  function newMemo() {
    setEditing({
      id: generateId(),
      date: today(),
      partnerName: '',
      contributions: '',
      nextAction: '',
    })
    setPreNotes('')
    setView('edit')
    setShowDraft(false)
  }

  function saveMemo() {
    if (!editing) return
    const updated = memos.some((m) => m.id === editing.id)
      ? memos.map((m) => (m.id === editing.id ? editing : m))
      : [editing, ...memos]
    setMemos(updated)
    saveMemos(updated)
    clearPartner()
    setPartnerInfo(null)
    setEditing(null)
    setView('list')
  }

  function deleteMemo(id: string) {
    if (!confirm('このメモを削除しますか？')) return
    const updated = memos.filter((m) => m.id !== id)
    setMemos(updated)
    saveMemos(updated)
  }

  function copyMemo(memo: Memo) {
    const text = `【貢献メモ】${memo.date}\n相手：${memo.partnerName}\n\n【できる貢献・紹介】\n${memo.contributions}\n\n【次のアクション】\n${memo.nextAction}`
    navigator.clipboard.writeText(text).then(() => {
      setCopied(memo.id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  function editMemo(memo: Memo) {
    setEditing({ ...memo })
    setPreNotes('')
    setView('edit')
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-5">

        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">貢献メモ</h1>
            <p className="text-xs text-gray-500">対話から生まれた貢献の接点を記録</p>
          </div>
          {view === 'list' && (
            <button onClick={newMemo} className="btn-primary py-2 px-4 text-sm">
              + 新規作成
            </button>
          )}
        </div>

        {/* 事前入力があった場合の誘導バナー */}
        {showDraft && partnerInfo && view === 'list' && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">✨</span>
              <p className="font-bold text-amber-800">今日の対話相手のメモを作成しましょう</p>
            </div>
            <div className="bg-white rounded-xl border border-amber-200 px-4 py-3 space-y-1 text-sm">
              <p className="font-bold text-gray-800">
                {partnerInfo.name}
                {partnerInfo.company && <span className="font-normal text-gray-500 ml-1">（{partnerInfo.company}）</span>}
              </p>
              {partnerInfo.business && <p className="text-gray-500 text-xs">{partnerInfo.business}</p>}
              {partnerInfo.purpose && <p className="text-amber-700 text-xs">🎯 {partnerInfo.purpose}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={startFromPartner} className="btn-primary flex-1 py-2.5 text-sm">
                このメモを書く →
              </button>
              <button
                onClick={() => { setShowDraft(false); clearPartner(); setPartnerInfo(null) }}
                className="text-xs text-gray-400 hover:text-gray-600 px-3"
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* 編集画面 */}
        {view === 'edit' && editing && (
          <div className="space-y-4">

            {/* 相手情報（事前メモ参照） */}
            {preNotes && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 space-y-1">
                <p className="text-xs font-bold text-amber-700">📋 事前メモ（参考）</p>
                <p className="text-xs text-amber-800 whitespace-pre-wrap leading-relaxed">{preNotes}</p>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">相手の名前・会社</label>
              <input
                type="text"
                value={editing.partnerName}
                onChange={(e) => setEditing({ ...editing, partnerName: e.target.value })}
                placeholder="例：山田太郎さん（株式会社〇〇）"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">できる貢献・紹介・支援</label>
              <textarea
                value={editing.contributions}
                onChange={(e) => setEditing({ ...editing, contributions: e.target.value })}
                placeholder="例：・〇〇さんをご紹介できる&#10;・〇〇の情報を共有する&#10;・〇〇のコミュニティに招待する"
                rows={5}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">次のアクション</label>
              <textarea
                value={editing.nextAction}
                onChange={(e) => setEditing({ ...editing, nextAction: e.target.value })}
                placeholder="例：今週中に〇〇さんにLINEで連絡する"
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={saveMemo} className="btn-primary flex-1">保存する</button>
              <button
                onClick={() => { setEditing(null); setView('list') }}
                className="btn-secondary px-4"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        {/* リスト画面 */}
        {view === 'list' && (
          <div className="space-y-3">
            {memos.length === 0 && !showDraft ? (
              <div className="text-center py-16 space-y-3">
                <div className="text-5xl">📝</div>
                <p className="text-gray-400 text-sm">まだメモがありません</p>
                <p className="text-gray-400 text-xs">対話後に貢献メモを記録しましょう</p>
                <button onClick={newMemo} className="btn-primary mt-2 px-6 py-2 text-sm">
                  最初のメモを作る
                </button>
              </div>
            ) : (
              memos.map((memo) => (
                <div key={memo.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs text-gray-400">{memo.date}</p>
                      <p className="font-bold text-gray-900 mt-0.5">{memo.partnerName || '（名前未設定）'}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => copyMemo(memo)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                          copied === memo.id ? 'bg-green-50 text-green-600 border-green-200' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {copied === memo.id ? 'コピー済み ✓' : 'コピー'}
                      </button>
                      <button onClick={() => editMemo(memo)} className="text-xs px-2.5 py-1.5 rounded-lg border text-amber-600 border-amber-200 hover:bg-amber-50">編集</button>
                      <button onClick={() => deleteMemo(memo.id)} className="text-xs px-2.5 py-1.5 rounded-lg border text-red-400 border-red-200 hover:bg-red-50">削除</button>
                    </div>
                  </div>

                  {memo.contributions && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-amber-700">できる貢献・紹介</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{memo.contributions}</p>
                    </div>
                  )}

                  {memo.nextAction && (
                    <div className="bg-amber-50 rounded-xl px-3 py-2 space-y-1">
                      <p className="text-xs font-semibold text-amber-700">次のアクション</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{memo.nextAction}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  )
}
