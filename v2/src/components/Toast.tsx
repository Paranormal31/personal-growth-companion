import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string | null
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          onClick={onClose}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#FDE047] neo-border neo-shadow-lg px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer max-w-[90vw]"
        >
          <span className="text-xs font-black text-black tracking-tight">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
