export type CategoryId =
  | 'know-business'
  | 'know-challenges'
  | 'know-connections'
  | 'find-contribution'
  | 'verbalize-support'
  | 'next-step'

export interface Category {
  id: CategoryId
  name: string
  emoji: string
  color: string
  bgColor: string
  borderColor: string
}

export interface Card {
  id: string
  categoryId: CategoryId
  question: string
  hint?: string
}

export interface Memo {
  id: string
  date: string
  partnerName: string
  contributions: string
  nextAction: string
}
