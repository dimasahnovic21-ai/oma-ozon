/* Временный автоматический layout-QA: включается через ?qa=1
   Ищет: переполнение текста, элементы шире вьюпорта, горизонтальный скролл. */
export function runLayoutQA() {
  const report: string[] = []
  const vw = document.documentElement.clientWidth

  // 1. Горизонтальный скролл страницы
  if (document.scrollingElement && document.scrollingElement.scrollWidth > vw + 1) {
    report.push(`PAGE: горизонтальный скролл (${document.scrollingElement.scrollWidth} > ${vw})`)
  }

  // Все видимые элементы
  const all = Array.from(document.querySelectorAll<HTMLElement>('*'))
  const inScroller = (el: HTMLElement) => {
    let p = el.parentElement
    while (p && p !== document.body) {
      const pcs = getComputedStyle(p)
      if (pcs.overflowX === 'auto' || pcs.overflowX === 'scroll' || pcs.overflow === 'hidden') return true
      p = p.parentElement
    }
    return false
  }
  for (const el of all) {
    const cs = getComputedStyle(el)
    if (cs.display === 'none' || cs.visibility === 'hidden') continue
    if (inScroller(el)) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const tag = el.tagName.toLowerCase()
    const cls = (el.className && typeof el.className === 'string') ? el.className.split(' ').slice(0, 3).join('.') : ''
    const id = `${tag}${cls ? '.' + cls : ''}`

    // 2. Элемент выходит за правый/левый край вьюпорта
    if (r.right > vw + 1 && cs.position !== 'fixed') {
      report.push(`OVERFLOW-X: ${id} right=${Math.round(r.right)} > vw=${vw} text="${(el.textContent || '').slice(0, 25)}"`)
    }
    if (r.left < -1 && cs.position !== 'fixed') {
      report.push(`OVERFLOW-X-LEFT: ${id} left=${Math.round(r.left)} text="${(el.textContent || '').slice(0, 25)}"`)
    }

    // 3. Переполнение текста (клип без скролла)
    if (el.scrollWidth > el.clientWidth + 1 && cs.overflowX !== 'auto' && cs.overflowX !== 'scroll') {
      const isSingle = el.children.length === 0
      if (isSingle || tag === 'span' || tag === 'p' || tag === 'h1' || tag === 'h2' || tag === 'button') {
        report.push(`TEXT-CLIP: ${id} scrollW=${el.scrollWidth} clientW=${el.clientWidth} text="${(el.textContent || '').slice(0, 25)}"`)
      }
    }
  }

  const out = report.length ? report.join('\n') : 'OK — переполнений не найдено'
  console.log('[QA]\n' + out)
  const pre = document.createElement('pre')
  pre.id = 'qa-report'
  pre.textContent = out
  pre.style.cssText = 'position:fixed;left:-9999px;top:0;white-space:pre-wrap'
  document.body.appendChild(pre)
}
