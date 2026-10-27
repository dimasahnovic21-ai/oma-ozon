import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { PrimaryButton, Tap, staggerChild, staggerParent } from '../components/ui'
import { DEFAULT_TASK, SCENARIOS } from '../data'

const LOADER_STEPS = [
  'Анализирую задачу…',
  'Подбираю товары из каталога ОМА (70 000+)…',
  'Считаю варианты сметы…',
]

export function Home({
  onProfile,
  onAskAI,
  onScenario,
}: {
  onProfile: () => void
  onAskAI: (task: string) => void
  onScenario: (id: string) => void
}) {
  const [task, setTask] = useState(DEFAULT_TASK)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!loading) return
    const t1 = setInterval(() => setStep((s) => Math.min(s + 1, LOADER_STEPS.length - 1)), 700)
    const t2 = setTimeout(() => {
      setLoading(false)
      setStep(0)
      onAskAI(task)
    }, 2100)
    return () => {
      clearInterval(t1)
      clearTimeout(t2)
    }
  }, [loading, onAskAI, task])

  return (
    <div className="relative h-full overflow-hidden">
      {/* Mesh-градиент */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#1d5dbe_0%,#5b8fd9_38%,#f4f6f8_78%)]" />
      <div className="mesh-blob absolute -top-32 -right-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(127,190,255,0.55),transparent_65%)] blur-2xl" />
      <div className="mesh-blob absolute top-24 -left-32 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(23,76,157,0.5),transparent_65%)] blur-2xl [animation-delay:-7s]" />

      <div className="scroll-area relative z-10 flex h-full flex-col overflow-y-auto pb-28">
        <TopBar title="ОМА • ИИ-помощник" variant="light" onProfile={onProfile} />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="show"
          className="flex flex-1 flex-col justify-center gap-4 px-4"
        >
          <motion.p
            variants={staggerChild}
            className="text-[15px] font-semibold text-white/85"
          >
            Здравствуйте, Дмитрий 👋
          </motion.p>

          {/* Карточка ввода */}
          <motion.div
            variants={staggerChild}
            className="rounded-3xl border border-white/50 bg-white/95 p-5 shadow-lift backdrop-blur"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50">
                <Sparkles size={17} className="text-brand-600" />
              </span>
              <h2 className="text-[17px] font-bold text-navy">Что нужно сделать?</h2>
            </div>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              rows={3}
              placeholder="Опишите задачу — ИИ подберёт товары из ОМА и посчитает смету"
              className="w-full resize-none rounded-xl border border-line bg-panel/60 p-3 text-[14px] leading-snug text-navy outline-none transition placeholder:text-muted focus:border-brand-600/40 focus:bg-white"
            />
            <PrimaryButton
              onClick={() => setLoading(true)}
              disabled={loading || !task.trim()}
              className="mt-4 w-full"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'ИИ подбирает…' : 'Подобрать товары'}
                {!loading && <ArrowRight size={17} />}
              </span>
            </PrimaryButton>

            {/* Мини-лоадер со сменой шагов */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 flex items-center gap-3 rounded-xl bg-brand-50/80 px-3 py-2.5">
                    <span className="relative flex h-4 w-4 shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-600/40" />
                      <span className="relative inline-flex h-4 w-4 animate-spin rounded-full border-2 border-brand-600/30 border-t-brand-600" />
                    </span>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={step}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-[13px] font-medium text-brand-700"
                      >
                        {LOADER_STEPS[step]}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Быстрый доступ к сценариям */}
          <motion.div variants={staggerChild}>
            <p className="mb-2 px-1 text-[13px] font-semibold text-white/80">
              Популярное
            </p>
            <div className="scroll-area -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">
              {SCENARIOS.slice(0, 6).map((s) => (
                <Tap
                  key={s.id}
                  onClick={() => onScenario(s.id)}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-white/35 bg-white/15 px-3.5 py-2 backdrop-blur-md transition-colors active:bg-white/30"
                >
                  <s.icon size={16} className="text-white" />
                  <span className="text-[12.5px] font-semibold text-white">{s.name}</span>
                </Tap>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Подсказка снизу */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-2 flex items-center justify-center gap-1 text-[11.5px] text-white/60"
        >
          Опишите задачу своими словами — соберём корзину в ОМА <ChevronRight size={12} />
        </motion.p>
      </div>
    </div>
  )
}
