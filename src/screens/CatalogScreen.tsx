import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, CircleDollarSign, ShoppingCart } from 'lucide-react'
import { TopBar } from '../components/TopBar'
import { Tap, staggerChild, staggerParent } from '../components/ui'
import { byn, PRODUCTS, SCENARIOS, type OmaProduct } from '../data'
import { useCart } from '../cart'
import { cn } from '../cn'

const SORTS = ['По популярности', 'Дешевле', 'Дороже'] as const

export function CatalogScreen({
  scenarioId,
  onBack,
  onProfile,
  onEstimate,
}: {
  scenarioId: string
  onBack: () => void
  onProfile: () => void
  onEstimate: (task: string) => void
}) {
  const s = SCENARIOS.find((x) => x.id === scenarioId) ?? SCENARIOS[0]
  const products = PRODUCTS[s.catalog] ?? []
  const [sort, setSort] = useState<(typeof SORTS)[number]>('По популярности')
  const [onlySale, setOnlySale] = useState(false)
  const [added, setAdded] = useState<Set<string>>(new Set())
  const cart = useCart()

  const list = useMemo(() => {
    let l = [...products]
    if (onlySale) l = l.filter((p) => p.badge === 'акция' || p.badge === 'прокат')
    if (sort === 'Дешевле') l.sort((a, b) => a.price - b.price)
    if (sort === 'Дороже') l.sort((a, b) => b.price - a.price)
    return l
  }, [products, sort, onlySale])

  const addToCart = (p: OmaProduct) => {
    cart.add(p)
    setAdded((prev) => new Set(prev).add(p.id))
    setTimeout(() => setAdded((prev) => {
      const n = new Set(prev)
      n.delete(p.id)
      return n
    }), 1400)
  }

  return (
    <div className="scroll-area h-full overflow-y-auto bg-bg pb-28">
      {/* Шапка с градиентом */}
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,#1d5dbe_0%,#174c9d_100%)] pb-6">
        <div className="mesh-blob absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_70%)]" />
        <div className="flex items-center justify-between p-4 pb-3">
          <Tap
            onClick={onBack}
            aria-label="Назад"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-glass backdrop-blur-md"
          >
            <ArrowLeft size={19} className="text-white" />
          </Tap>
          <TopBar title="" variant="light" onProfile={onProfile} />
        </div>
        <div className="flex items-center gap-3.5 px-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-md">
            <s.icon size={24} className="text-white" />
          </span>
          <div>
            <h1 className="text-[22px] font-black text-white">{s.name}</h1>
            <p className="text-[12px] text-white/75">
              Найдено {products.length} товаров в ОМА • {s.desc.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Фильтры */}
      <div className="sticky top-0 z-10 flex gap-2 overflow-x-auto border-b border-line bg-bg/90 px-4 py-2.5 backdrop-blur-md">
        {SORTS.map((srt) => (
          <Tap
            key={srt}
            onClick={() => setSort(srt)}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors',
              sort === srt
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-line bg-white text-muted',
            )}
          >
            {srt}
          </Tap>
        ))}
        <Tap
          onClick={() => setOnlySale((v) => !v)}
          className={cn(
            'shrink-0 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors',
            onlySale
              ? 'border-[#ff7a1a] bg-[#fff3e8] text-[#d9640d]'
              : 'border-line bg-white text-muted',
          )}
        >
          Акции и прокат
        </Tap>
      </div>

      {/* Товары */}
      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2.5 px-4 pt-3"
      >
        {list.map((p) => (
          <motion.div key={p.id} variants={staggerChild}>
            <ProductCard p={p} added={added.has(p.id)} onAdd={() => addToCart(p)} />
          </motion.div>
        ))}
      </motion.div>

      {/* ИИ CTA */}
      <div className="px-4 pt-4">
        <Tap
          onClick={() => onEstimate(s.task)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-600/40 bg-brand-50/50 text-[14px] font-semibold text-brand-700 transition-colors active:bg-brand-50"
        >
          <CircleDollarSign size={18} />
          Подобрать комплект с ИИ по задаче
        </Tap>
      </div>
    </div>
  )
}

function ProductCard({
  p,
  added,
  onAdd,
}: {
  p: OmaProduct
  added: boolean
  onAdd: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line/70 bg-white p-3 shadow-soft">
      {/* миниатюра-заглушка с брендом */}
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-panel">
        <span className="px-1 text-center text-[9px] font-black uppercase leading-tight tracking-wide text-muted">
          {p.brand.split(' ')[0].slice(0, 8)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-1.5">
          <p className="line-clamp-1 flex-1 text-[13.5px] font-bold text-navy">{p.name}</p>
          {p.badge && (
            <span
              className={cn(
                'shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black uppercase',
                p.badge === 'акция' && 'bg-red-50 text-red-500',
                p.badge === 'прокат' && 'bg-[#fff3e8] text-[#d9640d]',
                p.badge === 'хит' && 'bg-brand-50 text-brand-700',
              )}
            >
              {p.badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted">{p.spec}</p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <span className="text-[15px] font-black text-navy">
            {byn(p.price)}
            {p.unit && <span className="ml-1 text-[10.5px] font-semibold text-muted">/{p.unit.replace('прокат/', '')}</span>}
          </span>
          <Tap
            onClick={onAdd}
            aria-label="В корзину"
            className={cn(
              'flex h-9 items-center gap-1.5 rounded-lg px-3 text-[12px] font-bold text-white transition-colors duration-200',
              added ? 'bg-emerald-500' : 'bg-brand-600 active:bg-brand-700',
            )}
          >
            {added ? <Check size={15} strokeWidth={3} /> : <ShoppingCart size={15} />}
            {added ? 'В корзине' : 'В корзину'}
          </Tap>
        </div>
      </div>
    </div>
  )
}
