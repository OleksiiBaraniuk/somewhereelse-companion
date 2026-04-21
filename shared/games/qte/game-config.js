/**
 * QTE (Quick Time Event) Game Configuration
 * React quickly to button prompts
 */

export default {
  id: 'qte',
  icon: '⚡',
  title: 'Quick Time Event',
  description: 'React quickly to succeed! Test your reflexes',
  status: 'available',
  difficulty: 'easy',
  tags: ['reaction', 'speed', 'reflex', 'minigame'],
  
  // Metadata
  skillCheck: 'dexterity',
  recommendedLevel: 1,
  avgPlayTime: '1-2 minutes',
  
  // Rules
  rules: [
    'Press the correct button as fast as possible',
    'Each round gets faster',
    'Miss 3 times and you lose',
    'Perfect timing gives bonus points'
  ]
}

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
