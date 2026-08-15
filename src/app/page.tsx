import Link from 'next/link'

export default function TopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center space-y-8">

        {/* ロゴ・タイトル */}
        <div className="space-y-3">
          <div className="text-6xl">🃏</div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            Business<br />Contribution Cards
          </h1>
          <p className="text-amber-700 font-medium text-sm tracking-wide">
            〜 貢献につながる対話カード 〜
          </p>
        </div>

        {/* キャッチコピー */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm px-6 py-5 space-y-2">
          <p className="text-gray-700 text-base leading-relaxed">
            相手を知ることで、<span className="text-amber-600 font-bold">貢献が見つかる</span>。<br />
            だから、また会いたくなる。
          </p>
          <p className="text-gray-500 text-sm leading-relaxed">
            ビジネス交流会や1to1で、相手の事業・課題・求めるつながりを知り、
            自分ができる「貢献の接点」を見つけるカード型対話ツール
          </p>
        </div>

        {/* メインボタン */}
        <div className="space-y-3">
          <Link href="/session-start" className="btn-primary block w-full text-center text-lg">
            ▶ セッションを始める
          </Link>
          <Link href="/dialog?mode=random" className="btn-secondary block w-full text-center">
            🎲 ランダムに1枚引く
          </Link>
        </div>

        {/* サブリンク */}
        <div className="flex justify-center gap-6 text-sm">
          <Link href="/memo" className="text-amber-700 hover:text-amber-900 underline underline-offset-2">
            貢献メモ 📝
          </Link>
          <Link href="/howto" className="text-amber-700 hover:text-amber-900 underline underline-offset-2">
            使い方 ❓
          </Link>
        </div>

      </div>
    </main>
  )
}
