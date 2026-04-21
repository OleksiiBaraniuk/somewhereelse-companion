/**
 * Mini Game 1 Configuration
 * Placeholder for future game
 */

export default {
  id: 'minigame1',
  icon: '🎯',
  title: 'KnuckleBones',
  description: 'Popular kids and adult game to spare time',
  status: 'available',
  difficulty: 'medium',
  tags: ['skill', 'minigame'],
  
  // Metadata
  skillCheck: 'dexterity',
  recommendedLevel: 2,
  avgPlayTime: '3-5 minutes',
  
  // Rules
  rules: [
    'Players take turns rolling a six-sided die',
    'and placing it in one of their three columns.',
    'Hit bullseye for maximum points',
    'The game ends when one player fills their grid',
    'Sum the face value of all dice in your columns',
    'If a column has two dice of the same number, those dice are    doubled',
    'Or tripled if there three in row',
    'Your Dice can be destroyed once Enemy place dice with same value',
  ]
}

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
