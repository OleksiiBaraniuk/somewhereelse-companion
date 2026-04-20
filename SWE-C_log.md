# SWE-C Project Log
# SomewhereElse Companion — Журнал розробки

---

## ✅ Зроблено

### Сесія 1 — 2026-04-15

#### Інфраструктура
- Підключено GitHub репозиторій (`OleksiiBaraniuk/somewhereelse-companion`) до локальної папки `a11 - extended/`
- Файли з GitHub (`index.html`, `shared/`, `Setup.zip`) переміщено в `a11 - extended/` як робочу папку
- Створено `server.py` — локальний dev сервер на порт 8080 (автовідкриває браузер)

#### Хаб (`index.html` + `shared/main.js`)
- Quick Actions тепер модульні: Map / Inventory / Notes → окремі сторінки
- Wallet відкриває модаль з трьома полями: Золото (GP) / Срібло (SP) / Мідь (CP)
- Гаманець зберігається в localStorage під двома ключами:
  - `companion_wallet` — JSON `{gold, silver, copper}`
  - `companion-gold` — число (сумісність з іграми)
- Динамічний бейдж гаманця в Quick Actions
- `#gamesContainer` та `#campaignFeatures` — правильні ID для динамічного рендеру

#### Placeholder сторінки
- `inventory/index.html` — "Coming Soon"
- `map/index.html` — "Coming Soon"
- `notes/index.html` — "Coming Soon"

#### Стилі (`shared/styles.css`)
- Додано `.wallet-coins` для модалі гаманця
- Додано `.placeholder-page`, `.placeholder-icon` для placeholder сторінок

#### Міні-ігри
- `slots-v2.html` → `shared/games/slots/index.html` (Tavern Slots з ставками 50/100/150 GP)
- `knucklebones-v2.html` → `shared/games/minigame1/index.html` (KnuckleBones з ставками 20/40/60/100 GP)
- Обидві ігри читають/пишуть `companion-gold` з localStorage
- `loadWallet()` автоматично синхронізує зміни з ігор назад у гаманець хабу

#### Campaign Features — структура
- Створено `shared/features/` папку
- Створено `shared/features/ship-management/feature-config.js`
- `feature-loader.js` оновлено: `AVAILABLE_FEATURES = ['ship-management']`

#### Supabase
- Підтверджено MCP доступ до проєкту `xohzvemfeqqcijcipcwj`
- Створено таблицю `ships` — стан корабля (hull, sails, crew, cannons, cargo, hp, speed)
- Створено таблицю `ship_actions` — запити гравців з полями: action_type, action_data, status (pending/approved/rejected), dm_note, resolved_at
- RLS налаштовано (спрощено для dev: all read/write через anon key)
- Додано тестових гравців: Dummy (111111111), Dummy2 (222222222)

#### DM Панель (`dm/index.html`)
- Перевірка доступу: `telegram_id` vs `campaigns.dm_id`
- Якщо не DM → Access Denied screen
- Секції: Pending Requests / Players / Recent Activity
- Approve/Reject запитів з полем для DM нотатки
- Supabase Realtime підписка на `ship_actions` — оновлення без перезавантаження
- Stats: кількість pending / гравців / resolved

#### Assets
- Створено `assets/ships/`, `assets/icons/`, `assets/backgrounds/`

---

### Сесія 2 — 2026-04-20 (версія a12-e)

#### Ship Management — підключення до системи
- **Виправлено критичний баг:** `feature-config.js` використовував named export (`export const FEATURE_CONFIG`) замість default export — картка Ship Management не з'являлась на хабі. Виправлено на `export default {...}`
- Feature тепер коректно завантажується через `feature-loader.js` та `renderFeatures()` в `main.js`

#### Supabase — міграції
- Додано колонки до таблиці `ships`: `crew_budget` (integer, default 0), `image_url` (text), `cannon_name` (text), `hull_name` (text)
- Додано унікальний constraint `ships_campaign_id_unique` — один корабель на кампанію
- `ship_actions.ship_id` зроблено nullable (раніше NOT NULL без default → INSERT завжди падав)
- Записано поточний корабель кампанії: **White Wolf** (`/assets/ships/whitewolf-Shop.png`)

