import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Sparkles, X, Star, Users } from 'lucide-react'
import { byn, CREWS, KITS, productById, type Crew } from '../data'
import { useCart, type CartLine } from '../cart'
import { cn } from '../cn'

const KIT_LIST = KITS.default

export function AIResultSheet({
  task,
  onClose,
  onToCart,
  onToProjects,
}: {
  task: string
  onClose: () => void
  /** без бригады: товары → корзина */
  onToCart: () => void
  /** с бригадой: пакет → проекты */
  onToProjects: (payload: {
    title: string
    crew: Crew
    lines: CartLine[]
    itemsTotal: number
    crewTotal: number
  }) => void
}) {
  const cart = useCart()
  const [kitId, setKitId] = useState(KIT_LIST[1].id)
  const [withCrew, setWithCrew] = useState(false)
  const [crewId, setCrewId] = useState(CREWS[0].id)
  const [expanded, setExpanded] = useState<string | null>(KIT_LIST[1].id)
  const [excluded, setExcluded] = useState<Set<string>>(new Set())

  const kit = KIT_LIST.find((k) => k.id === kitId)!
  const crew = CREWS.find((c) => c.id === crewId)!

  /* площадь для расценки бригады — фиксированная для демо */
  const AREA = 20

  const itemsTotal = useMemo(
    () =>
      kit.items
        .filter((i) => !excluded.has(i.productId))
        .reduce((s, i) => s + (productById(i.productId)?.price ?? 0) * i.qty, 0),
    [kit, excluded],
  )

  const crewTotal = withCrew ? crew.rate * AREA : 0
  const grand = itemsTotal + crewTotal

  const toggleItem = (id: string) =>
    setExcluded((prev) => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const buildLines = (): CartLine[] =>
    kit.items
      .filter((i) => !excluded.has(i.productId))
      .map((i) => ({ product: productById(i.productId)!, qty: i.qty }))
      .filter((l) => l.product)

  const submit = () => {
    if (withCrew) {
      onToProjects({
        title: task,
        crew,
        lines: buildLines(),
        itemsTotal,
        crewTotal,
      })
    } else {
      for (const l of buildLines()) cart.add(l.product, l.qty)
      onToCart()
    }
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-navy/45 backdrop-blur-[2px]" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 40 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => info.offset.y > 110 && onClose()}
        className="relative flex max-h-[93%] flex-col rounded-t-3xl bg-white shadow-lift"
      >
        {/* Header */}
        <div className="shrink-0 px-5 pb-2 pt-3">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-brand-600" />
                <h2 className="text-[19px] font-black text-navy">Подборка ОМА</h2>
              </div>
              <p className="mt-0.5 line-clamp-1 text-[12.5px] text-muted">«{task}»</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Закрыть"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-panel transition-colors active:bg-line"
            >
              <X size={17} className="text-muted" />
            </button>
          </div>

          {/* Тумблер: своими силами / с бригадой */}
          <div className="mt-4 flex rounded-xl bg-panel p-1">
            {[
              { v: false, label: 'Своими силами' },
              { v: true, label: 'С бригадой ОМА' },
            ].map((o) => (
              <button
                key={o.label}
                onClick={() => setWithCrew(o.v)}
                className={cn(
                  'relative flex-1 rounded-lg py-2 text-[12.5px] font-bold transition-colors',
                  withCrew === o.v ? 'text-white' : 'text-muted',
                )}
              >
                {withCrew === o.v && (
                  <motion.span
                    layoutId="crew-toggle"
                    className="absolute inset-0 rounded-lg bg-brand-600"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative z-10">{o.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Содержимое */}
        <div className="scroll-area flex-1 overflow-y-auto px-4 py-3">
          {/* Выбор комплекта */}
          <div className="flex flex-col gap-2">
            {KIT_LIST.map((k) => {
              const isSel = kitId === k.id
              const isOpen = expanded === k.id
              return (
                <div
                  key={k.id}
                  className={cn(
                    'overflow-hidden rounded-2xl border-2 transition-colors duration-200',
                    isSel ? 'border-brand-600 bg-brand-50/50' : 'border-line bg-white',
                  )}
                >
                  <button
                    onClick={() => {
                      setKitId(k.id)
                      setExcluded(new Set())
                      setExpanded(k.id)
                    }}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <span
                      className={cn(
                        'flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                        isSel ? 'border-brand-600 bg-brand-600' : 'border-line bg-white',
                      )}
                    >
                      {isSel && <Check size={13} className="text-white" strokeWidth={3.5} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[15px] font-extrabold text-navy">{k.name}</span>
                        {k.badge && (
                          <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            {k.badge}
                          </span>
                        )}
                        <span className="text-[12px] font-medium text-muted">
                          {k.items.length} позиций
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-muted">{k.desc}</span>
                    </span>
                    <ChevronDown
                      size={17}
                      className={cn('shrink-0 text-muted transition-transform duration-200', isOpen && 'rotate-180')}
                    />
                  </button>

                  {/* Товары комплекта с чекбоксами */}
                  <AnimatePresence initial={false}>
                    {isOpen && isSel && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-line/80 px-3 pb-2 pt-1.5">
                          {k.items.map((i) => {
                            const p = productById(i.productId)
                            if (!p) return null
                            const on = !excluded.has(p.id)
                            return (
                              <button
                                key={p.id}
                                onClick={() => toggleItem(p.id)}
                                className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-2 text-left transition-colors active:bg-panel"
                              >
                                <span
                                  className={cn(
                                    'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2 transition-colors',
                                    on ? 'border-brand-600 bg-brand-600' : 'border-line bg-white',
                                  )}
                                >
                                  {on && <Check size={11} className="text-white" strokeWidth={3.5} />}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-[12.5px] font-semibold text-navy">
                                    {p.name}
                                  </span>
                                  <span className="block truncate text-[10.5px] text-muted">
                                    {p.brand} • {p.spec}
                                  </span>
                                </span>
                                <span className="shrink-0 text-right">
                                  <span className={cn('block text-[12.5px] font-bold', on ? 'text-navy' : 'text-muted line-through')}>
                                    {byn(p.price * i.qty)}
                                  </span>
                                  <span className="block text-[10px] text-muted">×{i.qty}</span>
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Выбор бригады */}
          <AnimatePresence>
            {withCrew && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pb-1 pt-4">
                  <div className="mb-2 flex items-center gap-2 px-1">
                    <Users size={15} className="text-brand-600" />
                    <span className="text-[13px] font-bold text-navy">
                      Бригада-партнёр ОМА • на {AREA} м²
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {CREWS.map((c) => (
                      <CrewCard
                        key={c.id}
                        crew={c}
                        selected={crewId === c.id}
                        onClick={() => setCrewId(c.id)}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-3 px-1 text-center text-[11px] leading-relaxed text-muted">
            Товары зарезервируются в магазине ОМА. Бригада свяжется для уточнения
            деталей — выезд на замер бесплатный.
          </p>
        </div>

        {/* Footer с итогом */}
        <div className="shrink-0 border-t border-line bg-white px-4 pb-6 pt-3">
          <div className="mb-2.5 flex items-baseline justify-between px-1">
            <span className="text-[12.5px] font-semibold text-muted">
              Товары {byn(itemsTotal)}
              {withCrew && <span className="text-brand-600"> + работа {byn(crewTotal)}</span>}
            </span>
            <span className="text-[17px] font-black text-navy">{byn(grand)}</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 550, damping: 28 }}
            onClick={submit}
            className="h-12 w-full rounded-lg bg-brand-600 text-[15px] font-semibold text-white shadow-[0_6px_20px_rgb(29_93_190/0.35)] transition-colors duration-150 active:bg-brand-700"
          >
            {withCrew ? `Отправить в проекты • ${byn(grand)}` : `Всё в корзину • ${byn(grand)}`}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function CrewCard({
  crew,
  selected,
  onClick,
}: {
  crew: Crew
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors',
        selected ? 'border-brand-600 bg-brand-50/50' : 'border-line bg-white',
      )}
    >
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white',
          selected ? 'bg-brand-600' : 'bg-muted/50',
        )}
      >
        {crew.name.slice(0, 1)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[13.5px] font-extrabold text-navy">{crew.name}</span>
          <span className="flex items-center gap-0.5 text-[11.5px] font-bold text-[#f5a623]">
            <Star size={11} fill="currentColor" />
            {crew.rating}
          </span>
          <span className="text-[10.5px] text-muted">({crew.reviews})</span>
        </span>
        <span className="mt-0.5 block text-[11px] text-muted">
          {crew.rate} {crew.rateUnit} • {crew.term}
        </span>
      </span>
      <span
        className={cn(
          'shrink-0 text-[13px] font-black',
          selected ? 'text-brand-600' : 'text-navy',
        )}
      >
        {byn(crew.rate * 20)}
      </span>
    </button>
  )
}
