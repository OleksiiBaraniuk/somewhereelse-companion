# SomewhereElse Companion

**Version:** a12-e

SomewhereElse Companion is a tool — an app that expands possible interactions with the game world through mini-games that transform the approach to seemingly ordinary activities. Lock-picking, QTE, puzzles and more.

Campaign Features add unique, adventure-specific functionality for each campaign.

This is a tool that removes old limitations and builds new ones at the boundary of imagination.

Looking ahead, character creation and management will be added — not only for the upcoming virtual board *SomewhereElse Place*, but also for physical sessions.

**Companion is an extension for your game.**

> Idea: Baraniuk · Code: Claude (Anthropic AI Assistant)

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



### DM Panel
- Access: only if `telegram_id` matches `dm_id` of active campaign
- Dev mode (localhost): auto `id: 123456789`
- Features: Approve/Reject requests, set crew budget, view players
- Realtime: subscription to `ship_actions` without page reload

---


## Changelog

| Version | Date | Changes |
|---------|------|---------|
| a12-e | 2026-04-20 | Ship Management live, DM Crew Budget, fixed INSERT/export bugs, new cannons/hulls/ships with icons |
| a11 | 2026-04-15 | First full version: hub, wallet, mini-games, DM panel, Supabase infrastructure |
