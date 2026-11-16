import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Zap,
  HeartPulse,
  Film,
  Repeat,
  CircleDot,
  Calendar,
  FileText,
  Check,
} from 'lucide-react'
import { Transaction, TransactionType, BudgetCategory } from '../../types/budget'
import { CATEGORY_COLORS } from '../../constants/initialTransactions'

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
}

const CATEGORIES: { category: BudgetCategory; icon: React.ReactNode }[] = [
  { category: 'Food & Dining', icon: <Utensils className="w-4 h-4 stroke-[2.4]" /> },
  { category: 'Transport', icon: <Car className="w-4 h-4 stroke-[2.4]" /> },
  { category: 'Shopping', icon: <ShoppingBag className="w-4 h-4 stroke-[2.4]" /> },
  { category: 'Utilities', icon: <Zap className="w-4 h-4 stroke-[2.4]" /> },
  { category: 'Health', icon: <HeartPulse className="w-4 h-4 stroke-[2.4]" /> },
  { category: 'Entertainment', icon: <Film className="w-4 h-4 stroke-[2.4]" /> },
  { category: 'Subscriptions', icon: <Repeat className="w-4 h-4 stroke-[2.4]" /> },
  { category: 'Others', icon: <CircleDot className="w-4 h-4 stroke-[2.4]" /> },
]

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onAddTransaction,
}) => {
  const [name, setName] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<BudgetCategory>('Food & Dining')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Please enter a description / name')
      return
    }
    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }

    onAddTransaction({
      name: name.trim(),
      type,
      amount: parsedAmount,
      category,
      date: 'Today',
      note: note.trim() || undefined,
      createdAt: new Date().toISOString(),
    })

    // Reset & close
    setName('')
    setType('expense')
    setAmount('')
    setCategory('Food & Dining')
    setNote('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[370px] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-5 overflow-hidden select-none"
        >
          {/* Top Drag Handle */}
          <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-3" />

          {/* Close button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 stroke-[2.6]" />
          </button>

          {/* Title & Subtitle */}
          <div className="mb-3.5">
            <h2 className="text-xl font-black text-black tracking-tight leading-tight">
              Add Transaction
            </h2>
            <p className="text-xs font-semibold text-black/60 mt-0.5">
              Record your income or expense.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Expense / Income Segmented Toggle */}
            <div className="grid grid-cols-2 gap-2 bg-white neo-border rounded-xl p-1">
              <button
                type="button"
                onClick={() => setType('expense')}
                className={`py-2 rounded-lg font-black text-xs text-center cursor-pointer transition-all ${
                  type === 'expense'
                    ? 'bg-[#FF85A2] text-black neo-border neo-shadow-sm'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Expense (-)
              </button>
              <button
                type="button"
                onClick={() => setType('income')}
                className={`py-2 rounded-lg font-black text-xs text-center cursor-pointer transition-all ${
                  type === 'income'
                    ? 'bg-[#D4F972] text-black neo-border neo-shadow-sm'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Income (+)
              </button>
            </div>

            {/* Description / Name */}
            <div>
              <label className="block text-[12px] font-black text-black mb-1">
                Description
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError('')
                }}
                placeholder="e.g. Grocery Store, Coffee, Salary"
                className="w-full bg-white neo-border rounded-xl px-3.5 py-2 text-xs font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FDE047]"
              />
            </div>

            {/* Amount (₹) */}
            <div>
              <label className="block text-[12px] font-black text-black mb-1">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-black text-black">
                  ₹
                </span>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value)
                    if (error) setError('')
                  }}
                  placeholder="0.00"
                  className="w-full bg-white neo-border rounded-xl pl-8 pr-3.5 py-2 text-sm font-black text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FDE047]"
                />
              </div>
              {error && (
                <p className="text-[11px] font-bold text-[#FF70A6] mt-1">{error}</p>
              )}
            </div>

            {/* Category Grid */}
            <div>
              <label className="block text-[12px] font-black text-black mb-1">
                Category
              </label>
              <div className="grid grid-cols-4 gap-1.5 max-h-28 overflow-y-auto no-scrollbar p-0.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.category
                  const bgColor = CATEGORY_COLORS[cat.category] || '#E2E8F0'

                  return (
                    <button
                      key={cat.category}
                      type="button"
                      onClick={() => setCategory(cat.category)}
                      className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl neo-border cursor-pointer transition-all ${
                        isSelected
                          ? 'neo-shadow-sm font-black ring-2 ring-black'
                          : 'bg-white hover:bg-black/5 opacity-80'
                      }`}
                      style={{
                        backgroundColor: isSelected ? bgColor : '#FFFFFF',
                      }}
                    >
                      {cat.icon}
                      <span className="text-[9px] font-bold text-black mt-1 text-center truncate w-full">
                        {cat.category.split(' ')[0]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[12px] font-black text-black mb-1">
                Note <span className="text-[10px] font-medium text-black/50">(optional)</span>
              </label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 pointer-events-none">
                  <FileText className="w-3.5 h-3.5 text-black stroke-[2.4]" />
                </div>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional details..."
                  className="w-full bg-white neo-border rounded-xl pl-8 pr-3 py-1.5 text-xs font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FDE047]"
                />
              </div>
            </div>

            {/* Add Transaction Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-2 bg-[#FDE047] neo-border neo-shadow py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer neo-pressable"
            >
              <div className="w-5 h-5 rounded-full border-2 border-black flex items-center justify-center bg-transparent">
                <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-black">
                Add Transaction
              </span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
