/**
 * Supabase Connection & Helper Functions
 * SomewhereElse Companion
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ================================================
// CONFIGURATION
// ================================================
// TODO: Замініть на ваші дані з Supabase Dashboard
const SUPABASE_URL = 'https://xohzvemfeqqcijcipcwj.supabase.co' // https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvaHp2ZW1mZXFxY2lqY2lwY3dqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyNjAwMTUsImV4cCI6MjA4ODgzNjAxNX0.3wxU293d0bTZPzgNrywoOdCTdK-KyDSh0WSoQVYP63A'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ================================================
// PLAYERS (Гравці)
// ================================================

/**
 * Створити або оновити гравця
 */
export async function ensurePlayer(telegramUser) {
  try {
    const { data, error } = await supabase
      .from('players')
      .upsert({
        telegram_id: telegramUser.id,
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name
      }, { 
        onConflict: 'telegram_id',
        ignoreDuplicates: false 
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error ensuring player:', error)
    return null
  }
}

/**
 * Отримати статистику гравця
 */
export async function getPlayerStats(telegramId) {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('total_games, total_wins')
      .eq('telegram_id', telegramId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting player stats:', error)
    return null
  }
}

// ================================================
// CHARACTERS (Персонажі)
// ================================================

/**
 * Перевірити чи має гравець персонажа
 */
export async function hasCharacter(telegramId) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('id')
      .eq('player_id', telegramId)
      .eq('is_active', true)
      .single()
    
    return !!data
  } catch (error) {
    return false
  }
}

/**
 * Створити нового персонажа (базовий - тільки ім'я)
 */
export async function createCharacter(telegramId, characterName) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .insert({
        player_id: telegramId,
        name: characterName,
        class: 'Adventurer',
        level: 1
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating character:', error)
    return null
  }
}

/**
 * Отримати активного персонажа гравця
 */
export async function getActiveCharacter(telegramId) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('player_id', telegramId)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error getting character:', error)
    return null
  }
}

/**
 * Оновити персонажа
 */
export async function updateCharacter(characterId, updates) {
  try {
    const { data, error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', characterId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating character:', error)
    return null
  }
}

// ================================================
// CAMPAIGNS (Кампанії)
// ================================================

/**
 * Отримати features поточної кампанії
 */
export async function getCampaignFeatures(campaignId) {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('features')
      .eq('id', campaignId)
      .single()
    
    if (error) throw error
    return data?.features || []
  } catch (error) {
    console.error('Error getting campaign features:', error)
    return []
  }
}

/**
 * Отримати активні кампанії
 */
export async function getActiveCampaigns() {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting campaigns:', error)
    return []
  }
}

// ================================================
// ACTIVE GAMES (Активні ігри)
// ================================================

/**
 * Почати активну гру
 */
export async function startActiveGame(gameType, playerId, characterId, config = {}) {
  try {
    const gameData = {
      player_id: playerId,
      character_id: characterId,
      game_type: gameType,
      ...config
    }
    
    const { data, error } = await supabase
      .from('active_games')
      .insert(gameData)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error starting active game:', error)
    return null
  }
}

/**
 * Оновити прогрес активної гри
 */
export async function updateActiveGame(gameId, updates) {
  try {
    const { error } = await supabase
      .from('active_games')
      .update({
        ...updates,
        last_action_at: new Date().toISOString()
      })
      .eq('id', gameId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating active game:', error)
    return false
  }
}

/**
 * Завершити гру і зберегти результат
 */
export async function endGame(gameId, result) {
  try {
    // Зберегти результат
    const { error: resultError } = await supabase
      .from('game_results')
      .insert(result)
    
    if (resultError) throw resultError
    
    // Видалити з активних
    const { error: deleteError } = await supabase
      .from('active_games')
      .delete()
      .eq('id', gameId)
    
    if (deleteError) throw deleteError
    
    return true
  } catch (error) {
    console.error('Error ending game:', error)
    return false
  }
}

/**
 * Отримати всі активні ігри (для DM Dashboard)
 */
export async function getActiveGames() {
  try {
    const { data, error } = await supabase
      .from('active_games')
      .select(`
        *,
        players:player_id (username, first_name, last_name),
        characters:character_id (name, class, level)
      `)
      .order('last_action_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting active games:', error)
    return []
  }
}

// ================================================
// GAME RESULTS (Результати ігор)
// ================================================

/**
 * Отримати останні результати
 */
export async function getRecentResults(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('game_results')
      .select(`
        *,
        players:player_id (username, first_name),
        characters:character_id (name, class)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting recent results:', error)
    return []
  }
}

/**
 * Отримати результати гравця
 */
export async function getPlayerResults(telegramId, gameType = null) {
  try {
    let query = supabase
      .from('game_results')
      .select('*')
      .eq('player_id', telegramId)
      .order('created_at', { ascending: false })
    
    if (gameType) {
      query = query.eq('game_type', gameType)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting player results:', error)
    return []
  }
}

// ================================================
// DICE ROLLS (Кидки кубиків)
// ================================================

/**
 * Зберегти кидок кубика
 */
export async function saveDiceRoll(characterId, rollData) {
  try {
    const { data, error } = await supabase
      .from('dice_rolls')
      .insert({
        character_id: characterId,
        ...rollData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error saving dice roll:', error)
    return null
  }
}

// ================================================
// REAL-TIME SUBSCRIPTIONS (для DM Dashboard)
// ================================================

/**
 * Підписатись на зміни в активних іграх
 */
export function subscribeToActiveGames(callback) {
  return supabase
    .channel('active_games_changes')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'active_games'
    }, callback)
    .subscribe()
}

/**
 * Підписатись на нові результати
 */
export function subscribeToGameResults(callback) {
  return supabase
    .channel('game_results_changes')
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'game_results'
    }, callback)
    .subscribe()
}

/**
 * Відписатись від каналу
 */
export function unsubscribe(channel) {
  if (channel) {
    supabase.removeChannel(channel)
  }
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

/**
 * Перевірити підключення до Supabase
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('count')
      .limit(1)
    
    return !error
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}

/**
 * Отримати URL та Key для перевірки
 */
export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL,
    hasKey: !!SUPABASE_ANON_KEY && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY'
  }
}
