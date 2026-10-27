import avatar from '../assets/avatar.jpg'
import { Tap } from './ui'
import { cn } from '../cn'

export function TopBar({
  title,
  variant = 'dark',
  onProfile,
}: {
  title: string
  /** dark: navy-текст на светлом фоне; light: белый текст на градиенте */
  variant?: 'dark' | 'light'
  onProfile: () => void
}) {
  const light = variant === 'light'
  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-4">
      <h1
        className={cn(
          'text-[20px] font-black tracking-tight',
          light ? 'text-white' : 'text-navy',
        )}
      >
        {title}
      </h1>
      <Tap
        onClick={onProfile}
        aria-label="Профиль"
        className={cn(
          'flex h-10 w-10 items-center justify-center overflow-hidden rounded-full',
          'border transition-transform duration-200',
          light
            ? 'border-white/40 bg-white/20 shadow-glass backdrop-blur-md'
            : 'border-line bg-white/70 shadow-soft backdrop-blur-md',
        )}
      >
        <img
          src={avatar}
          alt="Профиль"
          className="h-8 w-8 rounded-full object-cover"
          draggable={false}
        />
      </Tap>
    </header>
  )
}
