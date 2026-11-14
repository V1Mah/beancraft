# BeanCraft — кофейня

Лендинг кофейни с онлайн-меню, корзиной и формой заказа. Демо: https://v1mah.github.io/beancraft/

## Стек
- Клиент: React, Vite, TypeScript, SCSS
- Сервер: Node.js, Express, TypeScript (`/server`)

## Возможности
- Hero, карточки преимуществ, меню с фильтром по категориям
- Корзина с количеством и итогом, форма заказа с валидацией
- Адаптивная вёрстка: мобильный (375px, бургер-меню), планшет (768px), десктоп (1280px+)
- Графика нарисована SVG/CSS, без внешних изображений
- Меню грузится из API; если сервер недоступен (GitHub Pages) — берётся встроенный `src/data/menu.json`, а отправка заказа имитируется

## Запуск клиента
```bash
npm install
npm run dev      # http://localhost:5173/beancraft/
npm run build
```

## Запуск сервера
```bash
cd server
npm install
npm run dev      # http://localhost:3001
npm run build && npm start
```
- `GET /api/menu` — список позиций
- `POST /api/orders` — `{ name, phone, address, items: [{ id, qty }] }`, сохраняет в `server/data/orders.json`, возвращает `{ id, total }`

Чтобы клиент ходил на локальный API: `VITE_API_URL=http://localhost:3001/api npm run dev`.

## Деплой
GitHub Actions (`.github/workflows/deploy.yml`) собирает проект и публикует `dist` на GitHub Pages.
