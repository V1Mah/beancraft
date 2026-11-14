import express from 'express'
import cors from 'cors'
import { readFile, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(dir, '../data')
const menuFile = path.join(dataDir, 'menu.json')
const ordersFile = path.join(dataDir, 'orders.json')

interface MenuItem { id: number; price: number; name: string }
interface OrderItem { id: number; qty: number }

const app = express()
app.use(cors())
app.use(express.json({ limit: '50kb' }))

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(file, 'utf8')) as T
  } catch {
    return fallback
  }
}

app.get('/api/menu', async (_req, res) => {
  res.json(await readJson<MenuItem[]>(menuFile, []))
})

app.post('/api/orders', async (req, res) => {
  const { name, phone, address, items } = (req.body ?? {}) as Record<string, unknown>
  const errors: string[] = []
  if (typeof name !== 'string' || name.trim().length < 2) errors.push('name')
  if (typeof phone !== 'string' || phone.replace(/\D/g, '').length < 10) errors.push('phone')
  if (typeof address !== 'string' || address.trim().length < 5) errors.push('address')
  const menu = await readJson<MenuItem[]>(menuFile, [])
  const valid =
    Array.isArray(items) &&
    items.length > 0 &&
    items.every(
      (i: OrderItem) => Number.isInteger(i?.qty) && i.qty > 0 && i.qty <= 99 && menu.some((m) => m.id === i.id),
    )
  if (!valid) errors.push('items')
  if (errors.length) {
    res.status(400).json({ error: 'Validation failed', fields: errors })
    return
  }
  const list = items as OrderItem[]
  const total = list.reduce((s, i) => s + (menu.find((m) => m.id === i.id)?.price ?? 0) * i.qty, 0)
  const order = {
    id: randomUUID().slice(0, 8).toUpperCase(),
    name: (name as string).trim(),
    phone: phone as string,
    address: (address as string).trim(),
    items: list,
    total,
    createdAt: new Date().toISOString(),
  }
  const orders = await readJson<unknown[]>(ordersFile, [])
  orders.push(order)
  await writeFile(ordersFile, JSON.stringify(orders, null, 2))
  res.status(201).json({ id: order.id, total })
})

const port = Number(process.env.PORT) || 3001
app.listen(port, () => console.log(`BeanCraft API: http://localhost:${port}`))
