/**
 * Main JavaScript for Adventurer's Companion
 */

import { 
    supabase, 
    ensurePlayer, 
    hasCharacter, 
    createCharacter as dbCreateCharacter,
    getActiveCharacter,
    getPlayerStats
} from './supabase.js'

import { 
    initTelegram, 
    getTelegramUser,
    hapticFeedback,
    showAlert,
} from './telegram.js'

// ================================================
// GLOBAL STATE
// ================================================

let currentUser = null
let currentCharacter = null

// ================================================
// INITIALIZATION
// ================================================

async function init() {
    console.log('🎮 Initializing Adventurer\'s Companion...')
    
    // Ініціалізація Telegram
    initTelegram()
    
    // Отримати користувача
    currentUser = getTelegramUser()
    
    if (!currentUser) {
        showAlert('⚠️ Please open this app through Telegram')
        document.getElementById('characterName').textContent = 'Not in Telegram'
        return
    }
    
    console.log('👤 User:', currentUser)
    
    try {
        // Створити/оновити гравця в БД
        await ensurePlayer(currentUser)
        
        // Перевірити чи є персонаж
        const hasChar = await hasCharacter(currentUser.id)
        
        if (!hasChar) {
            // Показати модальне вікно створення персонажа
            showCharacterCreationModal()
        } else {
            // Завантажити персонажа
            await loadCharacter()
        }
        
        // Завантажити статистику
        await loadPlayerStats()
    } catch (error) {
        console.error('Initialization error:', error)
        showAlert('Error loading data. Please check your connection.')
    }
}

// ================================================
// CHARACTER MANAGEMENT
// ================================================

function showCharacterCreationModal() {
    const modal = document.getElementById('characterModal')
    modal.classList.remove('hidden')
    modal.classList.add('fade-in')
    
    hapticFeedback('light')
}

window.createCharacterHandler = async function(event) {
    event.preventDefault()
    
    const nameInput = document.getElementById('characterNameInput')
    const name = nameInput.value.trim()
    
    if (!name) {
        showAlert('Please enter a character name')
        return
    }
    
    hapticFeedback('medium')
    
    try {
        // Створити персонажа в БД
        const character = await dbCreateCharacter(currentUser.id, name)
        
        if (character) {
            currentCharacter = character
            
            // Сховати модальне вікно
            document.getElementById('characterModal').classList.add('hidden')
            
            // Показати персонажа
            displayCharacter(character)
            
            hapticFeedback('success')
            showAlert(`Welcome, ${name}! Your adventure begins! 🎉`)
        } else {
            throw new Error('Failed to create character')
        }
    } catch (error) {
        console.error('Error creating character:', error)
        hapticFeedback('error')
        showAlert('Error creating character. Please try again.')
    }
}

async function loadCharacter() {
    try {
        currentCharacter = await getActiveCharacter(currentUser.id)
        
        if (currentCharacter) {
            displayCharacter(currentCharacter)
        } else {
            // Якщо персонажа не знайдено, показати створення
            showCharacterCreationModal()
        }
    } catch (error) {
        console.error('Error loading character:', error)
        showAlert('Error loading character. Please refresh.')
    }
}

function displayCharacter(character) {
    // Оновити UI
    document.getElementById('characterName').textContent = character.name
    document.getElementById('characterClass').textContent = 
        `Level ${character.level} ${character.class || 'Adventurer'}`
    
    // Stats (поки статичні, пізніше з character sheet)
    document.getElementById('characterHP').textContent = 
        `${character.hp_current || 20}/${character.hp_max || 20}`
    document.getElementById('characterAC').textContent = 
        character.armor_class || 12
    document.getElementById('characterDice').textContent = 
        '1d6' // TODO: розрахувати з класу
    
    console.log('✅ Character loaded:', character.name)
}

async function loadPlayerStats() {
    try {
        const stats = await getPlayerStats(currentUser.id)
        
        if (stats && stats.total_games > 0) {
            // TODO: Показати статистику якщо потрібно
            console.log('📊 Player stats:', stats)
        }
    } catch (error) {
        console.error('Error loading stats:', error)
    }
}

// ================================================
// NAVIGATION
// ================================================

window.viewCharacterSheet = function() {
    hapticFeedback('light')
    // TODO: створити character-sheet.html
    showAlert('📜 Character Sheet coming soon!')
}

window.openGame = function(gameType) {
    hapticFeedback('medium')
    
    if (!currentCharacter) {
        showAlert('Please create a character first!')
        return
    }
    
    // TODO: створити ігри
    showAlert(`🎮 ${gameType} game coming soon!`)
    // window.location.href = `games/${gameType}/index.html`
}

window.openCombat = function() {
    hapticFeedback('light')
    showAlert('⚔️ Combat Tracker coming soon!')
}

window.openDiceRolls = function() {
    hapticFeedback('light')
    showAlert('🎲 Dice Roller coming soon!')
}

window.openMap = function() {
    hapticFeedback('light')
    showAlert('🗺️ Map feature coming soon!')
}

window.openInventory = function() {
    hapticFeedback('light')
    showAlert('🎒 Inventory coming soon!')
}

window.openGold = function() {
    hapticFeedback('light')
    showAlert('💰 Gold tracker coming soon!')
}

window.openNotes = function() {
    hapticFeedback('light')
    showAlert('📝 Notes coming soon!')
}

// ================================================
// START APPLICATION
// ================================================

init()
