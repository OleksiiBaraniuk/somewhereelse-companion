# SomewhereElse Companion — Claude Code Instructions

## Project Overview

D&D companion Telegram Mini App для групових та приватних чатів.
Довгострокова мета: повноцінна альтернатива Roll20.

**Робоча папка проєкту:** `a11 - extended/`
**Репозиторій:** https://github.com/OleksiiBaraniuk/somewhereelse-companion
**Локальний сервер:** `python3 "a11 - extended/server.py"` → http://localhost:8080

**Credits Convention:** All files must include:
```
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
```

---

## Tech Stack

- **Frontend:** Vanilla JavaScript, HTML, CSS (Telegram Mini App)
- **Backend:** Supabase (PostgreSQL + Realtime) — project id: `xohzvemfeqqcijcipcwj`
- **Bot:** Python (`python-telegram-bot`) — `bot_v6.py`
- **Platform:** Telegram (private chats + group chats)

---

## Структура файлів

```
a11 - extended/
├── index.html                          # Головний хаб / dashboard
├── server.py                           # Локальний dev сервер (порт 8080)
│
├── shared/
│   ├── styles.css                      # Єдине джерело стилів (medieval D&D тема)
│   ├── main.js                         # Ініціалізація хабу, логіка гаманця
│   ├── supabase.js                     # Supabase client + всі DB helper функції
│   ├── telegram.js                     # Telegram WebApp SDK helpers
│   ├── game-loader.js                  # Динамічне завантаження міні-ігор
│   ├── feature-loader.js               # Динамічне завантаження campaign features
│   │
│   ├── games/                          # Міні-ігри (кожна — окрема папка)
│   │   ├── lockpicking/                # Скайрімський замок (skill-based)
│   │   ├── qte/                        # Quick Time Event (рефлекси)
│   │   ├── minigame1/                  # KnuckleBones v2 (кістки, ставки)
│   │   └── slots/                      # Tavern Slots v2 (слоти, ставки)
│   │
│   └── features/                       # Campaign Features (кожна — окрема папка)
│       └── ship-management/            # ⚠️ IN PROGRESS — немає index.html
│
├── dm/
│   └── index.html                      # DM панель (тільки для Dungeon Master)
│
├── inventory/index.html                # Placeholder
├── map/index.html                      # Placeholder
├── notes/index.html                    # Placeholder
│
└── assets/                             # Зображення та медіа
    ├── ships/                          # Зображення кораблів (для Ship Management)
    ├── icons/                          # Іконки модулів
    └── backgrounds/                   # Фонові зображення
```

---

## Системи та як вони працюють

### 1. Навігація
Кожен модуль — окремий `index.html`. Навігація через `window.location.href`:
```javascript
window.location.href = 'inventory/index.html'      // з хабу
window.location.href = '../index.html'              // назад до хабу
window.location.href = '../../index.html'           // з shared/games/*/
```
Завжди використовувати `showBackButton()` з `telegram.js` на sub-сторінках.

### 2. Динамічний рендер ігор та фіч
**Ігри** (`shared/game-loader.js`):
- Список в `AVAILABLE_GAMES = ['lockpicking', 'qte', 'minigame1', 'slots']`
- Кожна гра має `game-config.js` (id, icon, title, description, status, tags)
- `renderGames()` в `main.js` рендерить картки в `#gamesContainer`
- Навігація: `shared/games/{id}/index.html`

**Features** (`shared/feature-loader.js`):
- Список в `AVAILABLE_FEATURES = ['ship-management']`
- Кожна фіча має `feature-config.js`
- `renderFeatures()` рендерить в `#campaignFeatures`
- Навігація: `shared/features/{id}/index.html`

### 3. Гаманець (Wallet)
Зберігається в `localStorage`:
- `companion_wallet` — JSON: `{ gold: 0, silver: 0, copper: 0 }` (повний гаманець)
- `companion-gold` — число (тільки золото, для сумісності з іграми)

**Важливо:** `saveWallet()` в `main.js` записує **обидва** ключі синхронно.
`loadWallet()` при завантаженні автоматично синхронізує `companion-gold` → `companion_wallet.gold`.

