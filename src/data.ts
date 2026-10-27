import {
  Bath,
  CookingPot,
  Zap,
  Wrench,
  Sofa,
  PaintRoller,
  Layers,
  Lamp,
  AppWindow,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

/* ============================================================
   Каталог ОМА (по образцу oma.by; цены реалистичные, BYN)
   ============================================================ */

export interface OmaProduct {
  id: string
  name: string
  brand: string
  spec: string
  price: number
  unit?: string
  badge?: 'акция' | 'прокат' | 'хит'
  category: string
}

export const PRODUCTS: Record<string, OmaProduct[]> = {
  bath: [
    { id: 'b1', name: 'Керамогранит 60×60 см', brand: 'Cersanit', spec: 'серый матовый, 1.44 м² в уп.', price: 68.9, badge: 'хит', category: 'Ванная' },
    { id: 'b2', name: 'Плитка настенная 25×75', brand: 'Cersanit', spec: 'белая глянец, 1.125 м² в уп.', price: 54.5, category: 'Ванная' },
    { id: 'b3', name: 'Смеситель для раковины', brand: 'Grohe Eurosmart', spec: 'хром, с донным клапаном', price: 189.0, badge: 'акция', category: 'Ванная' },
    { id: 'b4', name: 'Раковина накладная 60 см', brand: 'Cersanit', spec: 'керамика, белая', price: 132.0, category: 'Ванная' },
    { id: 'b5', name: 'Гидроизоляция обмазочная', brand: 'ЦЕРЕСИТ CR 65', spec: '5 кг, эластичная', price: 46.9, category: 'Ванная' },
    { id: 'b6', name: 'Клей плиточный усиленный', brand: 'ilmax 6100', spec: '25 кг, для керамогранита', price: 24.9, category: 'Ванная' },
    { id: 'b7', name: 'Затирка эпоксидная', brand: 'ilmax 6420', spec: '3 кг, серая, водоотталкивающая', price: 79.0, category: 'Ванная' },
    { id: 'b8', name: 'Полотенцесушитель', brand: 'Terminus', spec: 'М-образный, 60×40, хром', price: 218.0, category: 'Ванная' },
    { id: 'b9', name: 'Тёплый пол мат', brand: 'Devi', spec: '3.5 м², 500 Вт', price: 286.0, badge: 'хит', category: 'Ванная' },
    { id: 'b10', name: 'Душевая система', brand: 'Ravak', spec: 'штанга + верхний душ, хром', price: 245.0, category: 'Ванная' },
  ],
  electric: [
    { id: 'e1', name: 'Кабель ВВГнг 3×2.5', brand: 'Bylectrica', spec: 'бухта 50 м, медь', price: 142.5, badge: 'хит', category: 'Электрика' },
    { id: 'e2', name: 'Розетка с заземлением', brand: 'Schneider AtlasDesign', spec: '16А, белая, IP20', price: 8.9, category: 'Электрика' },
    { id: 'e3', name: 'Выключатель одноклавишный', brand: 'Schneider AtlasDesign', spec: '10А, белая', price: 7.5, category: 'Электрика' },
    { id: 'e4', name: 'Автоматический выключатель', brand: 'IEK', spec: 'C16, 1P, 4.5 кА', price: 12.4, category: 'Электрика' },
    { id: 'e5', name: 'Щиток навесной', brand: 'HENSEL', spec: '12 модулей, IP65', price: 96.0, category: 'Электрика' },
    { id: 'e6', name: 'Гофра ПВХ 16 мм', brand: 'Bylectrica', spec: 'бухта 100 м с зондом', price: 38.9, category: 'Электрика' },
    { id: 'e7', name: 'Клеммы Wago 221-413', brand: 'WAGO', spec: 'комплект 50 шт.', price: 34.0, badge: 'акция', category: 'Электрика' },
    { id: 'e8', name: 'Перфоратор SDS-Plus 800Вт', brand: 'Makita HR2630', spec: 'прокат — сутки, залог', price: 18.0, unit: 'прокат/сутки', badge: 'прокат', category: 'Электрика' },
    { id: 'e9', name: 'Удлинитель на катушке', brand: 'Bylectrica', spec: '40 м, 3 гнезда, 16А', price: 52.0, category: 'Электрика' },
    { id: 'e10', name: 'Светильник LED панель', brand: 'Elektrostandard', spec: '60×60, 40Вт, 4000K', price: 41.9, category: 'Электрика' },
  ],
  floors: [
    { id: 'f1', name: 'Пескобетон М300', brand: 'ilmax industry', spec: '25 кг, для стяжек', price: 8.49, badge: 'хит', category: 'Стяжка и полы' },
    { id: 'f2', name: 'Стяжка полусухая готовая', brand: 'Кнауф Убо', spec: '25 кг, для тёплых полов', price: 14.9, category: 'Стяжка и полы' },
    { id: 'f3', name: 'Демпферная лента', brand: 'Кнауф', spec: '100 мм × 50 м', price: 16.5, category: 'Стяжка и полы' },
    { id: 'f4', name: 'Плёнка гидроизоляционная', brand: 'ОМА', spec: '200 мкм, 4×25 м', price: 29.9, category: 'Стяжка и полы' },
    { id: 'f5', name: 'Профиль маячный 3 м', brand: 'ОМА', spec: 'оцинкованный, 10 мм', price: 3.2, category: 'Стяжка и полы' },
    { id: 'f6', name: 'Ламинат 32 класс', brand: 'Egger Pro', spec: '8 мм, дуб серый, 2.13 м² уп.', price: 44.9, badge: 'акция', category: 'Стяжка и полы' },
    { id: 'f7', name: 'Подложка под ламинат', brand: 'Steico', spec: '3 мм, 10 м² рулон', price: 21.0, category: 'Стяжка и полы' },
    { id: 'f8', name: 'Правило алюминиевое', brand: 'ОМА', spec: '2.5 м, прокат — сутки', price: 9.0, unit: 'прокат/сутки', badge: 'прокат', category: 'Стяжка и полы' },
    { id: 'f9', name: 'Миксер для раствора', brand: 'Зубр', spec: '120×600 мм, прокат', price: 12.0, unit: 'прокат/сутки', badge: 'прокат', category: 'Стяжка и полы' },
    { id: 'f10', name: 'Грунтовка глубокого проникновения', brand: 'ЦЕРЕСИТ CT 17', spec: '10 л', price: 34.9, category: 'Стяжка и полы' },
  ],
  clean: [
    { id: 'c1', name: 'Пылесос строительный', brand: 'Karcher WD 5', spec: 'прокат — сутки, 1100Вт', price: 25.0, unit: 'прокат/сутки', badge: 'прокат', category: 'Уборка' },
    { id: 'c2', name: 'Швабра с ведром-отжимом', brand: 'Vileda UltraMax', spec: 'комплект, микрофибра', price: 42.9, category: 'Уборка' },
    { id: 'c3', name: 'Скребок для стёкол телескопический', brand: 'Karcher', spec: '45 см, лезвие 15 см', price: 18.9, category: 'Уборка' },
    { id: 'c4', name: 'Моющее средство для полов', brand: 'Grass PolMaster', spec: '5 л, универсальное', price: 21.5, category: 'Уборка' },
    { id: 'c5', name: 'Средство удаления цемента', brand: 'Baracella', spec: '1 л, концентрат', price: 15.9, category: 'Уборка' },
    { id: 'c6', name: 'Мешки для мусора 120 л', brand: 'ОМА', spec: 'рулон 20 шт., плотные', price: 9.9, badge: 'акция', category: 'Уборка' },
    { id: 'c7', name: 'Перчатки рабочие с ПВХ', brand: 'ОМА', spec: '12 пар, размер 10', price: 14.4, category: 'Уборка' },
    { id: 'c8', name: 'Респиратор FFP2', brand: '3M', spec: '3 шт., с клапаном', price: 17.7, category: 'Уборка' },
    { id: 'c9', name: 'Плёнка защитная рулон', brand: 'ОМА', spec: '4×50 м, с УФ-стабилизатором', price: 24.5, category: 'Уборка' },
    { id: 'c10', name: 'Стремянка алюминиевая', brand: 'Krause', spec: '4 ступени, 150 кг', price: 89.0, category: 'Уборка' },
  ],
}

/* ---------- Бригады-партнёры ОМА ---------- */
export interface Crew {
  id: string
  name: string
  rating: number
  reviews: number
  rate: number
  rateUnit: string
  term: string
}

export const CREWS: Crew[] = [
  { id: 'masterok', name: 'МастерОК', rating: 4.8, reviews: 214, rate: 35, rateUnit: 'BYN/м²', term: 'старт через 3 дня' },
  { id: 'bylBuilder', name: 'БылБилдер', rating: 4.6, reviews: 156, rate: 28, rateUnit: 'BYN/м²', term: 'старт через 5 дней' },
  { id: 'profiRem', name: 'Проф и Рем', rating: 4.9, reviews: 89, rate: 45, rateUnit: 'BYN/м²', term: 'старт завтра' },
]

/* ---------- ИИ-комплекты по задаче ---------- */
export interface KitItem {
  productId: string
  qty: number
}
export interface Kit {
  id: string
  name: string
  desc: string
  badge?: string
  items: KitItem[]
}

export const KITS: Record<string, Kit[]> = {
  /* пример: пользователь просит «залить стяжку в комнате 20 м²» */
  default: [
    {
      id: 'min',
      name: 'Минимальный',
      desc: 'Всё для стяжки своими руками',
      items: [
        { productId: 'f1', qty: 20 },
        { productId: 'f10', qty: 2 },
        { productId: 'f4', qty: 1 },
        { productId: 'f5', qty: 10 },
        { productId: 'f3', qty: 1 },
        { productId: 'c6', qty: 1 },
        { productId: 'c7', qty: 1 },
      ],
    },
    {
      id: 'std',
      name: 'Стандарт',
      desc: 'Материалы + инструмент в прокат',
      badge: 'Популярный',
      items: [
        { productId: 'f1', qty: 22 },
        { productId: 'f10', qty: 2 },
        { productId: 'f4', qty: 1 },
        { productId: 'f5', qty: 10 },
        { productId: 'f3', qty: 1 },
        { productId: 'f8', qty: 2 },
        { productId: 'f9', qty: 2 },
        { productId: 'e8', qty: 2 },
        { productId: 'c6', qty: 2 },
        { productId: 'c7', qty: 1 },
      ],
    },
    {
      id: 'pro',
      name: 'Профессиональный',
      desc: 'Быстрая стяжка, готовые смеси',
      items: [
        { productId: 'f2', qty: 24 },
        { productId: 'f10', qty: 2 },
        { productId: 'f4', qty: 1 },
        { productId: 'f3', qty: 1 },
        { productId: 'f8', qty: 2 },
        { productId: 'f9', qty: 2 },
        { productId: 'e8', qty: 2 },
        { productId: 'c1', qty: 1 },
        { productId: 'c6', qty: 2 },
        { productId: 'c7', qty: 2 },
      ],
    },
  ],
}

export const productById = (id: string) =>
  Object.values(PRODUCTS).flat().find((p) => p.id === id)

/* ---------- Сценарии (плитки) ---------- */
export interface Scenario {
  id: string
  name: string
  icon: LucideIcon
  desc: string
  /** ключ каталога товаров */
  catalog: keyof typeof PRODUCTS
  /** пресет задачи для ИИ */
  task: string
}

export const SCENARIOS: Scenario[] = [
  { id: 'bath', name: 'Ванная', icon: Bath, desc: 'Плитка, сантехника, тёплый пол', catalog: 'bath', task: 'Ремонт ванной: плитка, гидроизоляция, сантехника' },
  { id: 'kitchen', name: 'Кухня', icon: CookingPot, desc: 'Фартук, мойка, техника', catalog: 'clean', task: 'Обустройство кухни: фартук, мойка, уборка после монтажа' },
  { id: 'electric', name: 'Электрика', icon: Zap, desc: 'Кабель, розетки, щиток', catalog: 'electric', task: 'Электрика в комнате: кабель, розетки, щиток' },
  { id: 'plumb', name: 'Сантехника', icon: Wrench, desc: 'Трубы, смесители, слив', catalog: 'bath', task: 'Сантехника: смесители, полотенцесушитель, душ' },
  { id: 'furniture', name: 'Мебель', icon: Sofa, desc: 'Сборка и на заказ', catalog: 'clean', task: 'Сборка мебели, стремянка, уборка' },
  { id: 'walls', name: 'Стены', icon: PaintRoller, desc: 'Шпаклёвка, покраска', catalog: 'floors', task: 'Выравнивание и отделка стен' },
  { id: 'floors', name: 'Стяжка и полы', icon: Layers, desc: 'Смеси, ламинат, подложка', catalog: 'floors', task: 'Залить стяжку в комнате 20 м², потом ламинат' },
  { id: 'ceiling', name: 'Потолок', icon: Lamp, desc: 'Натяжные, светильники', catalog: 'electric', task: 'Потолок: LED-панели, кабель, светильники' },
  { id: 'windows', name: 'Окна', icon: AppWindow, desc: 'Замена и откосы', catalog: 'floors', task: 'Откосы и подоконники после замены окон' },
  { id: 'clean', name: 'Уборка', icon: Sparkles, desc: 'После ремонта', catalog: 'clean', task: 'Уборка после ремонта: пылесос, средства, мешки' },
]

export const DEFAULT_TASK = 'Залить стяжку в комнате 20 м² под ламинат'

export const byn = (n: number) =>
  n.toLocaleString('ru-RU', { maximumFractionDigits: 2 }) + ' BYN'
