import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { loadMenu, sendOrder } from './api'
import type { MenuItem } from './api'
import { Bean, CoffeeCup } from './art'

const NAV = [
  ['features', 'Преимущества'],
  ['menu', 'Меню'],
  ['order', 'Заказ'],
  ['about', 'О нас'],
] as const

const FEATURES = [
  ['★', 'Премиальное качество', 'Зёрна арабики от проверенных обжарщиков, свежий помол для каждой чашки.'],
  ['➤', 'Быстрая доставка', 'Привезём горячий кофе за 30–40 минут по всему городу.'],
  ['♨', 'Уютная атмосфера', 'Тёплый свет, мягкие кресла и музыка, в которой хочется задержаться.'],
  ['✦', 'Бонусы и акции', 'Каждая десятая чашка в подарок и сезонные скидки для постоянных гостей.'],
]

const rub = (n: number) => `${n.toLocaleString('ru-RU')} ₽`

export default function App() {
  const [menu, setMenu] = useState<MenuItem[]>([])
  const [offline, setOffline] = useState(false)
  const [cat, setCat] = useState('Все')
  const [cart, setCart] = useState<Record<number, number>>({})
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', address: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ id: string; simulated: boolean } | null>(null)
  const [fail, setFail] = useState('')

  useEffect(() => {
    loadMenu().then((r) => {
      setMenu(r.items)
      setOffline(r.offline)
    })
  }, [])

  const cats = useMemo(() => ['Все', ...new Set(menu.map((m) => m.category))], [menu])
  const shown = cat === 'Все' ? menu : menu.filter((m) => m.category === cat)
  const lines = menu.filter((m) => cart[m.id])
  const total = lines.reduce((s, m) => s + m.price * cart[m.id], 0)
  const count = lines.reduce((s, m) => s + cart[m.id], 0)

  const change = (id: number, d: number) =>
    setCart((c) => {
      const q = (c[id] ?? 0) + d
      const n = { ...c }
      if (q <= 0) delete n[id]
      else n[id] = q
      return n
    })

  function validate() {
    const e: Record<string, string> = {}
    if (form.name.trim().length < 2) e.name = 'Введите имя (минимум 2 символа)'
    if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Введите корректный номер телефона'
    if (form.address.trim().length < 5) e.address = 'Укажите адрес доставки'
    if (!count) e.cart = 'Добавьте в корзину хотя бы одну позицию'
    setErrors(e)
    return !Object.keys(e).length
  }

  async function submit(ev: FormEvent) {
    ev.preventDefault()
    setFail('')
    if (!validate()) return
    setBusy(true)
    try {
      const r = await sendOrder({
        ...form,
        name: form.name.trim(),
        address: form.address.trim(),
        items: lines.map((m) => ({ id: m.id, qty: cart[m.id] })),
      })
      setDone(r)
      setCart({})
      setForm({ name: '', phone: '', address: '' })
    } catch (e) {
      setFail(e instanceof Error ? e.message : 'Не удалось отправить заказ')
    } finally {
      setBusy(false)
    }
  }

  const field = (k: 'name' | 'phone' | 'address', label: string, ph: string, type = 'text') => (
    <label className={`field ${errors[k] ? 'has-error' : ''}`}>
      <span>{label}</span>
      <input
        type={type}
        value={form[k]}
        placeholder={ph}
        onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        aria-invalid={!!errors[k]}
      />
      {errors[k] && <em>{errors[k]}</em>}
    </label>
  )

  return (
    <>
      <header className="header">
        <div className="container header__in">
          <a className="logo" href="#top" onClick={() => setOpen(false)}>
            <Bean className="logo__bean" /> BeanCraft
          </a>
          <nav className={`nav ${open ? 'is-open' : ''}`} aria-label="Основная навигация">
            {NAV.map(([id, t]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                {t}
              </a>
            ))}
          </nav>
          <a className="cart-pill" href="#order" aria-label={`Корзина: ${count}`}>
            Корзина <b>{count}</b>
          </a>
          <button
            className={`burger ${open ? 'is-open' : ''}`}
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <Bean className="hero__bean b1" />
          <Bean className="hero__bean b2" />
          <Bean className="hero__bean b3" />
          <div className="container hero__in">
            <div className="hero__text">
              <span className="eyebrow">Кофейня · доставка · самовывоз</span>
              <h1>Больше, чем просто кофе</h1>
              <p>Атмосфера. Вкус. Настроение.</p>
              <a className="btn" href="#menu">
                Посмотреть меню
              </a>
            </div>
            <div className="hero__art">
              <CoffeeCup />
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <h2>Почему BeanCraft</h2>
            <div className="grid features">
              {FEATURES.map(([i, t, d]) => (
                <article className="card feature" key={t}>
                  <div className="feature__icon">{i}</div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="menu">
          <div className="container">
            <h2>Наше меню</h2>
            {offline && menu.length > 0 && (
              <p className="note">Демо-режим: меню загружено из встроенного файла (сервер недоступен).</p>
            )}
            <div className="filters" role="tablist">
              {cats.map((c) => (
                <button key={c} className={`chip ${c === cat ? 'is-active' : ''}`} onClick={() => setCat(c)}>
                  {c}
                </button>
              ))}
            </div>
            <div className="grid menu">
              {shown.map((m) => (
                <article className="card dish" key={m.id}>
                  <div className="dish__art" data-cat={m.category}>
                    <Bean />
                  </div>
                  <span className="dish__cat">{m.category}</span>
                  <h3>{m.name}</h3>
                  <p>{m.description}</p>
                  <div className="dish__foot">
                    <strong>
                      {m.from ? 'от ' : ''}
                      {rub(m.price)}
                    </strong>
                    <button className="btn btn--sm" onClick={() => change(m.id, 1)}>
                      {cart[m.id] ? `В корзине: ${cart[m.id]}` : 'В корзину'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="order">
          <div className="container order">
            <div className="card cart">
              <h2>Корзина</h2>
              {lines.length === 0 ? (
                <p className="muted">Пока пусто — выберите что-нибудь вкусное в меню.</p>
              ) : (
                <ul>
                  {lines.map((m) => (
                    <li key={m.id}>
                      <span className="cart__name">{m.name}</span>
                      <span className="qty">
                        <button aria-label="Меньше" onClick={() => change(m.id, -1)}>
                          −
                        </button>
                        <b>{cart[m.id]}</b>
                        <button aria-label="Больше" onClick={() => change(m.id, 1)}>
                          +
                        </button>
                      </span>
                      <span className="cart__sum">{rub(m.price * cart[m.id])}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="cart__total">
                <span>Итого</span>
                <strong>{rub(total)}</strong>
              </div>
              {errors.cart && <p className="error">{errors.cart}</p>}
            </div>

            <div className="card">
              <h2>Оформить заказ</h2>
              {done ? (
                <div className="success" role="status">
                  <div className="success__icon">✓</div>
                  <h3>Спасибо, заказ принят!</h3>
                  <p>
                    Номер заказа: <b>{done.id}</b>. Мы скоро позвоним для подтверждения.
                  </p>
                  {done.simulated && <p className="muted">Демо-режим: заказ имитирован, сервер не подключён.</p>}
                  <button className="btn btn--sm" onClick={() => setDone(null)}>
                    Новый заказ
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate>
                  {field('name', 'Имя', 'Как к вам обращаться')}
                  {field('phone', 'Телефон', '+7 900 000-00-00', 'tel')}
                  {field('address', 'Адрес доставки', 'Улица, дом, квартира')}
                  {fail && <p className="error">{fail}</p>}
                  <button className="btn btn--block" disabled={busy}>
                    {busy ? 'Отправляем…' : `Заказать · ${rub(total)}`}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="section section--alt" id="about">
          <div className="container about">
            <div>
              <h2>О нас</h2>
              <p>
                BeanCraft — небольшая кофейня, где всё делается руками: мы сами выбираем зерно, настраиваем помол
                и варим каждую чашку так, как варили бы для друзей.
              </p>
              <p>
                Приходите посидеть с книгой или закажите доставку — мы хотим, чтобы любое утро начиналось с хорошего
                вкуса.
              </p>
            </div>
            <ul className="stats">
              <li><b>12</b><span>позиций в меню</span></li>
              <li><b>30 мин</b><span>средняя доставка</span></li>
              <li><b>8–22</b><span>работаем ежедневно</span></li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__in">
          <span className="logo">
            <Bean className="logo__bean" /> BeanCraft
          </span>
          <span>г. Москва, ул. Кофейная, 12 · +7 900 000-00-00</span>
          <span>© 2026 BeanCraft. Учебный демо-проект.</span>
        </div>
      </footer>
    </>
  )
}
