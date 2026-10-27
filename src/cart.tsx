import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { OmaProduct } from './data'

export interface CartLine {
  product: OmaProduct
  qty: number
}

interface CartCtx {
  lines: CartLine[]
  count: number
  total: number
  add: (p: OmaProduct, qty?: number) => void
  remove: (id: string) => void
  setQty: (id: string, qty: number) => void
  clear: () => void
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const api = useMemo<CartCtx>(() => {
    const add = (p: OmaProduct, qty = 1) =>
      setLines((ls) => {
        const i = ls.findIndex((l) => l.product.id === p.id)
        if (i >= 0) {
          const copy = [...ls]
          copy[i] = { ...copy[i], qty: copy[i].qty + qty }
          return copy
        }
        return [...ls, { product: p, qty }]
      })
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      total: lines.reduce((s, l) => s + l.qty * l.product.price, 0),
      add,
      remove: (id) => setLines((ls) => ls.filter((l) => l.product.id !== id)),
      setQty: (id, qty) =>
        setLines((ls) =>
          qty <= 0
            ? ls.filter((l) => l.product.id !== id)
            : ls.map((l) => (l.product.id === id ? { ...l, qty } : l)),
        ),
      clear: () => setLines([]),
    }
  }, [lines])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useCart() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart outside CartProvider')
  return ctx
}
