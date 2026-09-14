import type { Category, Card } from '@/types'

export const CATEGORIES: Category[] = [
  {
    id: 'know-business',
    name: '事業を知る',
    emoji: '🏢',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
  },
  {
    id: 'know-challenges',
    name: '課題を知る',
    emoji: '🔍',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
  },
  {
    id: 'know-connections',
    name: '求めるつながりを知る',
    emoji: '🤝',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
  },
  {
    id: 'find-contribution',
    name: '貢献の接点を探る',
    emoji: '💡',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-300',
  },
  {
    id: 'verbalize-support',
    name: '紹介・支援を言語化する',
    emoji: '✍️',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-300',
  },
  {
    id: 'next-step',
    name: '次の一歩を決める',
    emoji: '🚀',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-300',
  },
]

export const DIRECTION_META = {
  ask: {
    label: '相手に聞く',
    icon: '🙋',
    bg: 'bg-sky-100',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
  self: {
    label: '自分が考える',
    icon: '💭',
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  both: {
    label: '一緒に考える',
    icon: '🤝',
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
}

export const CARDS: Card[] = [
  // 事業を知る（すべて「相手に聞く」）
  { id: 'b1', categoryId: 'know-business', direction: 'ask', question: '今、どんな事業をされていますか？', hint: '商品・サービス・お客さまを教えてください' },
  { id: 'b2', categoryId: 'know-business', direction: 'ask', question: 'どんなお客さまに一番喜ばれていますか？', hint: '理想のお客さまのイメージを聞いてみましょう' },
  { id: 'b3', categoryId: 'know-business', direction: 'ask', question: 'この事業を始めたきっかけや想いは？', hint: '原点となるストーリーを引き出しましょう' },
  { id: 'b4', categoryId: 'know-business', direction: 'ask', question: 'ご自身の強みや得意なことは何ですか？', hint: '他の人と違うところを掘り下げましょう' },
  { id: 'b5', categoryId: 'know-business', direction: 'ask', question: 'お客さまはどんな変化・成果を得られますか？', hint: 'ビフォーアフターを具体的に聞いてみましょう' },
  { id: 'b6', categoryId: 'know-business', direction: 'ask', question: '今後どんな方向に事業を広げたいですか？', hint: '将来のビジョンや展開を聞いてみましょう' },

  // 課題を知る（すべて「相手に聞く」）
  { id: 'c1', categoryId: 'know-challenges', direction: 'ask', question: '今、一番力を入れていることは何ですか？', hint: '優先度の高いテーマを教えてもらいましょう' },
  { id: 'c2', categoryId: 'know-challenges', direction: 'ask', question: '今、解決したい課題や悩みはありますか？', hint: 'ビジネス・人材・集客など幅広く聞きましょう' },
  { id: 'c3', categoryId: 'know-challenges', direction: 'ask', question: '壁を感じているところや停滞していることは？', hint: '前に進めない理由を一緒に探りましょう' },
  { id: 'c4', categoryId: 'know-challenges', direction: 'ask', question: 'もし理想通りに進んだら、どんな状態になりますか？', hint: 'ゴールイメージを言語化してもらいましょう' },
  { id: 'c5', categoryId: 'know-challenges', direction: 'ask', question: '今の事業で一番難しいと感じる部分は？', hint: '率直に難しさを教えてもらいましょう' },
  { id: 'c6', categoryId: 'know-challenges', direction: 'ask', question: '半年後、一年後にどうなっていたいですか？', hint: '具体的な目標やマイルストーンを聞きましょう' },

  // 求めるつながりを知る（すべて「相手に聞く」）
  { id: 'n1', categoryId: 'know-connections', direction: 'ask', question: 'どんな方と出会いたいですか？', hint: '業種・役割・人柄など具体的に聞きましょう' },
  { id: 'n2', categoryId: 'know-connections', direction: 'ask', question: '今、求めているご縁やつながりは何ですか？', hint: '協業・紹介・情報など幅広く聞きましょう' },
  { id: 'n3', categoryId: 'know-connections', direction: 'ask', question: '今取り組んでいることが、さらにうまくいくには、どんなサポートがあるとよさそうですか？', hint: '人の紹介・情報・相談相手・協力など、自由に考えてもらいましょう' },
  { id: 'n4', categoryId: 'know-connections', direction: 'ask', question: 'コラボや連携できそうな業種や分野は？', hint: '異業種の可能性も一緒に考えましょう' },
  { id: 'n5', categoryId: 'know-connections', direction: 'ask', question: '一緒にやってみたいこと・試してみたいことは？', hint: 'ゆるやかな可能性として聞いてみましょう' },
  { id: 'n6', categoryId: 'know-connections', direction: 'ask', question: '逆に、あなたがご紹介できそうな方はいますか？', hint: 'Give & Giveの精神で話しましょう' },

  // 貢献の接点を探る（主に「自分が考える」）
  { id: 'f1', categoryId: 'find-contribution', direction: 'self', question: '私の周りで、お力になれそうな人はいますか？', hint: '具体的な名前でなくても「こんな人」でOK' },
  { id: 'f2', categoryId: 'find-contribution', direction: 'self', question: '提供できる情報やリソースはありますか？', hint: 'セミナー・コミュニティ・ツールなども含めて' },
  { id: 'f3', categoryId: 'find-contribution', direction: 'self', question: '経験や知識で力になれることはありますか？', hint: '過去の失敗や成功体験も価値になります' },
  { id: 'f4', categoryId: 'find-contribution', direction: 'self', question: '紹介できる場や機会・コミュニティはありますか？', hint: 'イベント・勉強会・SNSグループなども' },
  { id: 'f5', categoryId: 'find-contribution', direction: 'both', question: '一緒に何かできそうなことはありますか？', hint: '小さなコラボから始めるのも素敵です' },
  { id: 'f6', categoryId: 'find-contribution', direction: 'self', question: '相手の背中を押せる言葉やエールは？', hint: '応援の気持ちを言語化してみましょう' },

  // 紹介・支援を言語化する（混在）
  { id: 'v1', categoryId: 'verbalize-support', direction: 'self', question: 'どう紹介すれば、相手に伝わりますか？', hint: '自分の言葉で紹介文を考えましょう' },
  { id: 'v2', categoryId: 'verbalize-support', direction: 'ask', question: 'どんな言葉で紹介されると嬉しいですか？', hint: '自己紹介の「型」を一緒に作りましょう' },
  { id: 'v3', categoryId: 'verbalize-support', direction: 'both', question: '一言キャッチコピーをつけるとしたら？', hint: '覚えてもらいやすいフレーズを探しましょう' },
  { id: 'v4', categoryId: 'verbalize-support', direction: 'self', question: '紹介先へのひと言メッセージは？', hint: 'つなぐときに添える言葉を準備しましょう' },
  { id: 'v5', categoryId: 'verbalize-support', direction: 'both', question: '他の人との違いを一言で表すと？', hint: '差別化ポイントを言語化しましょう' },
  { id: 'v6', categoryId: 'verbalize-support', direction: 'ask', question: '紹介してほしい場面・タイミングは？', hint: '「こんなとき思い出してほしい」を聞きましょう' },

  // 次の一歩を決める（混在）
  { id: 's1', categoryId: 'next-step', direction: 'both', question: '今日の対話で気づいたことを一つ挙げるとしたら？', hint: '小さな気づきでも大切にしましょう' },
  { id: 's2', categoryId: 'next-step', direction: 'ask', question: '次に会うとしたら、どんなテーマで話したいですか？', hint: '継続的な関係のきっかけを作りましょう' },
  { id: 's3', categoryId: 'next-step', direction: 'both', question: '今日の会話から、一つだけアクションを決めませんか？', hint: '小さくてもOK。具体的に決めましょう' },
  { id: 's4', categoryId: 'next-step', direction: 'self', question: '紹介できそうな人を一人思い浮かべてみましょう', hint: 'すぐでなくてもOK。意識することが大切' },
  { id: 's5', categoryId: 'next-step', direction: 'both', question: '今日の対話で、印象に残った言葉は何ですか？', hint: 'お互いに振り返ることで学びが深まります' },
  { id: 's6', categoryId: 'next-step', direction: 'both', question: 'フォローアップの方法と期限を決めましょう', hint: 'SNS・メール・次回日程など具体的に' },
]

export const SUPPORT_CARDS = [
  { id: 'sup1', label: '〇〇とは？', description: '言葉の定義を確認する' },
  { id: 'sup2', label: '他には？', description: 'さらに掘り下げる' },
  { id: 'sup3', label: 'なぜ？', description: '背景や理由を聞く' },
]

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id)
}

export function getCardsByCategory(categoryId: string): Card[] {
  return CARDS.filter((c) => c.categoryId === categoryId)
}

export function getRandomCard(): Card {
  return CARDS[Math.floor(Math.random() * CARDS.length)]
}
