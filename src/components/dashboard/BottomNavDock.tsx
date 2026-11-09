import { motion } from 'framer-motion';
import { Sparkles, Smile, CheckSquare, Settings } from 'lucide-react';
import type { TimeOfDay } from '../../types/theme';

export type DashboardTab = 'dashboard' | 'mood' | 'habits' | 'settings';

export interface BottomNavDockProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  timeOfDay?: TimeOfDay;
  className?: string;
}

interface NavItem {
  id: DashboardTab;
  label: string;
  icon: typeof Sparkles;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Today', icon: Sparkles },
  { id: 'habits', label: 'Rituals', icon: CheckSquare },
  { id: 'mood', label: 'Mood', icon: Smile },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const NAV_THEME_MAP: Record<
  TimeOfDay,
  { bg: string; border: string; ink: string; inkMuted: string; activeColor: string }
> = {
  morning: {
    bg: 'rgba(255, 245, 230, 0.92)',
    border: 'rgba(255, 107, 107, 0.28)',
    ink: '#4A2545',
    inkMuted: 'rgba(74, 37, 69, 0.65)',
    activeColor: '#FF6B6B',
  },
  afternoon: {
    bg: 'rgba(232, 246, 255, 0.92)',
    border: 'rgba(76, 158, 255, 0.28)',
    ink: '#1F3A5F',
    inkMuted: 'rgba(31, 58, 95, 0.65)',
    activeColor: '#4C9EFF',
  },
  evening: {
    bg: 'rgba(255, 228, 236, 0.92)',
    border: 'rgba(142, 124, 251, 0.28)',
    ink: '#3B1E54',
    inkMuted: 'rgba(59, 30, 84, 0.65)',
    activeColor: '#8E7CFB',
  },
  night: {
    bg: 'rgba(30, 27, 75, 0.94)',
    border: 'rgba(167, 139, 250, 0.35)',
    ink: '#F8FAFF',
    inkMuted: 'rgba(248, 250, 255, 0.65)',
    activeColor: '#A78BFA',
  },
};

/**
 * BottomNavDock
 *
 * Floating frosted glass bottom navigation bar anchored inside the mobile canvas.
 * Adapts dynamically to the active reference color theme and Outfit typography.
 */
export function BottomNavDock({
  activeTab,
  onTabChange,
  timeOfDay = 'morning',
  className = '',
}: BottomNavDockProps) {
  const currentNavTheme = NAV_THEME_MAP[timeOfDay] ?? NAV_THEME_MAP.morning;

  return (
    <nav
      aria-label="Dashboard bottom navigation"
      className={`relative z-30 px-3 py-2 rounded-2xl backdrop-blur-xl border shadow-[0_12px_32px_rgba(0,0,0,0.4)] flex items-center justify-around gap-1 pointer-events-auto transition-colors duration-500 font-['Outfit'] ${className}`}
      style={{
        backgroundColor: currentNavTheme.bg,
        borderColor: currentNavTheme.border,
      }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className="relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer"
            style={{
              color: isActive ? currentNavTheme.ink : currentNavTheme.inkMuted,
            }}
          >
            {isActive && (
              <motion.div
                layoutId="bottomNavActivePill"
                className="absolute inset-0 rounded-xl border pointer-events-none"
                style={{
                  backgroundColor: `${currentNavTheme.activeColor}20`,
                  borderColor: `${currentNavTheme.activeColor}50`,
                  boxShadow: `0 0 12px ${currentNavTheme.activeColor}30`,
                }}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}

            <Icon
              className="w-4 h-4 transition-transform duration-200"
              style={{
                color: isActive ? currentNavTheme.activeColor : undefined,
                transform: isActive ? 'scale(1.12)' : 'scale(1)',
              }}
            />
            <span className="text-[10px] font-bold tracking-tight leading-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavDock;
