import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, Truck, MapPin, Users, ArrowRight, Hammer, ChevronRight } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { Card, PrimaryButton, Tap } from '../components/ui'
import { byn, CREWS } from '../data'
import { useCart } from '../cart'
import { projectTotal, type Project } from '../projects'
import { cn } from '../cn'

type Mode = 'projects' | 'cart'

export function MyHomeTab({
  onProfile,
  onProject,
  onGoHome,
  onOrder,
  projects,
  onApproveProject,
  initialMode,
}: {
  onProfile: () => void
  onProject: (id: string) => void
  onGoHome: () => void
  onOrder: (total: number, withCrew: boolean) => void
  projects: Project[]
  onApproveProject: (id: string) => void
  initialMode?: Mode
}) {
  const [mode, setMode] = useState<Mode>(initialMode ?? 'projects')
  const cart = useCart()

  return (
    <div className="flex h-full flex-col bg-bg">
      <TopBar title="Проекты и корзина" onProfile={onProfile} />

      {/* Сегмент-тумблер */}
      <div className="px-4 pb-1">
        <div className="relative flex rounded-xl bg-panel p-1">
          {(
            [
              { v: 'projects' as Mode, label: 'Проекты' },
              { v: 'cart' as Mode, label: 'Корзина' },
            ]
          ).map((o) => (
            <button
              key={o.v}
              onClick={() => setMode(o.v)}
              className={cn(
                'relative flex-1 rounded-lg py-2 text-[13px] font-bold transition-colors',
                mode === o.v ? 'text-white' : 'text-muted',
              )}
            >
              {mode === o.v && (
                <motion.span
                  layoutId="mh-toggle"
                  className="absolute inset-0 rounded-lg bg-brand-600"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative z-10 flex items-center justify-center gap-1.5">
                {o.label}
                {o.v === 'cart' && cart.count > 0 && (
                  <motion.span
                    key={cart.count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                    className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ff7a1a] px-1 text-[10px] font-black text-white"
                  >
                    {cart.count > 99 ? '99+' : cart.count}
                  </motion.span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="scroll-area relative flex-1 overflow-y-auto pb-28">
        <AnimatePresence mode="wait" initial={false}>
          {mode === 'projects' ? (
            <motion.div
              key="projects"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col gap-3 px-4 pt-3"
            >
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={() => onProject(p.id)}
                  onApprove={() => onApproveProject(p.id)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.22 }}
            >
              <CartView onGoHome={onGoHome} onOrder={onOrder} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function CartView({
  onGoHome,
  onOrder,
}: {
  onGoHome: () => void
  onOrder: (total: number, withCrew: boolean) => void
}) {
  const cart = useCart()
  const [withCrew, setWithCrew] = useState(false)
  const crew = CREWS[0]
  const crewTotal = withCrew ? crew.rate * 20 : 0
  const grand = cart.total + crewTotal

  if (cart.lines.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-10 pb-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-panel">
          <ShoppingBag size={34} className="text-muted" strokeWidth={1.5} />
        </span>
        <h2 className="text-[16px] font-extrabold text-navy">Корзина пуста</h2>
        <p className="text-[12.5px] leading-relaxed text-muted">
          Опишите задачу на «Главной» — ИИ соберёт комплект товаров ОМА, или
          загляните в «Сценарии»
        </p>
        <Tap
          onClick={onGoHome}
          className="mt-2 flex items-center gap-1.5 rounded-lg border border-brand-600/40 bg-white px-4 py-2.5 text-[13px] font-bold text-brand-600 transition-colors active:bg-brand-50"
        >
          На главную <ArrowRight size={15} />
        </Tap>
      </div>
    )
  }

  // группировка по категориям
  const groups = cart.lines.reduce<Record<string, typeof cart.lines>>((acc, l) => {
    const k = l.product.category
    ;(acc[k] = acc[k] ?? []).push(l)
    return acc
  }, {})

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
      className="flex flex-col gap-4 px-4 pt-3"
    >
      {/* Линии корзины */}
      {Object.entries(groups).map(([cat, lines]) => (
        <motion.section key={cat} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
          <h2 className="mb-2 px-1 text-[13px] font-bold uppercase tracking-wide text-muted">
            {cat}
          </h2>
          <div className="flex flex-col gap-2">
            {lines.map((l) => (
              <Card key={l.product.id} className="flex items-center gap-3 p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-panel">
                  <span className="px-1 text-center text-[8.5px] font-black uppercase leading-tight text-muted">
                    {l.product.brand.split(' ')[0].slice(0, 8)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-[13px] font-bold text-navy">{l.product.name}</p>
                  <p className="text-[11px] text-muted">{l.product.brand}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex items-center gap-1 rounded-lg border border-line">
                      <Tap
                        onClick={() => cart.setQty(l.product.id, l.qty - 1)}
                        aria-label="Меньше"
                        className="flex h-7 w-7 items-center justify-center rounded-l-lg text-muted active:bg-panel"
                      >
                        <Minus size={13} />
                      </Tap>
                      <span className="w-6 text-center text-[12.5px] font-bold text-navy">{l.qty}</span>
                      <Tap
                        onClick={() => cart.setQty(l.product.id, l.qty + 1)}
                        aria-label="Больше"
                        className="flex h-7 w-7 items-center justify-center rounded-r-lg text-muted active:bg-panel"
                      >
                        <Plus size={13} />
                      </Tap>
                    </div>
                    <span className="text-[13.5px] font-black text-navy">
                      {byn(l.product.price * l.qty)}
                    </span>
                  </div>
                </div>
                <Tap
                  onClick={() => cart.remove(l.product.id)}
                  aria-label="Удалить"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-colors active:bg-red-50 active:text-red-500"
                >
                  <Trash2 size={16} />
                </Tap>
              </Card>
            ))}
          </div>
        </motion.section>
      ))}

      {/* Оформление ОМА */}
      <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
        <Card className="p-4">
          <h2 className="mb-3 text-[15px] font-extrabold text-navy">Оформление</h2>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
                <Truck size={17} className="text-brand-600" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-navy">Доставка с подъёмом</p>
                <p className="text-[11.5px] text-muted">
                  {cart.total >= 200 ? 'Бесплатно (заказ от 200 BYN)' : '18.90 BYN, завтра'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
                <MapPin size={17} className="text-brand-600" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-navy">Самовывоз</p>
                <p className="text-[11.5px] text-muted">32 магазина, сегодня к 18:00</p>
              </div>
            </div>
            <div className="h-px bg-line" />
            {/* Бригада */}
            <Tap
              onClick={() => setWithCrew((v) => !v)}
              className={cn(
                'flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors',
                withCrew ? 'border-brand-600 bg-brand-50/60' : 'border-line bg-white',
              )}
            >
              <span
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors',
                  withCrew ? 'border-brand-600 bg-brand-600' : 'border-line bg-white',
                )}
              >
                {withCrew && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[11px] font-black text-white">
                    ✓
                  </motion.span>
                )}
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <Users size={17} className="text-brand-600" />
              </span>
              <span className="flex-1">
                <span className="block text-[13px] font-semibold text-navy">
                  Нужна бригада? МастерОК
                </span>
                <span className="block text-[11.5px] text-muted">
                  Монтаж и укладка • {crew.rate} {crew.rateUnit} • ★ {crew.rating}
                </span>
              </span>
              <span className="shrink-0 text-[13px] font-black text-brand-600">
                +{byn(crewTotal || crew.rate * 20)}
              </span>
            </Tap>
          </div>
        </Card>
      </motion.div>

      {/* Итог */}
      <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
        <Card className="p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[13px] font-semibold text-muted">
              {cart.count} поз. • товары {byn(cart.total)}
              {withCrew && <span className="block text-brand-600">+ работа {byn(crewTotal)}</span>}
            </span>
            <span className="text-[19px] font-black text-navy">{byn(grand)}</span>
          </div>
          <PrimaryButton className="mt-3 w-full" onClick={() => onOrder(grand, withCrew)}>
            Оформить заказ
          </PrimaryButton>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function ProjectCard({
  project,
  onOpen,
  onApprove,
}: {
  project: Project
  onOpen: () => void
  onApprove: () => void
}) {
  const pending = project.status === 'pending'
  return (
    <Card className="overflow-hidden">
      <div className="flex items-stretch gap-3.5 p-4">
        <div
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl',
            pending ? 'bg-amber-50' : 'bg-brand-50',
          )}
        >
          <Hammer size={24} className={pending ? 'text-amber-500' : 'text-brand-600'} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-[15px] font-extrabold leading-tight text-navy">
              {project.title}
            </h3>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold',
                pending
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-50 text-emerald-600',
              )}
            >
              {pending ? 'Ожидает' : 'В работе'}
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted">
            {project.crew ? (
              <span className="inline-flex items-center gap-1">
                <Users size={12} className="text-brand-600" />
                {project.crew.name} • ★ {project.crew.rating} • {project.crew.rate} {project.crew.rateUnit}
              </span>
            ) : (
              'Своими силами • материалы ОМА'
            )}
          </p>
          <p className="mt-1 text-[12.5px] text-muted">
            {project.items.length} поз. • материалы {byn(project.itemsTotal)}
            {project.crewTotal > 0 && (
              <span className="text-brand-600"> + работа {byn(project.crewTotal)}</span>
            )}
          </p>
          <p className="mt-1.5 text-[15px] font-black text-navy">{byn(projectTotal(project))}</p>
        </div>
      </div>

      {pending ? (
        <div className="border-t border-line p-3">
          <Tap
            onClick={onApprove}
            className="flex h-11 w-full items-center justify-center rounded-lg bg-brand-600 text-[14px] font-semibold text-white shadow-[0_6px_20px_rgb(29_93_190/0.35)] transition-colors active:bg-brand-700"
          >
            Оформить и начать работу
          </Tap>
        </div>
      ) : (
        <Tap
          onClick={onOpen}
          className="flex w-full items-center justify-between border-t border-line p-3 text-left"
        >
          <span className="flex items-center gap-1.5 text-[13px] font-semibold text-brand-600">
            Этап {project.currentStage + 1} из 4 • открыть проект
          </span>
          <ChevronRight size={17} className="text-brand-600" />
        </Tap>
      )}
    </Card>
  )
}
