/**
 * Game Loader - Динамічне завантаження міні-ігор
 * Автоматично знаходить і завантажує конфігурації всіх ігор
 */

// Список всіх доступних ігор (просто ID папок)
const AVAILABLE_GAMES = [
  'lockpicking',
  'qte',
  'minigame1',
  'slots'
]

/**
 * Завантажити конфігурації всіх ігор
 * @returns {Promise<Array>} Масив об'єктів з конфігураціями ігор
 */
export async function loadAllGames() {
  const games = []
  
  for (const gameId of AVAILABLE_GAMES) {
    try {
      // Динамічний імпорт конфігу гри
      const module = await import(`./games/${gameId}/game-config.js`)
      const config = module.default
      
      // Додати шлях до гри
      config.path = `/shared/games/${gameId}/index.html`
      
      games.push(config)
    } catch (error) {
      console.warn(`⚠️ Failed to load game: ${gameId}`, error)
    }
  }
  
  return games
}

/**
 * Завантажити конфіг конкретної гри
 * @param {string} gameId - ID гри
 * @returns {Promise<Object>} Конфіг гри
 */
export async function loadGame(gameId) {
  try {
    const module = await import(`./games/${gameId}/game-config.js`)
    const config = module.default
    config.path = `/shared/games/${gameId}/index.html`
    return config
  } catch (error) {
    console.error(`Failed to load game config: ${gameId}`, error)
    return null
  }
}

/**
 * Фільтрувати ігри по статусу
 * @param {Array} games - Масив ігор
 * @param {string} status - Статус ('available', 'coming-soon', 'beta')
 * @returns {Array} Відфільтровані ігри
 */
export function filterGamesByStatus(games, status) {
  return games.filter(game => game.status === status)
}

/**
 * Фільтрувати ігри по тегу
 * @param {Array} games - Масив ігор
 * @param {string} tag - Тег
 * @returns {Array} Відфільтровані ігри
 */
export function filterGamesByTag(games, tag) {
  return games.filter(game => game.tags && game.tags.includes(tag))
}

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
