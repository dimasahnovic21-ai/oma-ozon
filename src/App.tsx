import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Users } from 'lucide-react'
import { BottomNav, type TabId } from './components/BottomNav'
import { AIResultSheet } from './components/AIResultSheet'
import { ProfileSheet } from './components/ProfileSheet'
import { Home } from './screens/Home'
import { Scenarios } from './screens/Scenarios'
import { CatalogScreen } from './screens/CatalogScreen'
import { MyHomeTab } from './screens/MyHomeTab'
import { Project as ProjectScreen } from './screens/Project'
import { CartProvider, useCart } from './cart'
import { byn } from './data'
import { DEMO_PROJECT, PROJECT_STAGES, projectTotal, type Project } from './projects'

type Screen = TabId | 'catalog' | 'project'

const screenVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.4 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-28%' : '28%', opacity: 0.4 }),
}

/* dev/QA: ?screen=catalog|project&scenario=bath&ai=1&aicrew=1&profile=1 */
const params = new URLSearchParams(location.search)
const initScreen = (params.get('screen') as Screen | null) ?? 'home'

function AppInner() {
  const cart = useCart()
  const [screen, setScreen] = useState<Screen>(initScreen)
  const [dir, setDir] = useState(1)
  const [scenarioId, setScenarioId] = useState(params.get('scenario') ?? 'bath')
  const [profileOpen, setProfileOpen] = useState(params.get('profile') === '1')
  const [aiTask, setAiTask] = useState<string | null>(
    params.get('ai') === '1' ? 'Залить стяжку в комнате 20 м² под ламинат' : null,
  )
  const [projects, setProjects] = useState<Project[]>([DEMO_PROJECT])
  const [projectId, setProjectId] = useState<string | null>(
    params.get('screen') === 'project' ? 'demo-bath' : null,
  )
  const [orderDone, setOrderDone] = useState<number | null>(null)
  const [startedProject, setStartedProject] = useState<Project | null>(null)

  const go = (next: Screen, direction: number) => {
    setDir(direction)
    setScreen(next)
  }

  const activeTab: TabId =
    screen === 'scenarios' || screen === 'catalog'
      ? 'scenarios'
      : screen === 'project'
        ? 'myhome'
        : screen

  const openScenario = (id: string) => {
    setScenarioId(id)
    go('catalog', 1)
  }

  const openProject = (id: string) => {
    setProjectId(id)
    go('project', 1)
  }

  const approveProject = (id: string) => {
    setProjects((ps) =>
      ps.map((p) => (p.id === id ? { ...p, status: 'active' as const, currentStage: 0 } : p)),
    )
    const p = projects.find((x) => x.id === id)
    if (p) setStartedProject(p)
  }

  const advanceStage = (id: string) => {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === id && p.status === 'active'
          ? { ...p, currentStage: Math.min(p.currentStage + 1, PROJECT_STAGES.length - 1) }
          : p,
      ),
    )
  }

  const project = projects.find((p) => p.id === projectId) ?? projects[0]

  return (
    <div className="flex h-full justify-center bg-[#0c1524]">
      {/* Мобильный контейнер */}
      <div className="relative h-full w-full max-w-[430px] overflow-hidden bg-bg shadow-[0_0_80px_rgb(0_0_0/0.5)]">
        {/* Экраны с направленными слайдами */}
        <AnimatePresence custom={dir} mode="popLayout" initial={false}>
          <motion.div
            key={screen}
            custom={dir}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 bg-bg"
          >
            {screen === 'home' && (
              <Home
                onProfile={() => setProfileOpen(true)}
                onAskAI={(t) => setAiTask(t)}
                onScenario={openScenario}
              />
            )}
            {screen === 'scenarios' && (
              <Scenarios onProfile={() => setProfileOpen(true)} onScenario={openScenario} />
            )}
            {screen === 'catalog' && (
              <CatalogScreen
                scenarioId={scenarioId}
                onBack={() => go('scenarios', -1)}
                onProfile={() => setProfileOpen(true)}
                onEstimate={(t) => setAiTask(t)}
              />
            )}
            {screen === 'myhome' && (
              <MyHomeTab
                onProfile={() => setProfileOpen(true)}
                onProject={openProject}
                onGoHome={() => go('home', -1)}
                onOrder={(total) => {
                  cart.clear()
                  setOrderDone(total)
                }}
                projects={projects}
                onApproveProject={approveProject}
              />
            )}
            {screen === 'project' && project && (
              <ProjectScreen
                project={project}
                onBack={() => go('myhome', -1)}
                onAdvance={advanceStage}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Нижняя навигация — 3 таба */}
        <BottomNav
          active={activeTab}
          onTab={(id) => {
            const order: TabId[] = ['home', 'scenarios', 'myhome']
            go(id, order.indexOf(id) >= order.indexOf(activeTab) ? 1 : -1)
          }}
        />

        {/* Профиль */}
        <AnimatePresence>
          {profileOpen && <ProfileSheet onClose={() => setProfileOpen(false)} />}
        </AnimatePresence>

        {/* ИИ-подборка товаров ОМА */}
        <AnimatePresence>
          {aiTask && (
            <AIResultSheet
              task={aiTask}
              onClose={() => setAiTask(null)}
              onToCart={() => {
                setAiTask(null)
                go('myhome', 1)
              }}
              onToProjects={({ title, crew, lines, itemsTotal, crewTotal }) => {
                const id = 'p' + Date.now()
                setProjects((ps) => [
                  { id, title, crew, items: lines, itemsTotal, crewTotal, status: 'pending', currentStage: 0 },
                  ...ps,
                ])
                setAiTask(null)
                go('myhome', 1)
              }}
            />
          )}
        </AnimatePresence>

        {/* Тост: проект запущен */}
        <AnimatePresence>
          {startedProject && (
            <StartToast project={startedProject} onClose={() => setStartedProject(null)} />
          )}
        </AnimatePresence>

        {/* Подтверждение заказа из корзины */}
        <AnimatePresence>
          {orderDone !== null && (
            <OrderToast total={orderDone} onClose={() => setOrderDone(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StartToast({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="relative flex w-full flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-lift"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50"
        >
          <Users size={32} className="text-brand-600" />
        </motion.span>
        <h2 className="text-[18px] font-black text-navy">Проект запущен!</h2>
        <p className="text-[13px] leading-relaxed text-muted">
          Бригада <b className="text-navy">{project.crew?.name}</b> свяжется для
          замера ({project.crew?.term}). Сумма пакета{' '}
          <b className="text-navy">{byn(projectTotal(project))}</b>. Следите за
          этапами в карточке проекта.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="mt-2 h-11 w-full rounded-lg bg-brand-600 text-[14px] font-semibold text-white transition-colors active:bg-brand-700"
        >
          Отлично
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

function OrderToast({ total, onClose }: { total: number; onClose: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-navy/50 backdrop-blur-[2px]" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.85, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        className="relative flex w-full flex-col items-center gap-3 rounded-3xl bg-white p-6 text-center shadow-lift"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 18, delay: 0.1 }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50"
        >
          <CheckCircle2 size={36} className="text-emerald-500" />
        </motion.span>
        <h2 className="text-[18px] font-black text-navy">Заказ оформлен!</h2>
        <p className="text-[13px] leading-relaxed text-muted">
          Сумма <b className="text-navy">{byn(total)}</b>. Товары зарезервированы в
          магазине ОМА — заберите сегодня до 22:00 или закажите доставку с подъёмом.
        </p>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="mt-2 h-11 w-full rounded-lg bg-brand-600 text-[14px] font-semibold text-white transition-colors active:bg-brand-700"
        >
          Отлично
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}
