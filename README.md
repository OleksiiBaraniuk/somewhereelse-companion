# SomewhereElse Companion

**Version:** a12-e

SomewhereElse Companion is a tool — an app that expands possible interactions with the game world through mini-games that transform the approach to seemingly ordinary activities. Lock-picking, QTE, puzzles and more.

Campaign Features add unique, adventure-specific functionality for each campaign.

This is a tool that removes old limitations and builds new ones at the boundary of imagination.

Looking ahead, character creation and management will be added — not only for the upcoming virtual board *SomewhereElse Place*, but also for physical sessions.

**Companion is an extension for your game.**

> Idea: Baraniuk · Code: Claude (Anthropic AI Assistant)

---

## Quick Start

```bash
python3 server.py
# → http://localhost:8080
```

Or open via Telegram Mini App (webhook configured in `Bot/bot_v6.py`).

---

## Project Structure

```
├── index.html                        # Main hub
├── server.py                         # Local dev server (port 8080)
│
├── shared/
│   ├── styles.css                    # Single source of styles (medieval D&D theme)
│   ├── main.js                       # Hub initialization, wallet logic
│   ├── supabase.js                   # Supabase client + DB helper functions
│   ├── telegram.js                   # Telegram WebApp SDK helpers
│   ├── game-loader.js                # Dynamic mini-game loading
│   ├── feature-loader.js             # Dynamic campaign feature loading
│   │
│   ├── games/
│   │   ├── lockpicking/              # Skyrim-style lockpicking (skill-based)
│   │   ├── qte/                      # Quick Time Event (reflexes)
│   │   ├── minigame1/                # KnuckleBones v2 (dice, bets)
│   │   └── slots/                    # Tavern Slots v2 (slots, bets)
│   │
│   └── features/
│       └── ship-management/          # Ship equipment and purchase
│
├── dm/index.html                     # DM panel (Dungeon Master only)
├── inventory/index.html              # Placeholder
├── map/index.html                    # Placeholder
├── notes/index.html                  # Placeholder
│
└── assets/
    ├── ships/                        # Ship images
    ├── icons/                        # Module icons (cannons, hulls)
    └── backgrounds/                  # Background images

Bot/
└── bot_v6.py                         # Telegram bot (python-telegram-bot)
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JS, HTML, CSS |
| Platform | Telegram Mini App (WebApp SDK) |
| Backend | Supabase (PostgreSQL + Realtime) |
| Bot | Python · python-telegram-bot |

---

## Core Systems

### Wallet
Stored in `localStorage` under two keys for mini-game compatibility:
- `companion_wallet` — `{ gold, silver, copper }`
- `companion-gold` — number (read by games)

### Mini-Games
Each game is a separate folder `shared/games/{id}/` with `game-config.js` and `index.html`.
Listed in `AVAILABLE_GAMES` in `game-loader.js`. Cards are rendered automatically.

### Campaign Features
Each feature is `shared/features/{id}/` with `feature-config.js` and `index.html`.
Listed in `AVAILABLE_FEATURES` in `feature-loader.js`.

### Ship Management
Players choose equipment/ship → send request to DM → DM approve/reject in DM panel.
Crew budget (GP) is set by DM in their panel → synced via Supabase.

**Current ship:** White Wolf
**Available cannons:** Albatross · Control · Fly
**Available hulls:** Reinforced Wood · Metal Tonk
**Ships:** Wind of Cortor (1350 gp) · KREST Hull (1850 gp)

### DM Panel
- Access: only if `telegram_id` matches `dm_id` of active campaign
- Dev mode (localhost): auto `id: 123456789`
- Features: Approve/Reject requests, set crew budget, view players
- Realtime: subscription to `ship_actions` without page reload

---

## Supabase

**Project ID:** `xohzvemfeqqcijcipcwj` (eu-west-1)

| Table | Purpose |
|-------|---------|
| `players` | Telegram users |
| `characters` | Player characters |
| `campaigns` | D&D campaigns |
| `campaign_participants` | Character-campaign links |
| `ships` | Ship state + crew budget |
| `ship_actions` | Player requests → DM approves/rejects |
| `game_results` | Mini-game results |
| `active_games` | Active games (real-time) |
| `dice_rolls` | Dice roll history |

**Active campaign:** `39d3349e-8cc6-4bf1-b07a-a89bd45a0831` — *Pirates of the Caribbean Seas*

---

## Test Accounts

| Telegram ID | Name | Role |
|-------------|------|------|
| `123456789` | dm_master | DM (dev fallback) |
| `111111111` | Dummy | Player |
| `222222222` | Dummy2 | Player |

---

## Bot

```bash
pip install python-telegram-bot --break-system-packages
python3 Bot/bot_v6.py
```

Commands: `/start` · `/sheet` · `/combat` · `/games`

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| a12-e | 2026-04-20 | Ship Management live, DM Crew Budget, fixed INSERT/export bugs, new cannons/hulls/ships with icons |
| a11-e | 2026-04-15 | First full version: hub, wallet, mini-games, DM panel, Supabase infrastructure |