#### Ship Management (`shared/features/ship-management/index.html`)
- Баланс команди тепер читається з `ships.crew_budget` в Supabase (раніше з localStorage)
- Виправлено баг запиту до DM: `player_id` передавався як `String()` при типі колонки `bigint` → виправлено на `Number()`
- Оновлено гармати (3 шт.):
  - **Альбатрос** — Пот:1, Швидк.:1, Ентузіаст, 350 gp, іконка PCL.png
  - **Контроль** — Пот:1, Швидк.:░, Проста, 200 gp, іконка PFCL.png
  - **Муха** — Пот:░, Швидк.:2, Ентузіаст, 300 gp, іконка FCL.png
- Оновлено корпуси (2 шт.):
  - **Укріплене дерево** — Захист:1, Проста, 125 gp, іконка W.png
  - **Метал Тонк** — Захист:2, Проста, 215 gp, іконка I.png
- Оновлено кораблі (2 шт.):
  - **Вітер Кортора** — Барс (Пот:2, –1 Швидк.), Укріплене дерево (Захист:1), Швидк. корабля:1, Простий, 1350 gp, WindOfCortor.png
  - **Корпус КРЕСТ** — Манал (Пот:2, +1 Швидк.), Метал тонкий (Захист:2), Швидк. корабля:2, Ентузіаст, 1850 gp, KrestBranch.png
- Виправлено рендер `renderShipSlots`: додано підтримку `fireRate` (позитивна швидкострільність), уніфіковано мітку "–Швидкостріл."
- Всі іконки та зображення кораблів підключено з `assets/`

#### DM Панель (`dm/index.html`) — Crew Budget
- Додано секцію **"💰 Crew Budget"** на DM панель
- DM може бачити поточний бюджет GP та встановлювати новий
- При першому збереженні — створює рядок `ships` з дефолтними значеннями
- При наступних — оновлює `crew_budget` в існуючому рядку
- Ship Management сторінка гравця відображає цей бюджет в реальному часі

---

## 🔄 В процесі

### Ship Management
- Approve від DM не оновлює стан корабля автоматично (потрібен окремий flow)
- Realtime для гравця: сповіщення коли DM approve/reject запит

---

## 📋 Плануємо

### Найближче
- [ ] Підключити реальний `telegram_id` Baraniuk як DM кампанії
- [ ] Протестувати повний flow: гравець → запит → DM панель → approve → корабель оновлюється
- [ ] Ship Management: автооновлення стану корабля після approve DM

### Середньострокове
- [ ] `character-sheet/index.html` — повна карта персонажа
- [ ] `inventory/index.html` — інвентар (зараз placeholder)
- [ ] `notes/index.html` — нотатки кампанії (зараз placeholder)
- [ ] `map/index.html` — карта (зараз placeholder)
- [ ] `combat/index.html` — Combat Tracker

### Довгострокове
- [ ] Character sheet з усіма D&D атрибутами (STR/DEX/CON/INT/WIS/CHA)
- [ ] Dice roller з логуванням в Supabase
- [ ] Campaign participants — прив'язка персонажів до кампаній
- [ ] DM панель розширення: керування кампанією, сесіями, персонажами
- [ ] Telegram бот інтеграція для сповіщень DM
- [ ] Повноцінний Combat Tracker з initiative order

---

## 🗂 Ключові ID та дані

| Ресурс | Значення |
|--------|----------|
| Supabase project | `xohzvemfeqqcijcipcwj` |
| Активна кампанія | `39d3349e-8cc6-4bf1-b07a-a89bd45a0831` |
| Назва кампанії | Pirates of the Caribbean Seas |
| Діючий корабель | White Wolf |
| DM (dev) | `123456789` — dm_master |
| Тест гравець 1 | `111111111` — Dummy |
| Тест гравець 2 | `222222222` — Dummy2 |
| GitHub repo | `OleksiiBaraniuk/somewhereelse-companion` |
| Локальний сервер | `python3 "a11 - extended/server.py"` |
| Поточна версія | a12-e |

---

// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
