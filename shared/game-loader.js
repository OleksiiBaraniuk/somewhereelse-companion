/**
 * Game Loader - Dynamic loading of mini-games
 * Automatically finds and loads configurations for all games
 */

// List of all available games (folder IDs)
const AVAILABLE_GAMES = [
  'lockpicking',
  'qte',
  'minigame1',
  'slots'
]

/**
 * Load configurations for all games
 * @returns {Promise<Array>} Array of game config objects
 */
export async function loadAllGames() {
  const games = []

  for (const gameId of AVAILABLE_GAMES) {
    try {
      // Dynamic import of game config
      const module = await import(`./games/${gameId}/game-config.js`)
      const config = module.default

      // Add game path
      config.path = `/shared/games/${gameId}/index.html`

      games.push(config)
    } catch (error) {
      console.warn(`⚠️ Failed to load game: ${gameId}`, error)
    }
  }

  return games
}

/**
 * Load config for a specific game
 * @param {string} gameId - Game ID
 * @returns {Promise<Object>} Game config
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
 * Filter games by status
 * @param {Array} games - Array of games
 * @param {string} status - Status ('available', 'coming-soon', 'beta')
 * @returns {Array} Filtered games
 */
export function filterGamesByStatus(games, status) {
  return games.filter(game => game.status === status)
}

/**
 * Filter games by tag
 * @param {Array} games - Array of games
 * @param {string} tag - Tag
 * @returns {Array} Filtered games
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
