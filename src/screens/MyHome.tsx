import { motion } from 'framer-motion'
import { House, ChevronRight, MapPinned, ArrowUpRight } from 'lucide-react'
import bathImg from '../assets/bathroom.jpg'
import { TopBar } from '../components/TopBar'
import { Card, ProgressBar, SectionTitle, Tap, staggerChild, staggerParent } from '../components/ui'
import { cn } from '../cn'

export function MyHome({
  onProfile,
  onProject,
  embedded = false,
}: {
  onProfile: () => void
  onProject: () => void
  /** true — используется внутри вкладки с общим TopBar (без своей шапки) */
  embedded?: boolean
}) {
  return (
    <div className={cn('bg-bg', embedded ? 'px-0 pt-2' : 'scroll-area h-full overflow-y-auto pb-28')}>
      {!embedded && <TopBar title="Проекты" onProfile={onProfile} />}

      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-5 px-4"
      >
        {/* Моя квартира */}
        <motion.section variants={staggerChild}>
          <SectionTitle>Моя квартира</SectionTitle>
          <Card className="mt-3 overflow-hidden">
            <Tap className="flex w-full items-center gap-3.5 p-4 text-left">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50">
                <House size={22} className="text-brand-600" strokeWidth={1.9} />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-extrabold text-navy">
                  Моё жильё
                </span>
                <span className="mt-0.5 block text-[12px] text-muted">
                  Квартира • 54 м² • Минск
                </span>
              </span>
              <ChevronRight size={19} className="shrink-0 text-muted" />
            </Tap>
            <div className="mx-4 h-px bg-line" />
            <Tap className="flex w-full items-center justify-between p-3.5 text-left">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-brand-600">
                <MapPinned size={16} />
                План квартиры
              </span>
              <ArrowUpRight size={15} className="text-brand-600" />
            </Tap>
          </Card>
        </motion.section>

        {/* Активные проекты */}
        <motion.section variants={staggerChild}>
          <SectionTitle>Активные проекты</SectionTitle>
          <Card className="mt-3 p-4">
            <div className="flex items-stretch gap-3.5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <img src={bathImg} alt="Ремонт ванной" className="h-full w-full object-cover" draggable={false} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[15px] font-extrabold text-navy">Ремонт ванной</h3>
                  <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    Уточняется
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-muted">Этап 2 из 4 • Черновые работы</p>
                <div className="mt-2.5">
                  <ProgressBar value={42} />
                </div>
              </div>
            </div>
            <Tap
              onClick={onProject}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-lg bg-brand-600 text-[14px] font-semibold text-white shadow-[0_6px_20px_rgb(29_93_190/0.35)] transition-colors duration-150 active:bg-brand-700"
            >
              Продолжить
            </Tap>
          </Card>
        </motion.section>

        {/* Подсказка */}
        <motion.p variants={staggerChild} className="px-1 text-[12px] leading-relaxed text-muted">
          Здесь появятся ваши задачи и проекты. Создайте первую на вкладке
          «Главная» — ИИ соберёт смету и подберёт мастеров.
        </motion.p>
      </motion.div>
    </div>
  )
}
