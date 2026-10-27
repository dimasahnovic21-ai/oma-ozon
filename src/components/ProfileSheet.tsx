import { motion } from 'framer-motion'
import {
  UserRound,
  CreditCard,
  BellRing,
  CircleHelp,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import avatar from '../assets/avatar.jpg'
import { Tap } from './ui'

const ITEMS = [
  { icon: UserRound, label: 'Мои данные' },
  { icon: CreditCard, label: 'Карта покупателя ОМА' },
  { icon: BellRing, label: 'Мои заказы ОМА' },
  { icon: CircleHelp, label: 'Помощь' },
]

export function ProfileSheet({ onClose }: { onClose: () => void }) {
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
        className="relative rounded-t-3xl bg-white pb-8 pt-3 shadow-lift"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />

        <div className="mb-4 flex flex-col items-center gap-2 px-5">
          <div className="h-[76px] w-[76px] overflow-hidden rounded-full border-[3px] border-brand-50 shadow-soft">
            <img src={avatar} alt="Дмитрий" className="h-full w-full object-cover" draggable={false} />
          </div>
          <div className="text-center">
            <h2 className="text-[18px] font-black text-navy">Дмитрий Шахнович</h2>
            <p className="mt-0.5 text-[12.5px] text-muted">dimasahnovic21@gmail.com</p>
          </div>
          <span className="mt-1 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold text-brand-700">
            2 активных проекта
          </span>
        </div>

        <div className="flex flex-col px-4">
          {ITEMS.map((it) => (
            <Tap key={it.label} className="flex w-full items-center gap-3.5 py-3.5 text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
                <it.icon size={18} className="text-brand-600" strokeWidth={1.9} />
              </span>
              <span className="flex-1 text-[14px] font-semibold text-navy">{it.label}</span>
              <ChevronRight size={17} className="text-muted" />
            </Tap>
          ))}
          <div className="my-1 h-px bg-line" />
          <Tap className="flex w-full items-center gap-3.5 py-3.5 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
              <LogOut size={18} className="text-red-500" strokeWidth={1.9} />
            </span>
            <span className="flex-1 text-[14px] font-semibold text-red-500">Выйти</span>
          </Tap>
        </div>
      </motion.div>
    </motion.div>
  )
}
