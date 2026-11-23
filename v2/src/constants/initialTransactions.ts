import { Transaction, CategoryItem } from '../types/budget'

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'Food & Dining', iconName: 'utensils', color: '#FDE047' }, // Yellow
  { id: 'cat-2', name: 'Transport', iconName: 'car', color: '#7DD3FC' },        // Cyan
  { id: 'cat-3', name: 'Shopping', iconName: 'shopping-bag', color: '#FF85A2' }, // Pink
  { id: 'cat-4', name: 'Utilities', iconName: 'zap', color: '#FED7AA' },        // Peach
  { id: 'cat-5', name: 'Health', iconName: 'heart', color: '#D4F972' },          // Lime
  { id: 'cat-6', name: 'Entertainment', iconName: 'film', color: '#DDD6FE' },   // Lavender
  { id: 'cat-7', name: 'Subscriptions', iconName: 'repeat', color: '#C084FC' }, // Purple
  { id: 'cat-8', name: 'Others', iconName: 'circle-dot', color: '#E2E8F0' },     // Slate
]

export const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#FDE047', // Yellow
  'Transport': '#7DD3FC',    // Cyan
  'Shopping': '#FF85A2',     // Bold Pink
  'Utilities': '#FED7AA',    // Peach
  'Health': '#D4F972',       // Lime
  'Entertainment': '#DDD6FE',// Lavender
  'Subscriptions': '#C084FC',// Purple
  'Others': '#E2E8F0',       // Light Slate
}

export const INITIAL_TRANSACTIONS: Transaction[] = []
