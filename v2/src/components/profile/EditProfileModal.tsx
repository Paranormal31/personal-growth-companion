import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Check,
  Dices,
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Sliders,
} from 'lucide-react'
import { UserProfile, AvataaarsConfig } from '../../types/avatar'
import {
  AVATAR_PRESETS,
  BG_COLOR_OPTIONS,
  TOP_OPTIONS,
  ACCESSORY_OPTIONS,
  CLOTHING_OPTIONS,
  EYE_OPTIONS,
  MOUTH_OPTIONS,
  SKIN_COLOR_OPTIONS,
  HAIR_COLOR_OPTIONS,
  getRandomAvataaarsConfig,
} from '../../utils/avatarGenerator'
import { ProfileAvatar } from './ProfileAvatar'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentProfile: UserProfile
  onSaveProfile: (profile: UserProfile) => void
  onNotify: (msg: string) => void
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onNotify,
}) => {
  const [name, setName] = useState(currentProfile.name || 'User')
  const [tagline, setTagline] = useState(
    currentProfile.tagline || 'Personal Growth Journey'
  )
  const [avatarConfig, setAvatarConfig] = useState<AvataaarsConfig>(
    currentProfile.avatarConfig
  )
  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets')
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  if (!isOpen) return null

  const handleRandomize = () => {
    const random = getRandomAvataaarsConfig(name.toLowerCase().trim() || 'user')
    setAvatarConfig(random)
  }

  const handleSelectPreset = (config: AvataaarsConfig) => {
    setAvatarConfig({
      ...config,
      seed: name.trim() || 'User',
    })
  }

  const handleSave = () => {
    const trimmedName = name.trim() || 'User'
    const trimmedTagline = tagline.trim() || 'Personal Growth Journey'
    const finalProfile: UserProfile = {
      name: trimmedName,
      tagline: trimmedTagline,
      avatarConfig: {
        ...avatarConfig,
        seed: trimmedName,
      },
    }

    onSaveProfile(finalProfile)
    onNotify(`Profile updated! Welcome, ${trimmedName}!`)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-[360px] bg-[#FFFDF5] neo-border-thick neo-shadow-lg rounded-[28px] p-4 sm:p-5 flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Handle */}
          <div className="w-12 h-1 bg-black/25 rounded-full mx-auto mb-2.5 shrink-0" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-black hover:bg-black/10 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5 stroke-[2.6]" />
          </button>

          {/* Title */}
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="w-8 h-8 rounded-lg neo-border bg-[#FDE047] flex items-center justify-center">
              <User className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-black leading-none">
                Edit Profile
              </h3>
              <p className="text-[11px] font-bold text-black/60 mt-0.5">
                Set your name and Avataaars character
              </p>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-3.5 pr-0.5">
            {/* Live Avatar Preview Card */}
            <div className="bg-[#DDD6FE] neo-border neo-shadow-sm rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <ProfileAvatar
                  config={avatarConfig}
                  sizeClassName="w-16 h-16"
                  className="neo-border-thick"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-wider text-black/60 block">
                    Preview
                  </span>
                  <h4 className="text-sm font-black text-black truncate">
                    {name.trim() || 'User'}
                  </h4>
                  <span className="text-[10.5px] font-bold text-black/75 truncate block">
                    Avataaars Style
                  </span>
                </div>
              </div>

              {/* Randomize Button */}
              <button
                type="button"
                onClick={handleRandomize}
                className="py-2 px-2.5 bg-[#FDE047] neo-border neo-shadow-xs rounded-xl flex items-center gap-1.5 text-xs font-black text-black hover:bg-[#FDE047]/80 cursor-pointer neo-pressable shrink-0"
                title="Generate Random Avatar"
              >
                <Dices className="w-4 h-4 stroke-[2.5]" />
                <span>Shuffle</span>
              </button>
            </div>

            {/* Inputs: Name & Tagline */}
            <div className="space-y-2">
              <div>
                <label className="text-[10.5px] font-black uppercase tracking-wider text-black/70 block mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex, Jordan, Neo"
                  maxLength={25}
                  className="w-full px-3 py-2 bg-white neo-border rounded-xl font-black text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-black uppercase tracking-wider text-black/70 block mb-1">
                  Personal Tagline / Journey
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Personal Growth Journey"
                  maxLength={40}
                  className="w-full px-3 py-2 bg-white neo-border rounded-xl font-bold text-xs text-black focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Background Color Selector */}
            <div>
              <label className="text-[10.5px] font-black uppercase tracking-wider text-black/70 block mb-1.5">
                Avatar Background Color
              </label>
              <div className="flex items-center gap-1.5 justify-between">
                {BG_COLOR_OPTIONS.map((c) => {
                  const isSelected =
                    avatarConfig.backgroundColor.toUpperCase() ===
                    c.hex.toUpperCase()
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() =>
                        setAvatarConfig((prev) => ({
                          ...prev,
                          backgroundColor: c.hex,
                        }))
                      }
                      style={{ backgroundColor: `#${c.hex}` }}
                      className={`flex-1 h-7 rounded-lg neo-border cursor-pointer flex items-center justify-center transition-transform ${
                        isSelected
                          ? 'scale-105 ring-2 ring-black neo-shadow-xs'
                          : 'hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      title={c.label}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 stroke-[3] text-black" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Presets vs Fine-tune Toggle */}
            <div className="flex items-center gap-1.5 bg-[#F4F0E6] neo-border rounded-xl p-1">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'presets'
                    ? 'bg-white neo-border neo-shadow-xs text-black'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Avatar Presets
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('customize')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeTab === 'customize'
                    ? 'bg-white neo-border neo-shadow-xs text-black'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                Customize Features
              </button>
            </div>

            {/* Presets Grid */}
            {activeTab === 'presets' && (
              <div className="grid grid-cols-4 gap-2">
                {AVATAR_PRESETS.map((preset) => {
                  const isCurrent =
                    avatarConfig.top === preset.config.top &&
                    avatarConfig.accessories === preset.config.accessories

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.config)}
                      className={`p-1.5 bg-white neo-border rounded-xl flex flex-col items-center text-center cursor-pointer transition-all ${
                        isCurrent
                          ? 'ring-2 ring-black bg-[#FDE047]/20 neo-shadow-sm'
                          : 'hover:bg-black/5'
                      }`}
                    >
                      <ProfileAvatar
                        config={{
                          ...preset.config,
                          backgroundColor: avatarConfig.backgroundColor,
                        }}
                        sizeClassName="w-11 h-11"
                        className="rounded-xl mb-1"
                      />
                      <span className="text-[9.5px] font-black text-black leading-tight line-clamp-1">
                        {preset.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Customize Features Tab */}
            {activeTab === 'customize' && (
              <div className="space-y-3 bg-white neo-border rounded-2xl p-3 text-xs">
                {/* Hair / Headwear */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">
                    Hair / Headwear
                  </label>
                  <select
                    value={avatarConfig.top || 'shortFlat'}
                    onChange={(e) =>
                      setAvatarConfig((prev) => ({
                        ...prev,
                        top: e.target.value,
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-[#FFFDF5] neo-border rounded-lg font-bold text-xs text-black focus:outline-none"
                  >
                    {TOP_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Glasses / Accessories */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">
                    Glasses & Accessories
                  </label>
                  <select
                    value={avatarConfig.accessories || 'none'}
                    onChange={(e) =>
                      setAvatarConfig((prev) => ({
                        ...prev,
                        accessories: e.target.value,
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-[#FFFDF5] neo-border rounded-lg font-bold text-xs text-black focus:outline-none"
                  >
                    {ACCESSORY_OPTIONS.map((a) => (
                      <option key={a.value} value={a.value}>
                        {a.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clothing */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">
                    Outfit / Clothing
                  </label>
                  <select
                    value={avatarConfig.clothing || 'hoodie'}
                    onChange={(e) =>
                      setAvatarConfig((prev) => ({
                        ...prev,
                        clothing: e.target.value,
                      }))
                    }
                    className="w-full px-2.5 py-1.5 bg-[#FFFDF5] neo-border rounded-lg font-bold text-xs text-black focus:outline-none"
                  >
                    {CLOTHING_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Expression (Eyes & Mouth) */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">
                      Eyes
                    </label>
                    <select
                      value={avatarConfig.eyes || 'default'}
                      onChange={(e) =>
                        setAvatarConfig((prev) => ({
                          ...prev,
                          eyes: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 bg-[#FFFDF5] neo-border rounded-lg font-bold text-xs text-black focus:outline-none"
                    >
                      {EYE_OPTIONS.map((ey) => (
                        <option key={ey.value} value={ey.value}>
                          {ey.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">
                      Mouth
                    </label>
                    <select
                      value={avatarConfig.mouth || 'smile'}
                      onChange={(e) =>
                        setAvatarConfig((prev) => ({
                          ...prev,
                          mouth: e.target.value,
                        }))
                      }
                      className="w-full px-2 py-1.5 bg-[#FFFDF5] neo-border rounded-lg font-bold text-xs text-black focus:outline-none"
                    >
                      {MOUTH_OPTIONS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Skin Color */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">
                    Skin Tone
                  </label>
                  <div className="flex items-center gap-1.5">
                    {SKIN_COLOR_OPTIONS.map((sk) => {
                      const isSelected = avatarConfig.skinColor === sk.hex
                      return (
                        <button
                          key={sk.hex}
                          type="button"
                          onClick={() =>
                            setAvatarConfig((prev) => ({
                              ...prev,
                              skinColor: sk.hex,
                            }))
                          }
                          style={{ backgroundColor: `#${sk.hex}` }}
                          className={`flex-1 h-6 rounded-md neo-border cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-black scale-105'
                              : 'opacity-85 hover:opacity-100'
                          }`}
                          title={sk.label}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 stroke-[3] text-black" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Hair Color */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-black/70 block mb-1">
                    Hair Color
                  </label>
                  <div className="grid grid-cols-8 gap-1">
                    {HAIR_COLOR_OPTIONS.map((hc) => {
                      const isSelected = avatarConfig.hairColor === hc.hex
                      return (
                        <button
                          key={hc.hex}
                          type="button"
                          onClick={() =>
                            setAvatarConfig((prev) => ({
                              ...prev,
                              hairColor: hc.hex,
                            }))
                          }
                          style={{ backgroundColor: `#${hc.hex}` }}
                          className={`h-6 rounded-md neo-border cursor-pointer flex items-center justify-center ${
                            isSelected
                              ? 'ring-2 ring-black scale-105'
                              : 'opacity-85 hover:opacity-100'
                          }`}
                          title={hc.label}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 stroke-[3] text-white" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center gap-2 pt-3 shrink-0 border-t border-black/10 mt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white neo-border rounded-xl text-xs font-black text-black hover:bg-black/5 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2.5 bg-[#D4F972] neo-border neo-shadow rounded-xl text-xs font-black text-black flex items-center justify-center gap-1.5 cursor-pointer neo-pressable text-center"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Save Profile</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
