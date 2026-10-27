import { motion } from 'framer-motion'
import { TopBar } from '../components/TopBar'
import { Tap, staggerChild, staggerParent } from '../components/ui'
import { SCENARIOS } from '../data'

export function Scenarios({
  onProfile,
  onScenario,
}: {
  onProfile: () => void
  onScenario: (id: string) => void
}) {
  return (
    <div className="scroll-area h-full overflow-y-auto bg-bg pb-28">
      <TopBar title="Сценарии" onProfile={onProfile} />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="px-4"
      >
        <motion.p variants={staggerChild} className="mb-4 text-[13px] text-muted">
          Выберите сценарий — ИИ соберёт смету и мастеров
        </motion.p>

        <div className="grid grid-cols-2 gap-3">
          {SCENARIOS.map((s) => (
            <motion.div key={s.id} variants={staggerChild}>
              <Tap
                onClick={() => onScenario(s.id)}
                className="group flex w-full flex-col items-start gap-3 rounded-xl border border-brand-600/30 bg-brand-50/60 p-4 text-left transition-colors duration-150 active:border-brand-600 active:bg-brand-50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-soft transition-transform duration-200 group-active:scale-90">
                  <s.icon size={22} className="text-brand-600" strokeWidth={1.9} />
                </span>
                <span>
                  <span className="block text-[14px] font-bold text-navy">
                    {s.name}
                  </span>
                  <span className="mt-0.5 block text-[11.5px] leading-tight text-muted">
                    {s.desc}
                  </span>
                </span>
              </Tap>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
