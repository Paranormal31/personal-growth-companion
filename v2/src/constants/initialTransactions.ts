import { Transaction, BudgetCategory, CategoryItem } from '../types/budget'

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

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    name: 'Whole Foods & Grocery',
    type: 'expense',
    amount: 3200,
    category: 'Food & Dining',
    date: 'Today',
    note: 'Weekly meal prep ingredients, fresh veggies & fruits',
    createdAt: '2026-11-17T11:00:00Z',
  },
  {
    id: 'tx-2',
    name: 'Metro Pass Recharge',
    type: 'expense',
    amount: 1500,
    category: 'Transport',
    date: 'Yesterday',
    note: 'Monthly city transit smart card',
    createdAt: '2026-11-16T09:30:00Z',
  },
  {
    id: 'tx-3',
    name: 'Running Shoes & Gear',
    type: 'expense',
    amount: 5400,
    category: 'Shopping',
    date: 'Nov 14',
    note: 'Nike Pegasus 40 running trainers on discount',
    createdAt: '2026-11-14T15:20:00Z',
  },
  {
    id: 'tx-4',
    name: 'High-speed Fiber Broadband',
    type: 'expense',
    amount: 1199,
    category: 'Utilities',
    date: 'Nov 12',
    note: 'Monthly 300 Mbps unlimited fiber connection',
    createdAt: '2026-11-12T10:00:00Z',
  },
  {
    id: 'tx-5',
    name: 'Whey Protein & Vitamins',
    type: 'expense',
    amount: 4200,
    category: 'Health',
    date: 'Nov 10',
    note: '2kg isolate protein tub & multivitamin pack',
    createdAt: '2026-11-10T14:15:00Z',
  },
  {
    id: 'tx-6',
    name: 'Cinema IMAX & Snacks',
    type: 'expense',
    amount: 1450,
    category: 'Entertainment',
    date: 'Nov 08',
    note: 'Weekend movie with friends',
    createdAt: '2026-11-08T20:30:00Z',
  },
  {
    id: 'tx-7',
    name: 'Spotify & Cloud Storage',
    type: 'expense',
    amount: 890,
    category: 'Subscriptions',
    date: 'Nov 05',
    note: 'Monthly recurring family music & 2TB drive storage',
    createdAt: '2026-11-05T08:00:00Z',
  },
  {
    id: 'tx-8',
    name: 'Bookstore & Stationary',
    type: 'expense',
    amount: 650,
    category: 'Others',
    date: 'Nov 03',
    note: 'Atomic Habits hardbound edition and journaling pens',
    createdAt: '2026-11-03T16:45:00Z',
  },
  {
    id: 'tx-salary',
    name: 'Monthly Tech Salary',
    type: 'income',
    amount: 65000,
    category: 'Others',
    date: 'Nov 01',
    note: 'Primary engineering salary credited',
    createdAt: '2026-11-01T09:00:00Z',
  },
]
