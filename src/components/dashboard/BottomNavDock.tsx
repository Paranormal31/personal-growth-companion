import { motion } from 'framer-motion';
import { Sparkles, Smile, CheckSquare, Settings } from 'lucide-react';

export type DashboardTab = 'dashboard' | 'mood' | 'habits' | 'settings';

export interface BottomNavDockProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
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

/**
 * BottomNavDock
 *
 * Floating frosted glass bottom navigation bar anchored inside the mobile canvas.
 * Houses primary routes and triggers slide-up drawers for Mood Meter and Settings.
 */
export function BottomNavDock({
  activeTab,
  onTabChange,
  className = '',
}: BottomNavDockProps) {
  return (
    <nav
      aria-label="Dashboard bottom navigation"
      className={`relative z-30 px-3 py-2 rounded-2xl bg-stone-900/80 backdrop-blur-xl border border-white/15 shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex items-center justify-around gap-1 pointer-events-auto ${className}`}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors duration-200 cursor-pointer ${
              isActive ? 'text-white' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottomNavActivePill"
                className="absolute inset-0 rounded-xl bg-amber-500/20 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)] pointer-events-none"
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
              />
            )}

            <Icon
              className={`w-4 h-4 transition-transform duration-200 ${
                isActive ? 'scale-110 text-amber-400' : 'text-stone-400'
              }`}
            />
            <span className="text-[10px] tracking-tight leading-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavDock;
