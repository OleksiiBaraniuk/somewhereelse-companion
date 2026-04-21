/**
 * Telegram Web App SDK Integration
 * SomewhereElse Companion
 */

// Global Telegram Web App object
export const tg = window.Telegram?.WebApp

// ================================================
// INITIALIZATION
// ================================================

/**
 * Initialize Telegram Web App
 */
export function initTelegram() {
  if (!tg) {
    console.warn('⚠️ Not running in Telegram Web App environment')
    return null
  }

  // Signal readiness
  tg.ready()

  // Expand to full screen
  tg.expand()

  // Set theme colors
  tg.setHeaderColor('#1a0f0a')
  tg.setBackgroundColor('#1a0f0a')

  // Enable swipe-down close confirmation
  tg.enableClosingConfirmation()

  console.log('✅ Telegram Web App initialized')
  return tg
}

// ================================================
// USER INFO
// ================================================

/**
 * Get Telegram user data.
 * Tries Telegram WebApp first, falls back to URL params.
 */
export function getTelegramUser() {
  // First try to get from Telegram WebApp
  if (tg) {
    const user = tg.initDataUnsafe?.user
    if (user) {
      return user
    }
  }

  // If not in Telegram or no data - try URL params
  const params = new URLSearchParams(window.location.search)
  const userId = params.get('tg_user_id')

  if (userId) {
    return {
      id: parseInt(userId),
      first_name: params.get('tg_first_name') || 'Guest',
      last_name: params.get('tg_last_name') || null,
      username: params.get('tg_username') || null,
      language_code: params.get('tg_language_code') || 'uk'
    }
  }

  // Development mode - return test user
  if (isDevelopmentMode()) {
    return {
      id: 123456789,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      language_code: 'uk'
    }
  }

  return null
}

/**
 * Check if running in development mode
 */
export function isDevelopmentMode() {
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         window.location.search.includes('dev=true')
}

/**
 * Get user ID
 */
export function getUserId() {
  const user = getTelegramUser()
  return user?.id || null
}

/**
 * Get full name
 */
export function getUserFullName() {
  const user = getTelegramUser()
  if (!user) return 'Guest'

  return [user.first_name, user.last_name].filter(Boolean).join(' ')
}

// ================================================
// UI INTERACTIONS
// ================================================

/**
 * Show alert
 */
export function showAlert(message) {
  if (tg) {
    tg.showAlert(message)
  } else {
    alert(message)
  }
}

/**
 * Show confirm
 */
export function showConfirm(message, callback) {
  if (tg) {
    tg.showConfirm(message, callback)
  } else {
    const result = confirm(message)
    callback(result)
  }
}

/**
 * Show popup
 */
export function showPopup(params, callback) {
  if (tg?.showPopup) {
    tg.showPopup(params, callback)
  } else {
    // Browser fallback
    const message = params.message || params.title
    const result = confirm(message)
    callback(result ? 'ok' : 'cancel')
  }
}

// ================================================
// HAPTIC FEEDBACK
// ================================================

/**
 * Light haptic
 */
export function hapticLight() {
  tg?.HapticFeedback?.impactOccurred('light')
}

/**
 * Medium haptic
 */
export function hapticMedium() {
  tg?.HapticFeedback?.impactOccurred('medium')
}

/**
 * Heavy haptic
 */
export function hapticHeavy() {
  tg?.HapticFeedback?.impactOccurred('heavy')
}

/**
 * Success notification
 */
export function hapticSuccess() {
  tg?.HapticFeedback?.notificationOccurred('success')
}

/**
 * Error notification
 */
export function hapticError() {
  tg?.HapticFeedback?.notificationOccurred('error')
}

/**
 * Warning notification
 */
export function hapticWarning() {
  tg?.HapticFeedback?.notificationOccurred('warning')
}

/**
 * Haptic feedback by type
 */
export function hapticFeedback(type = 'medium') {
  const feedbackMap = {
    'light': hapticLight,
    'medium': hapticMedium,
    'heavy': hapticHeavy,
    'success': hapticSuccess,
    'error': hapticError,
    'warning': hapticWarning
  }

  const feedback = feedbackMap[type] || hapticMedium
  feedback()
}

// ================================================
// BACK BUTTON
// ================================================

