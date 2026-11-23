import React, { useState, useEffect } from 'react'
import {
  Plus,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ChevronRight,
  Calendar,
  Pencil,
  X,
  Check,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Transaction, BudgetCategory, CategoryItem } from '../../types/budget'
import { CategoryDonutChart } from './CategoryDonutChart'
import { AddTransactionModal } from './AddTransactionModal'
import { TransactionDetailModal } from './TransactionDetailModal'
import { ManageCategoriesModal } from './ManageCategoriesModal'
import { CATEGORY_COLORS, INITIAL_CATEGORIES } from '../../constants/initialTransactions'
import { getCategoryIconComponent } from '../../constants/icons'

interface BudgetScreenProps {
  transactions: Transaction[]
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
  onUpdateTransaction: (transaction: Transaction) => void
  onDeleteTransaction: (id: string) => void
  onNotify: (msg: string) => void
  onOpenProfile?: () => void
  monthlyBudget?: number
  onUpdateMonthlyBudget?: (budget: number) => void
}

export const BudgetScreen: React.FC<BudgetScreenProps> = ({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  onNotify,
  onOpenProfile,
  monthlyBudget: propMonthlyBudget,
  onUpdateMonthlyBudget,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null)
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false)

  // Monthly Budget with prop sync and localStorage persistence
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    if (propMonthlyBudget !== undefined) return propMonthlyBudget
    try {
      const saved = localStorage.getItem('neo_monthly_budget_v3')
      if (saved !== null) {
        const parsed = parseInt(saved, 10)
        if (!isNaN(parsed) && parsed > 0) return parsed
      }
    } catch {}
    return 40000
  })

  const [budgetInput, setBudgetInput] = useState<number>(monthlyBudget)

  useEffect(() => {
    if (propMonthlyBudget !== undefined) {
      setMonthlyBudget(propMonthlyBudget)
      setBudgetInput(propMonthlyBudget)
    }
  }, [propMonthlyBudget])

  useEffect(() => {
    try {
      localStorage.setItem('neo_monthly_budget_v3', String(monthlyBudget))
    } catch {}
  }, [monthlyBudget])

  // Dynamic Categories with localStorage persistence
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('neo_budget_categories_v3')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.error('Failed to load categories', e)
    }
    return INITIAL_CATEGORIES
  })

  useEffect(() => {
    try {
      localStorage.setItem('neo_budget_categories_v3', JSON.stringify(categories))
    } catch (e) {
      console.error('Failed to save categories', e)
    }
  }, [categories])

  const handleAddCategory = (newCatData: Omit<CategoryItem, 'id'>) => {
    const newCat: CategoryItem = {
      ...newCatData,
      id: `cat-${Date.now()}`,
    }
    setCategories((prev) => [...prev, newCat])
    onNotify(`Created category "${newCat.name}"!`)
  }

  const handleUpdateCategory = (oldCat: CategoryItem, updatedCat: CategoryItem) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === oldCat.id ? updatedCat : c))
    )
    if (oldCat.name !== updatedCat.name) {
      transactions.forEach((tx) => {
        if (tx.category === oldCat.name) {
          onUpdateTransaction({
            ...tx,
            category: updatedCat.name,
          })
        }
      })
    }
    onNotify(`Updated category "${updatedCat.name}"!`)
  }

  const handleDeleteCategory = (catToDelete: CategoryItem) => {
    const remaining = categories.filter((c) => c.id !== catToDelete.id)
    setCategories(remaining)
    const fallbackCategory = remaining[0]?.name || 'Others'
    transactions.forEach((tx) => {
      if (tx.category === catToDelete.name) {
        onUpdateTransaction({
          ...tx,
          category: fallbackCategory,
        })
      }
    })
    onNotify(`Deleted category "${catToDelete.name}".`)
  }

  const getCategoryColor = (catName: string) => {
    const found = categories.find(
      (c) => c.name.toLowerCase() === catName.toLowerCase()
    )
    return found?.color || CATEGORY_COLORS[catName] || '#E2E8F0'
  }

  const getCategoryIcon = (catName: string) => {
    const found = categories.find(
      (c) => c.name.toLowerCase() === catName.toLowerCase()
    )
    const IconComp = getCategoryIconComponent(found?.iconName || catName.toLowerCase())
    return <IconComp className="w-4 h-4 stroke-[2.4]" />
  }

  // Calculations
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
  const categoryTotals: Record<string, number> = categories.reduce(
    (acc, cat) => {
      acc[cat.name] = 0
      return acc
    },
    {} as Record<string, number>
  )

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount
    })

  const categoryBreakdown = categories.map((cat) => {
    const amount = categoryTotals[cat.name] || 0
    const percentage =
      totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
    return {
      category: cat.name,
      amount,
      percentage,
      color: cat.color,
    }
  }).sort((a, b) => b.amount - a.amount)

  return (
    <div className="flex flex-col h-full justify-between overflow-hidden select-none">
      {/* Top Fixed Section: Header, Monthly Overview & Financial Summary */}
      <div className="shrink-0">
        {/* Header */}
        <header className="relative w-full pt-0.5 pb-2 pr-1 shrink-0">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1 mr-2">
              <h1 className="text-[26px] sm:text-[30px] font-black text-black leading-none tracking-tight">
                Budget Tracker<span className="text-[#FDE047]">.</span>
              </h1>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAddModalOpen(true)}
              className="w-11 h-11 bg-[#FDE047] neo-border neo-shadow rounded-xl flex items-center justify-center select-none cursor-pointer shrink-0"
              title="Add Transaction"
              aria-label="Add Transaction"
            >
              <Plus className="w-6 h-6 text-black stroke-[3] overflow-visible" />
            </motion.button>
          </div>
        </header>

        {/* Monthly Overview Card - Compact without Mascot */}
        <div className="w-full bg-[#DDD6FE] neo-border neo-shadow rounded-2xl pl-3.5 pr-4 py-2.5 mb-2 overflow-hidden shrink-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-black/70">
              <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>November 2026</span>
            </div>
            <span className="text-[11px] font-black text-black/75">
              ₹{remainingBudget.toLocaleString()} left
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-1.5">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-black tracking-tight leading-none">
                ₹{totalExpenses.toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => {
                  setBudgetInput(monthlyBudget)
                  setIsEditBudgetOpen(true)
                }}
                className="text-xs font-black text-black/60 hover:text-black flex items-center gap-1 cursor-pointer transition-colors p-0.5 rounded hover:bg-black/10"
                title="Edit monthly budget"
              >
                <span>/ ₹{monthlyBudget.toLocaleString()}</span>
                <Pencil className="w-2.5 h-2.5 stroke-[2.5]" />
              </button>
            </div>
            <span className="text-xs font-black text-black/80">
              {budgetSpentPercent}% spent
            </span>
          </div>

          {/* Full-width Spending Progress Bar */}
          <div className="w-full h-2.5 bg-white neo-border rounded-full overflow-hidden p-[1px]">
            <div
              className="h-full bg-[#FF85A2] rounded-full transition-all duration-300"
              style={{ width: `${budgetSpentPercent}%` }}
            />
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
          onManageCategories={() => setIsManageCategoriesOpen(true)}
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

        {transactions.length === 0 ? (
          <div className="w-full bg-white neo-border neo-shadow rounded-2xl p-5 text-center flex flex-col items-center justify-center my-1 select-none">
            <div className="w-10 h-10 rounded-xl bg-[#FDE047] neo-border flex items-center justify-center mb-2">
              <PiggyBank className="w-5 h-5 text-black stroke-[2.4]" />
            </div>
            <h4 className="text-xs font-black text-black">No transactions logged yet</h4>
            <p className="text-[11px] font-bold text-black/50 mt-0.5 max-w-[240px]">
              Tap the + button above to record your first income or expense!
            </p>
          </div>
        ) : (
          transactions.map((tx) => {
            const isExpense = tx.type === 'expense'
            const catColor = getCategoryColor(tx.category)

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
          })
        )}
      </div>

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        editingTransaction={editingTransaction}
        categories={categories}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingTransaction(null)
        }}
        onAddTransaction={(tx) => {
          onAddTransaction(tx)
          onNotify(`Recorded ₹${tx.amount} for "${tx.name}"!`)
        }}
        onUpdateTransaction={(tx) => {
          onUpdateTransaction(tx)
          onNotify(`Updated "${tx.name}"!`)
        }}
        onManageCategories={() => setIsManageCategoriesOpen(true)}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        categoryColor={
          selectedTransaction
            ? getCategoryColor(selectedTransaction.category)
            : undefined
        }
        onClose={() => setSelectedTransaction(null)}
        onEdit={(tx) => {
          setSelectedTransaction(null)
          setEditingTransaction(tx)
          setIsAddModalOpen(true)
        }}
        onDelete={(id) => {
          onDeleteTransaction(id)
          onNotify('Transaction deleted.')
        }}
      />

      {/* Manage Categories Modal */}
      <ManageCategoriesModal
        isOpen={isManageCategoriesOpen}
        onClose={() => setIsManageCategoriesOpen(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Edit Monthly Budget Modal */}
      <AnimatePresence>
        {isEditBudgetOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-[320px] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-5 select-none"
            >
              <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-3" />
              <button
                type="button"
                onClick={() => setIsEditBudgetOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.6]" />
              </button>

              <h3 className="text-lg font-black text-black">Monthly Budget</h3>
              <p className="text-xs font-semibold text-black/60 mt-0.5 mb-3.5">
                Set your spending limit for the month.
              </p>

              {/* Amount Input */}
              <div className="relative mb-3">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-black/60">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={budgetInput || ''}
                  onChange={(e) =>
                    setBudgetInput(Math.max(0, parseInt(e.target.value, 10) || 0))
                  }
                  placeholder="e.g. 40000"
                  className="w-full pl-8 pr-4 py-2.5 bg-white neo-border rounded-xl font-black text-sm text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mb-4">
                {[20000, 30000, 40000, 50000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBudgetInput(preset)}
                    className={`py-1.5 rounded-lg neo-border font-black text-[10px] cursor-pointer transition-all ${
                      budgetInput === preset
                        ? 'bg-[#FDE047] neo-shadow-xs ring-1 ring-black'
                        : 'bg-white hover:bg-black/5 text-black/75'
                    }`}
                  >
                    ₹{(preset / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditBudgetOpen(false)}
                  className="flex-1 py-2.5 bg-white neo-border rounded-xl text-xs font-black text-black hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const finalBudget = budgetInput > 0 ? budgetInput : 40000
                    setMonthlyBudget(finalBudget)
                    if (onUpdateMonthlyBudget) onUpdateMonthlyBudget(finalBudget)
                    setIsEditBudgetOpen(false)
                    onNotify(`Monthly budget set to ₹${finalBudget.toLocaleString()}!`)
                  }}
                  className="flex-1 py-2.5 bg-[#D4F972] neo-border neo-shadow rounded-xl text-xs font-black text-black flex items-center justify-center gap-1.5 cursor-pointer neo-pressable"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
