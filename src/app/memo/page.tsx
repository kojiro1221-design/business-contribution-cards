'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { Memo } from '@/types'

const MEMOS_KEY = 'bcc_memos'
const SESSION_KEY = 'bcc_active_session'

interface ActiveSession {
  id: string
  date: string
  partnerName: string
  business: string
  purpose: string
  items: string[]
  nextAction: string
}

function loadMemos(): Memo[] {
  try { return JSON.parse(localStorage.getItem(MEMOS_KEY) ?? '[]') } catch { return [] }
}
function saveMemos(m: Memo[]) { localStorage.setItem(MEMOS_KEY, JSON.stringify(m)) }
function loadSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function saveSession(s: ActiveSession) { localStorage.setItem(SESSION_KEY, JSON.stringify(s)) }
function clearSession() { localStorage.removeItem(SESSION_KEY) }

export default function MemoPage() {
  const [session, setSession] = useState<ActiveSession | null>(null)
  const [memos, setMemos] = useState<Memo[]>([])
  const [newItem, setNewItem] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [showPast, setShowPast] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const s = loadSession()
    setSession(s)
    if (s) setNextAction(s.nextAction)
    setMemos(loadMemos())
  }, [])

  // セッションが変わるたびに自動保存
  function updateSession(updated: ActiveSession) {
    setSession(updated)
    saveSession(updated)
  }

  function addItem() {
    if (!session || !newItem.trim()) return
    const updated = { ...session, items: [...session.items, newItem.trim()] }
    updateSession(updated)
    setNewItem('')
    inputRef.current?.focus()
  }

  function deleteItem(index: number) {
    if (!session) return
    const items = session.items.filter((_, i) => i !== index)
    updateSession({ ...session, items })
  }

  function handleNextActionChange(val: string) {
    setNextAction(val)
    if (session) updateSession({ ...session, nextAction: val })
  }

  function endSession() {
    if (!session) return
    const memo: Memo = {
      id: session.id,
      date: session.date,
      partnerName: session.partnerName,
      contributions: session.items.join('\n'),
      nextAction: session.nextAction,
    }
    const updated = [memo, ...loadMemos()]
    saveMemos(updated)
    setMemos(updated)
    clearSession()
    setSession(null)
    setNextAction('')
  }

  function copyMemo(memo: Memo) {
    const text = [
      `【貢献メモ】${memo.date}`,
      `相手：${memo.partnerName}`,
      '',
      '【できる貢献・紹介】',
      memo.contributions,
      '',
      '【次のアクション】',
      memo.nextAction,
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopied(memo.id)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  function deleteMemo(id: string) {
    if (!confirm('このメモを削除しますか？')) return
    const updated = memos.filter((m) => m.id !== id)
    setMemos(updated)
    saveMemos(updated)
  }

  // ── セッション中の画面 ──────────────────────────────────────
  if (session) {
    return (
      <main className="min-h-screen px-4 py-8">
        <div className="max-w-lg mx-auto space-y-5">

          {/* ヘッダー */}
          <div className="flex items-center gap-3">
            <Link href="/cards" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">貢献メモ</h1>
              <p className="text-xs text-gray-500">セッション進行中 • 気づいたらすぐ追記</p>
            </div>
          </div>

          {/* 相手情報 */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 space-y-1">
            <p className="text-xs font-bold text-amber-700">👤 相手</p>
            <p className="font-bold text-gray-900">{session.partnerName || '（名前未設定）'}</p>
            {session.business && <p className="text-xs text-gray-500">{session.business}</p>}
            {session.purpose && <p className="text-xs text-amber-700">🎯 {session.purpose}</p>}
          </div>

          {/* メモ追加エリア */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
            <p className="font-bold text-gray-800">💡 できる貢献・気づき</p>

            {/* 追加済みリスト */}
            {session.items.length > 0 && (
              <ul className="space-y-2">
                {session.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 group">
                    <span className="text-amber-500 mt-0.5 shrink-0">•</span>
                    <span className="text-sm text-gray-800 flex-1 leading-relaxed">{item}</span>
                    <button
                      onClick={() => deleteItem(i)}
                      className="text-gray-300 hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100 text-xs"
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}

            {session.items.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">
                対話の中で気づいた貢献を追記しましょう
              </p>
            )}

            {/* 入力フォーム */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
                placeholder="例：〇〇さんをご紹介できる"
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <button
                onClick={addItem}
                disabled={!newItem.trim()}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                + 追加
              </button>
            </div>
          </div>

          {/* 次のアクション */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            <p className="font-bold text-gray-800">🚀 次のアクション</p>
            <textarea
              value={nextAction}
              onChange={(e) => handleNextActionChange(e.target.value)}
              placeholder="例：今週中に〇〇さんにLINEで連絡する"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
            />
          </div>

          {/* セッション終了ボタン */}
          <button
            onClick={endSession}
            className="w-full py-4 rounded-2xl text-base font-bold border-2 border-amber-500 text-amber-600 hover:bg-amber-50 active:bg-amber-100 transition-colors"
          >
            ✅ セッションを終了してメモを保存する
          </button>

          {/* 過去メモへのリンク */}
          {memos.length > 0 && (
            <button
              onClick={() => setShowPast(!showPast)}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2"
            >
              {showPast ? '▲ 過去のメモを閉じる' : `▾ 過去のメモを見る（${memos.length}件）`}
            </button>
          )}

          {showPast && <PastMemoList memos={memos} onCopy={copyMemo} onDelete={deleteMemo} copied={copied} />}

        </div>
      </main>
    )
  }

  // ── セッションなし（過去メモ一覧） ─────────────────────────
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-5">

        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">貢献メモ</h1>
            <p className="text-xs text-gray-500">過去の対話メモ</p>
          </div>
          <Link href="/session-start" className="btn-primary py-2 px-4 text-sm">
            + 新規セッション
          </Link>
        </div>

        {memos.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <div className="text-5xl">📝</div>
            <p className="text-gray-400 text-sm">まだメモがありません</p>
            <Link href="/session-start" className="btn-primary inline-block px-6 py-2 text-sm mt-2">
              最初のセッションを始める
            </Link>
          </div>
        ) : (
          <PastMemoList memos={memos} onCopy={copyMemo} onDelete={deleteMemo} copied={copied} />
        )}

      </div>
    </main>
  )
}

function PastMemoList({ memos, onCopy, onDelete, copied }: {
  memos: Memo[]
  onCopy: (m: Memo) => void
  onDelete: (id: string) => void
  copied: string | null
}) {
  return (
    <div className="space-y-3">
      {memos.map((memo) => (
        <div key={memo.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs text-gray-400">{memo.date}</p>
              <p className="font-bold text-gray-900 mt-0.5">{memo.partnerName || '（名前未設定）'}</p>
            </div>
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onCopy(memo)}
                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  copied === memo.id ? 'bg-green-50 text-green-600 border-green-200' : 'text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {copied === memo.id ? '✓ コピー済み' : 'コピー'}
              </button>
              <button onClick={() => onDelete(memo.id)} className="text-xs px-2.5 py-1.5 rounded-lg border text-red-400 border-red-200 hover:bg-red-50">削除</button>
            </div>
          </div>

          {memo.contributions && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-amber-700">💡 できる貢献・紹介</p>
              <ul className="space-y-1">
                {memo.contributions.split('\n').filter(Boolean).map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {memo.nextAction && (
            <div className="bg-amber-50 rounded-xl px-3 py-2 space-y-1">
              <p className="text-xs font-semibold text-amber-700">🚀 次のアクション</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{memo.nextAction}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
