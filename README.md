# SomewhereElse Companion

**Version:** a12-e

D&D companion Telegram Mini App для групових та приватних чатів.
Довгострокова мета — повноцінна альтернатива Roll20.

> Idea: Baraniuk · Code: Claude (Anthropic AI Assistant)

---

## Швидкий старт

```bash
python3 "a11 - extended/server.py"
# → http://localhost:8080
```

Або відкрий через Telegram Mini App (webhook налаштовано в `Bot/bot_v6.py`).

---

## Структура проєкту

```
a11 - extended/
├── index.html                        # Головний хаб
├── server.py                         # Локальний dev сервер (порт 8080)
│
├── shared/
│   ├── styles.css                    # Єдине джерело стилів (medieval D&D тема)
│   ├── main.js                       # Ініціалізація хабу, логіка гаманця
│   ├── supabase.js                   # Supabase client + DB helper функції
│   ├── telegram.js                   # Telegram WebApp SDK helpers
│   ├── game-loader.js                # Динамічне завантаження міні-ігор
│   ├── feature-loader.js             # Динамічне завантаження campaign features
│   │
│   ├── games/
│   │   ├── lockpicking/              # Скайрімський замок (skill-based)
│   │   ├── qte/                      # Quick Time Event (рефлекси)
│   │   ├── minigame1/                # KnuckleBones v2 (кістки, ставки)
│   │   └── slots/                    # Tavern Slots v2 (слоти, ставки)
│   │
│   └── features/
│       └── ship-management/          # Оснащення та покупка кораблів
│
├── dm/index.html                     # DM панель (тільки для Dungeon Master)
├── inventory/index.html              # Placeholder
├── map/index.html                    # Placeholder
├── notes/index.html                  # Placeholder
│
└── assets/
    ├── ships/                        # Зображення кораблів
    ├── icons/                        # Іконки модулів (гармати, корпуси)
    └── backgrounds/                  # Фонові зображення

Bot/
└── bot_v6.py                         # Telegram бот (python-telegram-bot)
```

---

## Tech Stack

| Шар | Технологія |
|-----|-----------|
| Frontend | Vanilla JS, HTML, CSS |
| Platform | Telegram Mini App (WebApp SDK) |
| Backend | Supabase (PostgreSQL + Realtime) |
| Bot | Python · python-telegram-bot |

---

## Основні системи

### Гаманець
Зберігається в `localStorage` під двома ключами для сумісності з міні-іграми:
- `companion_wallet` — `{ gold, silver, copper }`
- `companion-gold` — число (читається іграми)

### Міні-ігри
Кожна гра — окрема папка `shared/games/{id}/` з `game-config.js` та `index.html`.
Список у `AVAILABLE_GAMES` в `game-loader.js`. Картки рендеряться автоматично.

### Campaign Features
Кожна фіча — `shared/features/{id}/` з `feature-config.js` та `index.html`.
Список у `AVAILABLE_FEATURES` в `feature-loader.js`.

### Ship Management
Гравці обирають оснащення/корабель → надсилають запит DM → DM approve/reject у DM панелі.
Бюджет команди (GP) встановлює DM у своїй панелі → синхронізується через Supabase.

**Поточний корабель:** White Wolf
**Доступні гармати:** Альбатрос · Контроль · Муха
**Доступні корпуси:** Укріплене дерево · Метал Тонк
**Кораблі:** Вітер Кортора (1350 gp) · Корпус КРЕСТ (1850 gp)

### DM Панель
- Доступ: тільки якщо `telegram_id` є `dm_id` активної кампанії
- Dev режим (localhost): автоматично `id: 123456789`
- Функції: Approve/Reject запитів, встановлення бюджету команди, перегляд гравців
- Realtime: підписка на `ship_actions` без перезавантаження

---

## Supabase

**Project ID:** `xohzvemfeqqcijcipcwj` (eu-west-1)

| Таблиця | Призначення |
|---------|-------------|
| `players` | Telegram користувачі |
| `characters` | Персонажі гравців |
| `campaigns` | D&D кампанії |
| `campaign_participants` | Зв'язок персонажів з кампаніями |
| `ships` | Стан корабля + бюджет команди |
| `ship_actions` | Запити гравців → DM схвалює/відхиляє |
| `game_results` | Результати міні-ігор |
| `active_games` | Активні ігри (real-time) |
| `dice_rolls` | Історія кидків кубиків |

**Активна кампанія:** `39d3349e-8cc6-4bf1-b07a-a89bd45a0831` — *Pirates of the Caribbean Seas*

---

## Тестові акаунти

| Telegram ID | Ім'я | Роль |
|-------------|------|------|
| `123456789` | dm_master | DM (dev fallback) |
| `111111111` | Dummy | Гравець |
| `222222222` | Dummy2 | Гравець |

---

## Бот

```bash
pip install python-telegram-bot --break-system-packages
python3 Bot/bot_v6.py
```

Команди: `/start` · `/sheet` · `/combat` · `/games`

---

## Changelog

| Версія | Дата | Зміни |
|--------|------|-------|
| a12-e | 2026-04-20 | Ship Management підключено, DM Crew Budget, виправлено баги INSERT/export, нові гармати/корпуси/кораблі з іконками |
| a11-e | 2026-04-15 | Перша повна версія: хаб, гаманець, міні-ігри, DM панель, Supabase інфраструктура |
