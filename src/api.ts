import fallbackMenu from './data/menu.json'

export interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  from: boolean
  description: string
}
export interface OrderPayload {
  name: string
  phone: string
  address: string
  items: { id: number; qty: number }[]
}

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? `${import.meta.env.BASE_URL}api`

async function withTimeout(url: string, init?: RequestInit, ms = 2500) {
  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort(), ms)
  try {
    return await fetch(url, { ...init, signal: ctl.signal })
  } finally {
    clearTimeout(t)
  }
}

export async function loadMenu(): Promise<{ items: MenuItem[]; offline: boolean }> {
  try {
    const r = await withTimeout(`${API}/menu`)
    if (!r.ok || !r.headers.get('content-type')?.includes('json')) throw new Error('bad')
    return { items: (await r.json()) as MenuItem[], offline: false }
  } catch {
    return { items: fallbackMenu as MenuItem[], offline: true }
  }
}

/** Отправка заказа. Если API недоступен (GitHub Pages) — имитируем успех. */
export async function sendOrder(p: OrderPayload): Promise<{ id: string; simulated: boolean }> {
  try {
    const r = await withTimeout(
      `${API}/orders`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) },
      3500,
    )
    if (r.status === 400) throw new Error('Проверьте правильность данных')
    if (!r.ok || !r.headers.get('content-type')?.includes('json')) throw new Error('offline')
    const d = (await r.json()) as { id: string }
    return { id: d.id, simulated: false }
  } catch (e) {
    if (e instanceof Error && e.message === 'Проверьте правильность данных') throw e
    return { id: 'DEMO-' + Math.random().toString(36).slice(2, 7).toUpperCase(), simulated: true }
  }
}
