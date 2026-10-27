import type { Crew } from './data'
import type { CartLine } from './cart'

export type ProjectStatus = 'pending' | 'active'

export interface Project {
  id: string
  title: string
  crew?: Crew
  items: CartLine[]
  itemsTotal: number
  crewTotal: number
  status: ProjectStatus
  /** индекс текущего этапа для активных проектов */
  currentStage: number
}

export const PROJECT_STAGES = [
  { name: 'Замер и подтверждение сметы', price: 0 },
  { name: 'Доставка материалов с подъёмом', price: 0 },
  { name: 'Черновые работы', price: 0 },
  { name: 'Чистовые работы и приёмка', price: 0 },
]

export const DEMO_PROJECT: Project = {
  id: 'demo-bath',
  title: 'Ремонт ванной',
  crew: undefined,
  items: [],
  itemsTotal: 4350,
  crewTotal: 0,
  status: 'active',
  currentStage: 1,
}

export const projectTotal = (p: Project) => p.itemsTotal + p.crewTotal
