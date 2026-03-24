/**
 * Slots Game Configuration
 * Classic slot machine for tavern gambling
 */

export default {
  id: 'slots',
  icon: '🎰',
  title: 'Tavern Slots',
  description: 'Try your luck at the tavern slot machine',
  status: 'beta',
  difficulty: 'easy',
  tags: ['luck', 'gambling', 'gold', 'minigame'],
  
  // Мета-дані
  skillCheck: 'charisma',  // Luck-based, charisma for bonus
  recommendedLevel: 1,
  avgPlayTime: '2-5 minutes',
  
  // Правила
  rules: [
    'Bet gold to spin',
    'Match 3 symbols to win',
    'Rare symbols pay more',
    'Jackpot on triple 7s'
  ],
  
  // Додаткова інфа для слотів
  minBet: 10,
  maxBet: 100,
  jackpotMultiplier: 100
}

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
