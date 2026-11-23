import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Check,
  ChevronLeft,
  Sparkles,
} from 'lucide-react'
import { CategoryItem } from '../../types/budget'
import {
  CATEGORY_ICON_CHOICES,
  COLOR_SWATCHES,
  getCategoryIconComponent,
} from '../../constants/icons'

interface ManageCategoriesModalProps {
  isOpen: boolean
  onClose: () => void
  categories: CategoryItem[]
  onAddCategory: (category: Omit<CategoryItem, 'id'>) => void
  onUpdateCategory: (oldCategory: CategoryItem, updatedCategory: CategoryItem) => void
  onDeleteCategory: (category: CategoryItem) => void
}

export const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  // Form states for add / edit
  const [name, setName] = useState('')
  const [iconName, setIconName] = useState('tag')
  const [color, setColor] = useState('#FDE047')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleStartCreate = () => {
    setName('')
    setIconName('tag')
    setColor('#FF85A2')
    setError('')
    setIsCreatingNew(true)
    setEditingCategory(null)
  }

  const handleStartEdit = (cat: CategoryItem) => {
    setEditingCategory(cat)
    setName(cat.name)
    setIconName(cat.iconName)
    setColor(cat.color)
    setError('')
    setIsCreatingNew(false)
  }

  const handleCancelForm = () => {
    setEditingCategory(null)
    setIsCreatingNew(false)
    setName('')
    setError('')
  }

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Category name cannot be empty')
      return
    }

    // Check duplicate name
    const isDuplicate = categories.some(
      (c) =>
        c.name.toLowerCase() === trimmed.toLowerCase() &&
        c.id !== editingCategory?.id
    )
    if (isDuplicate) {
      setError('A category with this name already exists')
      return
    }

    if (editingCategory) {
      onUpdateCategory(editingCategory, {
        ...editingCategory,
        name: trimmed,
        iconName,
        color,
      })
    } else {
      onAddCategory({
        name: trimmed,
        iconName,
        color,
      })
    }

    handleCancelForm()
  }

  const isFormActive = isCreatingNew || !!editingCategory
  const FormIconComponent = getCategoryIconComponent(iconName)

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[390px] max-h-[90vh] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-5 flex flex-col overflow-hidden select-none"
        >
          {/* Top handle */}
          <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-3 shrink-0" />

          {/* Close button */}
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.6]" />
          </button>

          {/* Header */}
          <div className="mb-3 shrink-0">
            {isFormActive ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="w-7 h-7 rounded-lg neo-border bg-white flex items-center justify-center hover:bg-black/5 cursor-pointer"
                  title="Back to categories list"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.6]" />
                </button>
                <div>
                  <h2 className="text-lg font-black text-black tracking-tight leading-tight">
                    {editingCategory ? 'Edit Category' : 'New Category'}
                  </h2>
                  <p className="text-[11px] font-semibold text-black/60">
                    Customise icon, label and color swatch.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between pr-8">
                <div>
                  <h2 className="text-xl font-black text-black tracking-tight leading-tight">
                    Categories
                  </h2>
                  <p className="text-xs font-semibold text-black/60 mt-0.5">
                    Manage and customise your transaction tags.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto no-scrollbar min-h-0 py-1">
            {isFormActive ? (
              /* Add / Edit Form */
              <form onSubmit={handleSaveForm} className="space-y-3.5">
                {/* Live Preview Card */}
                <div className="bg-white neo-border rounded-xl p-3 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl neo-border flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    <FormIconComponent className="w-5 h-5 stroke-[2.4] text-black" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-black/50 block">
                      Preview
                    </span>
                    <h4 className="text-sm font-black text-black truncate">
                      {name.trim() || 'Category Name'}
                    </h4>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-black text-black mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder="e.g. Groceries, Gym, Gaming, Fuel"
                    maxLength={24}
                    className="w-full bg-white neo-border rounded-xl px-3.5 py-2 text-xs font-bold text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#FDE047]"
                  />
                  {error && (
                    <p className="text-[11px] font-bold text-[#FF70A6] mt-1">{error}</p>
                  )}
                </div>

                {/* Color Swatches */}
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Accent Color
                  </label>
                  <div className="grid grid-cols-8 gap-1.5">
                    {COLOR_SWATCHES.map((swatch) => {
                      const isSelected = color === swatch
                      return (
                        <button
                          key={swatch}
                          type="button"
                          onClick={() => setColor(swatch)}
                          className={`w-8 h-8 rounded-lg neo-border cursor-pointer transition-transform flex items-center justify-center ${
                            isSelected ? 'ring-2 ring-black scale-105' : 'hover:scale-105'
                          }`}
                          style={{ backgroundColor: swatch }}
                        >
                          {isSelected && (
                            <Check className="w-4 h-4 stroke-[3.5] text-black" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Icon Selection Grid */}
                <div>
                  <label className="block text-xs font-black text-black mb-1.5">
                    Select Icon
                  </label>
                  <div className="grid grid-cols-7 gap-1.5 max-h-36 overflow-y-auto no-scrollbar p-1 bg-white neo-border rounded-xl">
                    {CATEGORY_ICON_CHOICES.map((choice) => {
                      const IconComp = choice.component
                      const isSelected = iconName === choice.id
                      return (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => setIconName(choice.id)}
                          title={choice.label}
                          className={`w-9 h-9 rounded-lg neo-border flex items-center justify-center cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#FDE047] neo-shadow-sm ring-2 ring-black'
                              : 'bg-white hover:bg-black/5 opacity-80'
                          }`}
                        >
                          <IconComp className="w-4 h-4 stroke-[2.4] text-black" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="flex-1 py-2.5 bg-white neo-border rounded-xl text-xs font-black text-black hover:bg-black/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#FDE047] neo-border neo-shadow rounded-xl text-xs font-black text-black flex items-center justify-center gap-1.5 cursor-pointer neo-pressable"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save Category</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Categories List */
              <div className="space-y-2">
                {categories.map((cat) => {
                  const IconComp = getCategoryIconComponent(cat.iconName)
                  return (
                    <div
                      key={cat.id}
                      className="bg-white neo-border rounded-2xl p-2.5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl neo-border flex items-center justify-center shrink-0"
                          style={{ backgroundColor: cat.color }}
                        >
                          <IconComp className="w-4 h-4 stroke-[2.4] text-black" />
                        </div>
                        <span className="text-xs font-black text-black truncate">
                          {cat.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(cat)}
                          className="w-7 h-7 rounded-lg neo-border bg-[#FDE047] flex items-center justify-center text-black hover:opacity-90 cursor-pointer"
                          title="Edit category"
                        >
                          <Pencil className="w-3.5 h-3.5 stroke-[2.4]" />
                        </button>
                        {categories.length > 2 && (
                          <button
                            type="button"
                            onClick={() => onDeleteCategory(cat)}
                            className="w-7 h-7 rounded-lg neo-border bg-[#FF85A2] flex items-center justify-center text-black hover:opacity-90 cursor-pointer"
                            title="Delete category"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.4]" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Bottom Action when list is active */}
          {!isFormActive && (
            <div className="mt-3 pt-2 border-t border-black/10 shrink-0">
              <button
                type="button"
                onClick={handleStartCreate}
                className="w-full py-2.5 bg-[#D4F972] neo-border neo-shadow rounded-xl font-black text-xs text-black flex items-center justify-center gap-2 cursor-pointer neo-pressable"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Custom Category</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}