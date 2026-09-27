'use client'

import { useEffect, useRef, useState } from 'react'

const SESSION_KEY = 'bcc_active_session'

interface ActiveSession {
  id: string
  date: string
  partnerName: string
  business: string
  purpose: string
  items: string[]
  nextActions: string[]
}

function loadSession(): ActiveSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveSession(s: ActiveSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export default function MemoSheet() {
  const [open, setOpen] = useState(false)
  const [session, setSession] = useState<ActiveSession | null>(null)
  const [newItem, setNewItem] = useState('')
  const [newNextAction, setNewNextAction] = useState('')
  const [tab, setTab] = useState<'items' | 'next'>('items')
  const inputRef = useRef<HTMLInputElement>(null)
  const nextRef = useRef<HTMLInputElement>(null)

  // セッション状態を定期的に同期（他ページでの変更も反映）
  useEffect(() => {
    const sync = () => setSession(loadSession())
    sync()
    const id = setInterval(sync, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open, tab])

  function updateSession(updated: ActiveSession) {
    setSession(updated)
    saveSession(updated)
  }

  function addItem() {
    if (!session || !newItem.trim()) return
    updateSession({ ...session, items: [...session.items, newItem.trim()] })
    setNewItem('')
    inputRef.current?.focus()
  }

  function deleteItem(i: number) {
    if (!session) return
    updateSession({ ...session, items: session.items.filter((_, idx) => idx !== i) })
  }

  function addNextAction() {
    if (!session || !newNextAction.trim()) return
    updateSession({ ...session, nextActions: [...session.nextActions, newNextAction.trim()] })
    setNewNextAction('')
    nextRef.current?.focus()
  }

  function deleteNextAction(i: number) {
    if (!session) return
    updateSession({ ...session, nextActions: session.nextActions.filter((_, idx) => idx !== i) })
  }

  // セッションなし → ボタン非表示
  if (!session) return null

  const totalCount = session.items.length + session.nextActions.length

  return (
    <>
      {/* フローティングボタン */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-4 z-40 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold px-4 py-3 rounded-full shadow-lg transition-all"
        >
          <span className="text-lg leading-none">📝</span>
          <span className="text-sm">メモ</span>
          {totalCount > 0 && (
            <span className="bg-white text-amber-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
              {totalCount}
            </span>
          )}
        </button>
      )}

      {/* オーバーレイ */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* 背景 */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* パネル本体 */}
          <div className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[75vh]">

            {/* ハンドル＆ヘッダー */}
            <div className="px-5 pt-3 pb-2 shrink-0">
              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">貢献メモ</p>
                  {session.partnerName && (
                    <p className="text-xs text-gray-500">👤 {session.partnerName}</p>
                  )}
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>

              {/* タブ */}
              <div className="flex gap-1 mt-3 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setTab('items')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    tab === 'items' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  💡 貢献・気づき
                  {session.items.length > 0 && <span className="ml-1 text-amber-500">({session.items.length})</span>}
                </button>
                <button
                  onClick={() => setTab('next')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    tab === 'next' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  🚀 次のアクション
                  {session.nextActions.length > 0 && <span className="ml-1 text-amber-500">({session.nextActions.length})</span>}
                </button>
              </div>
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
              {tab === 'items' && (
                <>
                  {session.items.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      気づいた貢献を追加しましょう
                    </p>
                  )}
                  {session.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 group bg-amber-50 rounded-xl px-3 py-2.5">
                      <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                      <span className="text-sm text-gray-800 flex-1 leading-relaxed">{item}</span>
                      <button
                        onClick={() => deleteItem(i)}
                        className="text-gray-300 hover:text-red-400 shrink-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
                    </div>
                  ))}
                </>
              )}

              {tab === 'next' && (
                <>
                  {session.nextActions.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">
                      次のアクションを追加しましょう
                    </p>
                  )}
                  {session.nextActions.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 group bg-amber-50 rounded-xl px-3 py-2.5">
                      <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                      <span className="text-sm text-gray-800 flex-1 leading-relaxed">{item}</span>
                      <button
                        onClick={() => deleteNextAction(i)}
                        className="text-gray-300 hover:text-red-400 shrink-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >✕</button>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* 入力エリア */}
            <div className="px-5 py-3 border-t border-gray-100 shrink-0 pb-safe">
              {tab === 'items' && (
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
              )}
              {tab === 'next' && (
                <div className="flex gap-2">
                  <input
                    ref={nextRef}
                    type="text"
                    value={newNextAction}
                    onChange={(e) => setNewNextAction(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNextAction() } }}
                    placeholder="例：今週中に〇〇さんにLINEする"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    onClick={addNextAction}
                    disabled={!newNextAction.trim()}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shrink-0"
                  >
                    + 追加
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
