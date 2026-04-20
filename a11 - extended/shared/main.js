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

import { loadAllGames } from './game-loader.js'
import { loadAllFeatures } from './feature-loader.js'

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
        
        // Завантажити та показати ігри і фічі
        await renderGames()
        await renderFeatures()

        // Оновити бейдж гаманця
        updateWalletBadge()
    } catch (error) {
        console.error('Initialization error:', error)
        showAlert('Error loading data. Please check your connection.')
    }
}

// ================================================
// DYNAMIC RENDERING
// ================================================

async function renderGames() {
    try {
        console.log('🎮 Loading games...')
        const games = await loadAllGames()
        const container = document.querySelector('#gamesContainer')
        
        if (!container) {
            console.warn('Games container not found')
            return
        }
        
        // Очистити контейнер
        container.innerHTML = ''
        
        // Рендер кожної гри
        games.forEach(game => {
            const gameCard = document.createElement('div')
            gameCard.className = `game-card ${game.status === 'coming-soon' ? 'coming-soon' : ''}`
            gameCard.onclick = () => openGame(game.id)
            
            gameCard.innerHTML = `
                <div class="game-icon">${game.icon}</div>
                <h4>${game.title}</h4>
                <p class="game-desc">${game.description}</p>
                ${game.status === 'beta' ? '<span class="beta-badge">BETA</span>' : ''}
            `
            
            container.appendChild(gameCard)
        })
        
        console.log(`✅ Loaded ${games.length} games`)
    } catch (error) {
        console.error('Error loading games:', error)
    }
}

async function renderFeatures() {
    try {
        console.log('🚢 Loading features...')
        const features = await loadAllFeatures()
        const container = document.querySelector('#campaignFeatures')
        
        if (!container) {
            console.warn('Features container not found')
            return
        }
        
        // Очистити контейнер
        container.innerHTML = ''
        
        // Рендер кожної фічі
        features.forEach(feature => {
            const featureCard = document.createElement('div')
            featureCard.className = `feature-card ${feature.status === 'coming-soon' ? 'coming-soon' : ''}`
            featureCard.onclick = () => openFeature(feature.id)
            
            const itemsList = feature.items 
                ? `<ul class="feature-list">
                    ${feature.items.map(item => `<li>${item}</li>`).join('')}
                   </ul>`
                : ''
            
            featureCard.innerHTML = `
                <div class="feature-icon">${feature.icon}</div>
                <h4>${feature.title}</h4>
                ${itemsList}
            `
            
            container.appendChild(featureCard)
        })
        
        console.log(`✅ Loaded ${features.length} features`)
    } catch (error) {
        console.error('Error loading features:', error)
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

window.openGame = function(gameId) {
    hapticFeedback('medium')
    
    if (!currentCharacter) {
        showAlert('Please create a character first!')
        return
    }
    
    // TODO: Navigate to game
    window.location.href = `shared/games/${gameId}/index.html`
}

window.openFeature = function(featureId) {
    hapticFeedback('medium')
    
    if (!currentCharacter) {
        showAlert('Please create a character first!')
        return
    }
    
    // TODO: Navigate to feature
    window.location.href = `shared/features/${featureId}/index.html`
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
    window.location.href = 'map/index.html'
}

window.openInventory = function() {
    hapticFeedback('light')
    window.location.href = 'inventory/index.html'
}

window.openNotes = function() {
    hapticFeedback('light')
    window.location.href = 'notes/index.html'
}

// ================================================
// WALLET
// ================================================

const WALLET_KEY = 'companion_wallet'

function loadWallet() {
    const currentGold = parseInt(localStorage.getItem('companion-gold') || '0')
    const stored = localStorage.getItem(WALLET_KEY)
    if (stored) {
        const wallet = JSON.parse(stored)
        // Синхронізуємо золото якщо гра змінила companion-gold
        if (wallet.gold !== currentGold) {
            wallet.gold = currentGold
            localStorage.setItem(WALLET_KEY, JSON.stringify(wallet))
        }
        return wallet
    }
    return { gold: currentGold, silver: 0, copper: 0 }
}

function updateWalletBadge() {
    const wallet = loadWallet()
    const badge = document.getElementById('walletBadge')
    if (!badge) return

    if (wallet.gold > 0 || wallet.silver > 0 || wallet.copper > 0) {
        badge.textContent = `${wallet.gold} GP`
        badge.classList.remove('hidden')
    } else {
        badge.classList.add('hidden')
    }
}

window.openGold = function() {
    hapticFeedback('light')
    const wallet = loadWallet()
    document.getElementById('walletGold').value = wallet.gold
    document.getElementById('walletSilver').value = wallet.silver
    document.getElementById('walletCopper').value = wallet.copper
    document.getElementById('walletModal').classList.remove('hidden')
}

window.closeWallet = function() {
    document.getElementById('walletModal').classList.add('hidden')
}

window.saveWallet = function() {
    const wallet = {
        gold: parseInt(document.getElementById('walletGold').value) || 0,
        silver: parseInt(document.getElementById('walletSilver').value) || 0,
        copper: parseInt(document.getElementById('walletCopper').value) || 0
    }
    localStorage.setItem(WALLET_KEY, JSON.stringify(wallet))
    localStorage.setItem('companion-gold', wallet.gold) // сумісність з іграми
    updateWalletBadge()
    closeWallet()
    hapticFeedback('success')
    console.log('✅ Wallet saved:', wallet)
}

// ================================================
// START APPLICATION
// ================================================

init()

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
