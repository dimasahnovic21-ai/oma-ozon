import { motion } from 'framer-motion'
import { ArrowLeft, Check, MessageCircleMore, ShieldCheck, Users, ShoppingBag } from 'lucide-react'
import { Card, PrimaryButton, Tap, staggerChild, staggerParent } from '../components/ui'
import { byn } from '../data'
import { PROJECT_STAGES, projectTotal, type Project } from '../projects'

const STAGE_HINTS = [
  'Бригада свяжется и зафиксирует смету на объекте',
  'Материалы ОМА привезут с подъёмом на этаж',
  'Начинаются черновые работы',
  'Финишная отделка и подписание акта',
]

export function Project({
  project,
  onBack,
  onAdvance,
}: {
  project: Project
  onBack: () => void
  onAdvance: (id: string) => void
}) {
  return (
    <div className="scroll-area h-full overflow-y-auto bg-bg pb-28">
      {/* Hero */}
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#1d5dbe_0%,#174c9d_100%)] pb-6">
        <div className="mesh-blob absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_70%)]" />
        <Tap
          onClick={onBack}
          aria-label="Назад"
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-glass backdrop-blur-md"
        >
          <ArrowLeft size={19} className="text-white" />
        </Tap>
        <div className="flex h-14 items-center justify-center px-14">
          <span className="line-clamp-1 text-[14px] font-bold text-white/90">
            {project.status === 'pending' ? 'Новый проект' : 'Проект'}
          </span>
        </div>
        <div className="px-5 pt-2">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[24px] font-black leading-tight text-white drop-shadow"
          >
            {project.title}
          </motion.h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                project.status === 'pending'
                  ? 'bg-amber-300/90 text-amber-900'
                  : 'bg-emerald-300/90 text-emerald-900'
              }`}
            >
              {project.status === 'pending' ? 'Ожидает подтверждения' : 'В работе'}
            </span>
            {project.crew && (
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                <Users size={12} />
                {project.crew.name} • {project.crew.rate} {project.crew.rateUnit}
              </span>
            )}
          </div>
        </div>
      </div>

      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 px-4 pt-4"
      >
        {/* Этапы */}
        <motion.div variants={staggerChild}>
          <Card className="p-4">
            <h2 className="mb-3 text-[15px] font-extrabold text-navy">Этапы работ</h2>
            <ul className="flex flex-col">
              {PROJECT_STAGES.map((st, i) => {
                const done = project.status === 'active' && i < project.currentStage
                const current = project.status === 'active' && i === project.currentStage
                return (
                  <li key={st.name} className="relative flex gap-3.5 pb-4 last:pb-0">
                    {i < PROJECT_STAGES.length - 1 && (
                      <span
                        className={`absolute left-[11px] top-6 h-[calc(100%-14px)] w-0.5 ${
                          done ? 'bg-brand-600/60' : 'bg-line'
                        }`}
                      />
                    )}
                    <span
                      className={`relative z-10 mt-0.5 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border-2 ${
                        done
                          ? 'border-brand-600 bg-brand-600'
                          : current
                            ? 'border-brand-600 bg-white'
                            : 'border-line bg-white'
                      }`}
                    >
                      {done ? (
                        <Check size={12} className="text-white" strokeWidth={3.5} />
                      ) : current ? (
                        <motion.span
                          className="h-2 w-2 rounded-full bg-brand-600"
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ repeat: Infinity, duration: 1.6 }}
                        />
                      ) : (
                        <span className="h-2 w-2 rounded-full bg-line" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[13.5px] leading-snug ${
                          current
                            ? 'font-bold text-navy'
                            : done
                              ? 'font-medium text-navy'
                              : 'text-muted'
                        }`}
                      >
                        {st.name}
                        {current && (
                          <span className="ml-2 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                            в работе
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] text-muted">
                        {STAGE_HINTS[i]}
                      </span>
                    </span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </motion.div>

        {/* Материалы ОМА */}
        <motion.div variants={staggerChild}>
          <Card className="p-4">
            <h2 className="mb-3 flex items-center gap-2 text-[15px] font-extrabold text-navy">
              <ShoppingBag size={16} className="text-brand-600" />
              Материалы ОМА • {project.items.length} поз.
            </h2>
            <div className="flex flex-col gap-2">
              {project.items.slice(0, 4).map((l) => (
                <div key={l.product.id} className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-[12.5px] font-medium text-navy">
                    {l.product.name} <span className="text-muted">×{l.qty}</span>
                  </span>
                  <span className="shrink-0 text-[12px] font-semibold text-muted">
                    {byn(l.product.price * l.qty)}
                  </span>
                </div>
              ))}
              {project.items.length > 4 && (
                <p className="text-[11.5px] text-muted">…и ещё {project.items.length - 4} позиций</p>
              )}
              {project.items.length === 0 && (
                <p className="text-[12.5px] text-muted">Материалы уточняются на замере</p>
              )}
            </div>
            <div className="mt-3 border-t border-dashed border-line pt-2.5">
              <div className="flex justify-between text-[12.5px]">
                <span className="text-muted">Материалы</span>
                <span className="font-semibold text-navy">{byn(project.itemsTotal)}</span>
              </div>
              {project.crewTotal > 0 && (
                <div className="mt-1 flex justify-between text-[12.5px]">
                  <span className="text-brand-600">Работа {project.crew?.name}</span>
                  <span className="font-semibold text-brand-600">{byn(project.crewTotal)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between">
                <span className="text-[13px] font-bold text-navy">Итого</span>
                <span className="text-[15px] font-black text-navy">{byn(projectTotal(project))}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Гарантия */}
        <motion.div
          variants={staggerChild}
          className="flex items-center gap-3 rounded-xl border border-brand-600/20 bg-brand-50/60 p-3.5"
        >
          <ShieldCheck size={20} className="shrink-0 text-brand-600" />
          <p className="text-[12.5px] leading-snug text-navy">
            Гарантия на работы — <b>2 года</b>. Чат с бригадой доступен 24/7.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div variants={staggerChild} className="flex gap-2.5">
          <Tap className="flex h-12 w-14 shrink-0 items-center justify-center rounded-lg border border-brand-600/30 bg-white text-brand-600 transition-colors active:bg-brand-50">
            <MessageCircleMore size={20} />
          </Tap>
          {project.status === 'pending' ? (
            <PrimaryButton className="flex-1" onClick={() => onAdvance(project.id)}>
              Оформить и начать работу
            </PrimaryButton>
          ) : (
            <PrimaryButton
              className="flex-1"
              onClick={() => onAdvance(project.id)}
              disabled={project.currentStage >= PROJECT_STAGES.length - 1}
            >
              {project.currentStage >= PROJECT_STAGES.length - 1
                ? 'Проект завершён'
                : 'Подтвердить этап'}
            </PrimaryButton>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}
