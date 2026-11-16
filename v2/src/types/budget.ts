export type TransactionType = 'expense' | 'income'

export type BudgetCategory =
  | 'Food & Dining'
  | 'Transport'
  | 'Shopping'
  | 'Utilities'
  | 'Health'
  | 'Entertainment'
  | 'Subscriptions'
  | 'Others'

export interface Transaction {
  id: string
  name: string
  type: TransactionType
  amount: number
  category: BudgetCategory
  date: string // e.g. "Today", "Yesterday", "Nov 14"
  note?: string
  createdAt?: string
}

export interface BudgetConfig {
  monthlyBudget: number
  monthlyIncome: number
  currency: string // "₹"
}
