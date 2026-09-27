'use client'

import { useEffect, useState } from 'react'

const ADMIN_PASSWORD = 'bcc-admin'
const STORAGE_KEY = 'bcc_auth'

function getTodayPassword() {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  return `bcc${mm}${dd}`
}

function isAuthenticated(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    const { password, date } = JSON.parse(raw)
    // 固定パスワードで認証済み
    if (password === ADMIN_PASSWORD) return true
    // 日付パスワードで認証済み → 今日の日付と一致するか確認
    const today = new Date().toDateString()
    return password === getTodayPassword() && date === today
  } catch {
    return false
  }
}

function saveAuth(password: string) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    password,
    date: new Date().toDateString(),
  }))
}

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    setChecking(false)
    if (isAuthenticated()) setUnlocked(true)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const today = getTodayPassword()
    if (input === ADMIN_PASSWORD || input === today) {
      saveAuth(input)
      setUnlocked(true)
      setError(false)
    } else {
      setError(true)
      setInput('')
    }
  }

  if (checking) return null

  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-amber-50">
      <div className="max-w-sm w-full space-y-8">

        {/* ロゴ */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🃏</div>
          <h1 className="text-xl font-bold text-gray-900">Business Contribution Cards</h1>
          <p className="text-sm text-amber-700">〜 貢献につながる対話カード 〜</p>
        </div>

        {/* パスワード入力 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700 text-center">
            パスワードを入力してください
          </p>

          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="password"
            autoFocus
            className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-center tracking-widest ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
          />

          {error && (
            <p className="text-xs text-red-500 text-center">パスワードが正しくありません</p>
          )}

          <button
            type="submit"
            disabled={!input}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            入室する
          </button>
        </form>

      </div>
    </div>
  )
}
