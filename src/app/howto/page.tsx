import Link from 'next/link'

const STEPS = [
  {
    step: '01',
    title: 'カードを選ぶ',
    desc: 'カテゴリ別にカードを選ぶか、ランダムに1枚引きましょう。6つのカテゴリから対話の目的に合わせて選べます。',
    emoji: '🃏',
  },
  {
    step: '02',
    title: '相手に質問する',
    desc: 'カードに書かれた質問を相手に聞いてみましょう。サポートカード（〇〇とは？/他には？/なぜ？）で深掘りできます。',
    emoji: '💬',
  },
  {
    step: '03',
    title: 'タイマーで時間管理',
    desc: '5・10・15分のタイマーを使って、対話の時間を意識しましょう。限られた時間が集中した会話を生みます。',
    emoji: '⏱',
  },
  {
    step: '04',
    title: '貢献メモを書く',
    desc: '対話後に「自分ができる貢献」と「次のアクション」を記録しましょう。メモはコピーして相手に送ることもできます。',
    emoji: '📝',
  },
]

const CATEGORIES = [
  { emoji: '🏢', name: '事業を知る', desc: '相手の事業・強み・価値を理解する' },
  { emoji: '🔍', name: '課題を知る', desc: '今の悩みや壁・目標を探る' },
  { emoji: '🤝', name: '求めるつながりを知る', desc: '欲しいご縁・コラボの可能性を知る' },
  { emoji: '💡', name: '貢献の接点を探る', desc: '自分にできる紹介・情報・支援を考える' },
  { emoji: '✍️', name: '紹介・支援を言語化する', desc: '相手を紹介するための言葉を作る' },
  { emoji: '🚀', name: '次の一歩を決める', desc: '対話後のアクションを明確にする' },
]

export default function HowToPage() {
  return (
    <main className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto space-y-8">
        {/* ヘッダー */}
        <div className="flex items-center gap-3">
          <Link href="/" className="text-amber-600 hover:text-amber-800 text-2xl leading-none">←</Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">使い方</h1>
            <p className="text-xs text-gray-500">Business Contribution Cards の使い方ガイド</p>
          </div>
        </div>

        {/* コンセプト */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-5 text-center space-y-2">
          <p className="text-lg font-bold text-amber-800">
            相手を知ることで、貢献が見つかる。
          </p>
          <p className="text-sm text-amber-700">
            だから、また会いたくなる。
          </p>
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            このカードは、ビジネス交流会や1to1での対話を
            「与えること」を意識した会話に変えるためのツールです。
          </p>
        </div>

        {/* 使い方ステップ */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-800">使い方ステップ</h2>
          {STEPS.map((s) => (
            <div key={s.step} className="bg-white rounded-2xl border border-gray-200 shadow-sm px-5 py-4 flex gap-4 items-start">
              <div className="shrink-0">
                <span className="text-2xl">{s.emoji}</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">STEP {s.step}</span>
                  <span className="font-bold text-gray-900 text-sm">{s.title}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* カテゴリ一覧 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-800">6つのカテゴリ</h2>
          <div className="space-y-2">
            {CATEGORIES.map((c) => (
              <div key={c.name} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                <span className="text-xl">{c.emoji}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* サポートカード */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-800">サポートカードの使い方</h2>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-3">
            {[
              { label: '〇〇とは？', use: '相手が使った言葉の定義を確認するとき' },
              { label: '他には？', use: 'もう少し深掘りしたいとき、他のアイデアを引き出すとき' },
              { label: 'なぜ？', use: '背景や理由、感情を引き出したいとき' },
            ].map((s) => (
              <div key={s.label} className="flex gap-3 items-start">
                <span className="bg-amber-100 text-amber-700 font-bold text-sm px-3 py-1 rounded-full shrink-0">{s.label}</span>
                <p className="text-sm text-gray-600 pt-0.5">{s.use}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 始めるボタン */}
        <div className="space-y-3 pb-4">
          <Link href="/cards" className="btn-primary block w-full text-center">
            カードを選んで始める
          </Link>
          <Link href="/" className="btn-secondary block w-full text-center">
            トップに戻る
          </Link>
        </div>
      </div>
    </main>
  )
}
