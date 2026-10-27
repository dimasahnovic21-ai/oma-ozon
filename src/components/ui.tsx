import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../cn'

/* ---------- Tap: обёртка с press-анимацией для всего кликабельного ---------- */
export function Tap({
  className,
  children,
  ...rest
}: HTMLMotionProps<'button'> & { children?: ReactNode }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 550, damping: 28 }}
      className={cn('outline-none cursor-pointer', className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/* ---------- PrimaryButton: CTA из брендбука ---------- */
export function PrimaryButton({
  className,
  children,
  ...rest
}: HTMLMotionProps<'button'> & { children?: ReactNode }) {
  return (
    <Tap
      className={cn(
        'h-12 rounded-lg bg-brand-600 text-white text-[15px] font-semibold',
        'shadow-[0_6px_20px_rgb(29_93_190/0.35)]',
        'transition-colors duration-150 active:bg-brand-700',
        className,
      )}
      {...rest}
    >
      {children}
    </Tap>
  )
}

/* ---------- Card: белая карточка ---------- */
export function Card({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-line/70 bg-white shadow-soft',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ---------- Chip ---------- */
export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode
  active?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <Tap
      onClick={onClick}
      className={cn(
        'inline-flex h-9 items-center rounded-full border px-3.5 text-[12px] font-semibold transition-colors duration-150',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-brand-600/25 bg-brand-50/70 text-brand-700',
        className,
      )}
    >
      {children}
    </Tap>
  )
}

/* ---------- ProgressBar (анимированный) ---------- */
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <motion.div
        className="h-full rounded-full bg-brand-600"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

/* ---------- SectionTitle ---------- */
export function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-[18px] font-bold text-navy">{children}</h2>
}

/* ---------- Stagger-контейнер и элемент ---------- */
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045 } },
}
export const staggerChild = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
}
