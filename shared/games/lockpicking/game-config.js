/**
 * Lockpicking Game Configuration
 * Skyrim-style lockpicking challenge
 */

export default {
  id: 'lockpicking',
  icon: '🔒',
  title: 'Lockpicking Challenge',
  description: 'Test your dexterity and break locks Skyrim-style',
  status: 'available',
  difficulty: 'medium',
  tags: ['skill', 'dexterity', 'stealth', 'minigame'],
  
  // Мета-дані для фільтрації
  skillCheck: 'dexterity',
  recommendedLevel: 1,
  avgPlayTime: '2-3 minutes',
  
  // Опціонально: правила гри
  rules: [
    'Rotate lockpick to find the sweet spot',
    'Click to attempt unlocking',
    'Limited lockpicks available',
    'Higher Sleight of Hand = easier locks'
  ]
}

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
