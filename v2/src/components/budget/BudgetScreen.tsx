import React, { useState } from 'react'
import {
  User,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  HeartPulse,
  Film,
  Repeat,
  CircleDot,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Transaction, BudgetCategory } from '../../types/budget'
import { BudgetMascot } from './BudgetMascot'
import { CategoryDonutChart } from './CategoryDonutChart'
import { AddTransactionModal } from './AddTransactionModal'
import { TransactionDetailModal } from './TransactionDetailModal'
import { CATEGORY_COLORS } from '../../constants/initialTransactions'

interface BudgetScreenProps {
  transactions: Transaction[]
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
  onDeleteTransaction: (id: string) => void
  onNotify: (msg: string) => void
  onOpenProfile: () => void
}

const ALL_CATEGORIES: BudgetCategory[] = [
  'Food & Dining',
  'Transport',
  'Shopping',
  'Utilities',
  'Health',
  'Entertainment',
  'Subscriptions',
  'Others',
]

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  onNotify,
  onOpenProfile,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)

  // Calculations
  const monthlyBudget = 40000 // ₹40,000 monthly spending budget

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0)

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0)

  // Strict rules from prompt:
  // Savings = Income - Expenses
  // Remaining Budget = Monthly Budget - Expenses
  const savings = totalIncome - totalExpenses
  const remainingBudget = monthlyBudget - totalExpenses
  const budgetSpentPercent = Math.min(
    100,
    Math.round((totalExpenses / monthlyBudget) * 100)
  )

  // Calculate Category Breakdown for Donut Chart
  const categoryTotals: Record<BudgetCategory, number> = ALL_CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = 0
      return acc
    },
    {} as Record<BudgetCategory, number>
  )

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })

  const categoryBreakdown = ALL_CATEGORIES.map((cat) => {
    const amount = categoryTotals[cat] || 0
    const percentage =
      totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
    return {
      category: cat,
      amount,
      percentage,
    }
  }).sort((a, b) => b.amount - a.amount)

  const getCategoryIcon = (category: BudgetCategory) => {
    switch (category) {
      case 'Food & Dining':
        return <Utensils className="w-4 h-4 stroke-[2.4]" />
      case 'Transport':
        return <Car className="w-4 h-4 stroke-[2.4]" />
      case 'Shopping':
        return <ShoppingBag className="w-4 h-4 stroke-[2.4]" />
      case 'Utilities':
        return <Zap className="w-4 h-4 stroke-[2.4]" />
      case 'Health':
        return <HeartPulse className="w-4 h-4 stroke-[2.4]" />
      case 'Entertainment':
        return <Film className="w-4 h-4 stroke-[2.4]" />
      case 'Subscriptions':
        return <Repeat className="w-4 h-4 stroke-[2.4]" />
      default:
        return <CircleDot className="w-4 h-4 stroke-[2.4]" />
    }
  }

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden select-none">
      {/* Top Fixed Section: Header, Monthly Overview & Financial Summary */}
      <div className="shrink-0">
        {/* Header */}
        <header className="relative w-full pt-1 pb-2 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={onOpenProfile}
              className="w-10 h-10 bg-white neo-border neo-shadow rounded-xl flex items-center justify-center neo-pressable cursor-pointer"
              aria-label="User Profile"
            >
              <User className="w-5 h-5 text-black stroke-[2.2]" />
            </button>

            <button
              onClick={() =>
                onNotify(`💡 Remaining monthly budget: ₹${remainingBudget.toLocaleString()}`)
              }
              className="relative w-10 h-10 bg-white neo-border neo-shadow rounded-xl flex items-center justify-center neo-pressable cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-black stroke-[2.2]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF70A6] border border-black rounded-full" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[30px] font-black text-black leading-none tracking-tight">
                Budget Tracker<span className="text-[#FDE047]">.</span>
              </h1>
              <p className="text-[13px] font-bold text-black/80 mt-1">
                Track spending, save smarter.
              </p>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="w-12 h-12 bg-[#FDE047] neo-border neo-shadow rounded-2xl flex items-center justify-center select-none cursor-pointer"
              title="Add Transaction"
              aria-label="Add Transaction"
            >
              <Plus className="w-6 h-6 text-black stroke-[3]" />
            </motion.button>
          </div>
        </header>

        {/* Monthly Overview Card */}
        <div className="w-full bg-[#DDD6FE] neo-border neo-shadow rounded-3xl p-3 mb-2 flex items-center justify-between">
          <div className="flex-1 pr-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black/70 mb-0.5">
              <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>November 2026</span>
            </div>

            <div className="flex items-baseline gap-1 my-0.5">
              <span className="text-2xl font-black text-black tracking-tight leading-none">
                ₹{totalExpenses.toLocaleString()}
              </span>
              <span className="text-xs font-black text-black/60">
                / ₹{monthlyBudget.toLocaleString()}
              </span>
            </div>

            {/* Spending Progress Bar */}
            <div className="w-full mt-1.5">
              <div className="w-full h-3 bg-white neo-border rounded-full overflow-hidden p-[1px]">
                <div
                  className="h-full bg-[#FF85A2] rounded-full transition-all duration-300"
                  style={{ width: `${budgetSpentPercent}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] font-bold text-black/70 mt-1">
                <span>{budgetSpentPercent}% spent</span>
                <span>₹{remainingBudget.toLocaleString()} left</span>
              </div>
            </div>
          </div>

          {/* Money Bag Mascot */}
          <div className="shrink-0 scale-90 -mr-2">
            <BudgetMascot spentRatio={budgetSpentPercent / 100} />
          </div>
        </div>

        {/* Financial Summary: 3 Cards */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {/* Income */}
          <div className="bg-[#D4F972] neo-border neo-shadow-sm rounded-2xl p-2 flex flex-col items-center text-center">
            <div className="w-6 h-6 rounded-lg neo-border bg-white flex items-center justify-center mb-0.5">
              <TrendingUp className="w-3.5 h-3.5 text-black stroke-[3]" />
            </div>
            <span className="text-xs font-black text-black leading-tight">
              ₹{totalIncome.toLocaleString()}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-black/60">
              Income
            </span>
          </div>

          {/* Expenses */}
          <div className="bg-[#FF85A2] neo-border neo-shadow-sm rounded-2xl p-2 flex flex-col items-center text-center">
            <div className="w-6 h-6 rounded-lg neo-border bg-white flex items-center justify-center mb-0.5">
              <TrendingDown className="w-3.5 h-3.5 text-black stroke-[3]" />
            </div>
            <span className="text-xs font-black text-black leading-tight">
              ₹{totalExpenses.toLocaleString()}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-black/60">
              Expenses
            </span>
          </div>

          {/* Savings */}
          <div className="bg-[#FDE047] neo-border neo-shadow-sm rounded-2xl p-2 flex flex-col items-center text-center">
            <div className="w-6 h-6 rounded-lg neo-border bg-white flex items-center justify-center mb-0.5">
              <PiggyBank className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-black leading-tight">
              ₹{savings.toLocaleString()}
            </span>
            <span className="text-[9px] font-black uppercase tracking-wider text-black/60">
              Savings
            </span>
          </div>
        </div>
      </div>

      {/* Middle Scrollable Section: Donut Chart & Recent Transactions */}
      <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 pr-0.5 space-y-2 pb-1">
        {/* Spending by Category Donut Chart */}
        <CategoryDonutChart
          categoryBreakdown={categoryBreakdown}
          totalExpenses={totalExpenses}
        />

        {/* Recent Transactions List */}
        <div className="flex items-center justify-between px-0.5 pt-0.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-black">
            Recent Transactions
          </h3>
          <span className="text-[11px] font-bold text-black/60">
            {transactions.length} items
          </span>
        </div>

        {transactions.map((tx) => {
          const isExpense = tx.type === 'expense'
          const catColor = CATEGORY_COLORS[tx.category] || '#E2E8F0'

          return (
            <motion.div
              key={tx.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTransaction(tx)}
              className="w-full bg-white neo-border neo-shadow rounded-2xl p-2.5 flex items-center justify-between cursor-pointer neo-pressable"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl neo-border flex items-center justify-center shrink-0"
                  style={{ backgroundColor: catColor }}
                >
                  {getCategoryIcon(tx.category)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-black leading-tight truncate">
                    {tx.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] font-bold text-black/60">
                    <span>{tx.category}</span>
                    <span>•</span>
                    <span>{tx.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs font-black ${
                    isExpense ? 'text-black' : 'text-[#16A34A]'
                  }`}
                >
                  {isExpense ? '-' : '+'}₹{tx.amount.toLocaleString()}
                </span>
                <div className="w-6 h-6 rounded-lg neo-border bg-[#F4F0E6] flex items-center justify-center">
                  <ChevronRight className="w-3.5 h-3.5 text-black stroke-[2.6]" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={(tx) => {
          onAddTransaction(tx)
          onNotify(`Recorded ₹${tx.amount} for "${tx.name}"!`)
        }}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        onDelete={(id) => {
          onDeleteTransaction(id)
          onNotify('Transaction deleted.')
        }}
      />
    </div>
  )
}