/**
 * Show back button
 */
export function showBackButton(callback) {
  if (!tg) return

  tg.BackButton.show()

  if (callback) {
    tg.BackButton.onClick(callback)
  } else {
    tg.BackButton.onClick(() => window.history.back())
  }
}

/**
 * Hide back button
 */
export function hideBackButton() {
  tg?.BackButton.hide()
}

// ================================================
// MAIN BUTTON
// ================================================

/**
 * Show main button
 */
export function showMainButton(text, callback) {
  if (!tg) return

  tg.MainButton.setText(text)
  tg.MainButton.show()

  if (callback) {
    tg.MainButton.onClick(callback)
  }
}

/**
 * Hide main button
 */
export function hideMainButton() {
  tg?.MainButton.hide()
}

/**
 * Show progress on main button
 */
export function showMainButtonProgress() {
  tg?.MainButton.showProgress()
}

/**
 * Hide progress on main button
 */
export function hideMainButtonProgress() {
  tg?.MainButton.hideProgress()
}

// ================================================
// THEME
// ================================================

/**
 * Get Telegram theme
 */
export function getTheme() {
  return tg?.colorScheme || 'dark'
}

/**
 * Get theme color
 */
export function getThemeColor(colorKey) {
  return tg?.themeParams?.[colorKey] || null
}

/**
 * Check if dark theme
 */
export function isDarkTheme() {
  return getTheme() === 'dark'
}

// ================================================
// VIEWPORT
// ================================================

/**
 * Get viewport height
 */
export function getViewportHeight() {
  return tg?.viewportHeight || window.innerHeight
}

/**
 * Get stable viewport height (without keyboard)
 */
export function getViewportStableHeight() {
  return tg?.viewportStableHeight || window.innerHeight
}

/**
 * Check if expanded to full screen
 */
export function isExpanded() {
  return tg?.isExpanded || false
}

// ================================================
// CLOUD STORAGE (for storing settings)
// ================================================

/**
 * Save data to Telegram Cloud Storage
 */
export async function saveToCloud(key, value) {
  if (!tg?.CloudStorage) {
    // Fallback to localStorage
    localStorage.setItem(key, JSON.stringify(value))
    return
  }

  return new Promise((resolve, reject) => {
    tg.CloudStorage.setItem(key, JSON.stringify(value), (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

/**
 * Get data from Telegram Cloud Storage
 */
export async function getFromCloud(key) {
  if (!tg?.CloudStorage) {
    // Fallback to localStorage
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  }

  return new Promise((resolve, reject) => {
    tg.CloudStorage.getItem(key, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result ? JSON.parse(result) : null)
      }
    })
  })
}

/**
 * Remove data from Cloud Storage
 */
export async function removeFromCloud(key) {
  if (!tg?.CloudStorage) {
    localStorage.removeItem(key)
    return
  }

  return new Promise((resolve, reject) => {
    tg.CloudStorage.removeItem(key, (error, result) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

// ================================================
// SHARE & LINKS
// ================================================

/**
 * Open link
 */
export function openLink(url) {
  if (tg) {
    tg.openLink(url)
  } else {
    window.open(url, '_blank')
  }
}

/**
 * Open Telegram link
 */
export function openTelegramLink(url) {
  if (tg) {
    tg.openTelegramLink(url)
  } else {
    window.open(url, '_blank')
  }
}

// ================================================
// UTILITY
// ================================================

/**
 * Close Web App
 */
export function close() {
  tg?.close()
}

/**
 * Get platform
 */
export function getPlatform() {
  return tg?.platform || 'unknown'
}

/**
 * Get Telegram version
 */
export function getTelegramVersion() {
  return tg?.version || 'unknown'
}

/**
 * Check if feature is supported
 */
export function isFeatureSupported(feature) {
  return tg?.isVersionAtLeast?.(feature) || false
}

/**
 * Log in development mode only
 */
export function devLog(...args) {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV]', ...args)
  }
}

// ================================================
// INIT ON LOAD
// ================================================

// Auto-initialize when module loads
if (tg) {
  initTelegram()
  devLog('Telegram WebApp Info:', {
    platform: getPlatform(),
    version: getTelegramVersion(),
    user: getTelegramUser(),
    theme: getTheme()
  })
}
