import { motion } from 'framer-motion'
import { Compass, LayoutGrid, House } from 'lucide-react'
import { Tap } from './ui'
import { cn } from '../cn'

const TABS = [
  { id: 'home', label: 'Главная', icon: Compass },
  { id: 'scenarios', label: 'Сценарии', icon: LayoutGrid },
  { id: 'myhome', label: 'Проекты', icon: House },
] as const

export type TabId = (typeof TABS)[number]['id']

export function BottomNav({
  active,
  onTab,
}: {
  active: TabId
  onTab: (id: TabId) => void
}) {
  return (
    <nav className="absolute inset-x-4 bottom-4 z-30">
      <div className="rounded-3xl border border-white/60 bg-white/65 shadow-glass backdrop-blur-xl">
        <div className="flex items-center justify-around p-1.5">
          {TABS.map((t) => {
            const isActive = t.id === active
            const Icon = t.icon
            return (
              <Tap
                key={t.id}
                onClick={() => onTab(t.id)}
                aria-label={t.label}
                className="relative flex h-[52px] w-[118px] flex-col items-center justify-center gap-1 rounded-2xl"
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-2xl bg-brand-50"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                  />
                )}
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.4 : 2}
                  className={cn(
                    'relative z-10 transition-colors duration-200',
                    isActive ? 'text-brand-600' : 'text-muted',
                  )}
                />
                <span
                  className={cn(
                    'relative z-10 text-[11px] transition-colors duration-200',
                    isActive
                      ? 'font-bold text-brand-600'
                      : 'font-medium text-muted',
                  )}
                >
                  {t.label}
                </span>
              </Tap>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