Ігри читають золото так:
```javascript
const GOLD_KEY = 'companion-gold'
let balance = parseInt(localStorage.getItem(GOLD_KEY) || '0')
localStorage.setItem(GOLD_KEY, balance) // після зміни
```

### 4. DM Панель (`dm/index.html`)
- Перевіряє `telegram_id` поточного юзера проти `campaigns.dm_id` в Supabase
- Якщо збіг → показує панель. Якщо ні → Access Denied
- Supabase Realtime підписка на `ship_actions` → оновлення без перезавантаження
- DM може Approve/Reject запити гравців з нотаткою

**Dev режим (localhost):** автоматично заходить як `id: 123456789` (dm_master) = DM кампанії.

### 5. Supabase
**Project:** `xohzvemfeqqcijcipcwj` (eu-west-1)
**Anon key** знаходиться в `shared/supabase.js`

**Таблиці:**

| Таблиця | Призначення |
|---------|-------------|
| `players` | Telegram користувачі |
| `characters` | Персонажі гравців |
| `campaigns` | D&D кампанії (dm_id → DM кампанії) |
| `campaign_participants` | Зв'язок персонажів з кампаніями |
| `game_sessions` | Ігрові сесії в рамках кампанії |
| `game_results` | Результати міні-ігор |
| `active_games` | Активні ігри (real-time моніторинг) |
| `dice_rolls` | Історія кидків кубиків |
| `ships` | Стан корабля (один на кампанію) |
| `ship_actions` | Запити гравців → DM схвалює/відхиляє |

**Claude має доступ до Supabase через MCP** — може робити міграції та SQL запити напряму.

**Тестові гравці в DB:**
- `123456789` — dm_master "Dungeon Master" (DM кампанії в dev режимі)
- `111111111` — dummy "Dummy" (тест)
- `222222222` — dummy2 "Dummy2" (тест)

**Активна кампанія:**
- ID: `39d3349e-8cc6-4bf1-b07a-a89bd45a0831`
- Назва: "Pirates of the Caribbean Seas"
- DM: `123456789`

---

## Додавання нового модуля

1. Створити `{module-name}/index.html`
2. Імпортувати `shared/styles.css` та `shared/telegram.js`
3. Викликати `showBackButton()` при ініціалізації
4. Додати кнопку навігації в `index.html` хаб
5. Додати credits коментар

## Додавання нової міні-гри

1. Створити `shared/games/{game-id}/game-config.js` з метаданими
2. Створити `shared/games/{game-id}/index.html`
3. Додати `'{game-id}'` до `AVAILABLE_GAMES` в `shared/game-loader.js`
4. Картка автоматично з'явиться на хабі через `renderGames()`
5. Для читання гаманця: `localStorage.getItem('companion-gold')`

## Додавання нової Campaign Feature

1. Створити `shared/features/{feature-id}/feature-config.js`
2. Створити `shared/features/{feature-id}/index.html`
3. Додати `'{feature-id}'` до `AVAILABLE_FEATURES` в `shared/feature-loader.js`

---

## Стилі

**Одне джерело:** `shared/styles.css` — ніколи не дублювати стилі в окремих файлах.

CSS змінні теми:
```css
--bg-primary: #1a0f0a
--accent-gold: #d4af37
--accent-orange: #e67e22
--font-primary: 'Georgia', serif
```

---

## Telegram Specifics

- **Dev режим (localhost):** user id `123456789` (dm_master)
- **Тест як інший юзер:** `?tg_user_id=111111111` в URL
- **Group chats:** URL параметри `?tg_user_id=...&tg_first_name=...`
- **User resolution:** Telegram WebApp API → URL params → dev fallback

---

## Code Style

- ES Modules (`import/export`) скрізь
- Async/await для всіх DB та API викликів
- `console.log` з emoji префіксами: `✅ 🎮 ⚠️ 📊`
- Помилки через `showAlert()` з `telegram.js`
- Українські коментарі — ок; назви функцій та exports — англійською

---

## Bot (`bot_v6.py`)

- Framework: `python-telegram-bot`
- Install: `pip install python-telegram-bot --break-system-packages`
- Commands: `/start`, `/sheet`, `/combat`, `/games`
- Не використовувати `thumb_url` (deprecated)

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
