import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Trash2,
  Calendar,
  Tag,
  FileText,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Transaction } from '../../types/budget'
import { CATEGORY_COLORS } from '../../constants/initialTransactions'

interface TransactionDetailModalProps {
  transaction: Transaction | null
  onClose: () => void
  onDelete?: (id: string) => void
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
  onDelete,
}) => {
  if (!transaction) return null

  const isExpense = transaction.type === 'expense'
  const categoryColor = CATEGORY_COLORS[transaction.category] || '#E2E8F0'

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[360px] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-5 select-none"
        >
          {/* Top handle */}
          <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-3" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.6]" />
          </button>

          {/* Amount Badge */}
          <div className="text-center my-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider neo-border mb-2 ${
                isExpense ? 'bg-[#FF85A2] text-black' : 'bg-[#D4F972] text-black'
              }`}
            >
              {isExpense ? (
                <>
                  <TrendingDown className="w-3.5 h-3.5 stroke-[3]" />
                  Expense
                </>
              ) : (
                <>
                  <TrendingUp className="w-3.5 h-3.5 stroke-[3]" />
                  Income
                </>
              )}
            </span>
            <div className="text-3xl font-black text-black">
              {isExpense ? '-' : '+'}₹{transaction.amount.toLocaleString()}
            </div>
            <h3 className="text-sm font-bold text-black/80 mt-1">
              {transaction.name}
            </h3>
          </div>

          {/* Details Grid */}
          <div className="space-y-2 mb-4">
            <div className="bg-white neo-border rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-black/60" />
                <span className="text-xs font-bold text-black/60">Category</span>
              </div>
              <span
                className="px-2 py-0.5 rounded-md text-xs font-black neo-border text-black"
                style={{ backgroundColor: categoryColor }}
              >
                {transaction.category}
              </span>
            </div>

            <div className="bg-white neo-border rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-black/60" />
                <span className="text-xs font-bold text-black/60">Date</span>
              </div>
              <span className="text-xs font-black text-black">
                {transaction.date}
              </span>
            </div>

            {transaction.note && (
              <div className="bg-white neo-border rounded-xl p-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-black/60" />
                  <span className="text-xs font-bold text-black/60">Note</span>
                </div>
                <p className="text-xs font-semibold text-black/90">
                  {transaction.note}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={() => {
                  onDelete(transaction.id)
                  onClose()
                }}
                className="px-3 py-2.5 bg-[#FF85A2] neo-border rounded-xl flex items-center justify-center text-black font-bold text-xs neo-pressable cursor-pointer"
                title="Delete transaction"
              >
                <Trash2 className="w-4 h-4 stroke-[2.4]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-[#FDE047] neo-border neo-shadow py-2.5 rounded-xl font-black text-xs text-black text-center cursor-pointer neo-pressable"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
