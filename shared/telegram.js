/**
 * Telegram Web App SDK Integration
 * SomewhereElse Companion
 */

// Глобальний об'єкт Telegram Web App
export const tg = window.Telegram?.WebApp

// ================================================
// INITIALIZATION
// ================================================

/**
 * Ініціалізувати Telegram Web App
 */
export function initTelegram() {
  if (!tg) {
    console.warn('⚠️ Not running in Telegram Web App environment')
    return null
  }
  
  // Готовність до роботи
  tg.ready()
  
  // Розгорнути на весь екран
  tg.expand()
  
  // Встановити кольори теми
  tg.setHeaderColor('#1a0f0a')
  tg.setBackgroundColor('#1a0f0a')
  
  // Увімкнути закриття при свайпі вниз
  tg.enableClosingConfirmation()
  
  console.log('✅ Telegram Web App initialized')
  return tg
}

// ================================================
// USER INFO
// ================================================

/**
 * Отримати дані користувача Telegram
 * Спробує отримати з Telegram WebApp, якщо не вдасться - з URL параметрів
 */
export function getTelegramUser() {
  // Спочатку спробувати отримати з Telegram WebApp
  if (tg) {
    const user = tg.initDataUnsafe?.user
    if (user) {
      return user
    }
  }
  
  // Якщо не в Telegram або немає даних - спробувати з URL параметрів
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
  
  // Режим розробки - повертаємо тестового користувача
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
 * Перевірити чи це режим розробки
 */
export function isDevelopmentMode() {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         window.location.search.includes('dev=true')
}

/**
 * Отримати ID користувача
 */
export function getUserId() {
  const user = getTelegramUser()
  return user?.id || null
}

/**
 * Отримати повне ім'я
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
 * Показати Alert
 */
export function showAlert(message) {
  if (tg) {
    tg.showAlert(message)
  } else {
    alert(message)
  }
}

/**
 * Показати Confirm
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
 * Показати Popup
 */
export function showPopup(params, callback) {
  if (tg?.showPopup) {
    tg.showPopup(params, callback)
  } else {
    // Fallback для браузера
    const message = params.message || params.title
    const result = confirm(message)
    callback(result ? 'ok' : 'cancel')
  }
}

// ================================================
// HAPTIC FEEDBACK
// ================================================

/**
 * Вібрація (легка)
 */
export function hapticLight() {
  tg?.HapticFeedback?.impactOccurred('light')
}

/**
 * Вібрація (середня)
 */
export function hapticMedium() {
  tg?.HapticFeedback?.impactOccurred('medium')
}

/**
 * Вібрація (важка)
 */
export function hapticHeavy() {
  tg?.HapticFeedback?.impactOccurred('heavy')
}

/**
 * Сповіщення (успіх)
 */
export function hapticSuccess() {
  tg?.HapticFeedback?.notificationOccurred('success')
}

/**
 * Сповіщення (помилка)
 */
export function hapticError() {
  tg?.HapticFeedback?.notificationOccurred('error')
}

/**
 * Сповіщення (попередження)
 */
export function hapticWarning() {
  tg?.HapticFeedback?.notificationOccurred('warning')
}

/**
 * Вібрація за типом
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
 * Показати кнопку "Назад"
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
 * Сховати кнопку "Назад"
 */
export function hideBackButton() {
  tg?.BackButton.hide()
}

// ================================================
// MAIN BUTTON
// ================================================

/**
 * Показати головну кнопку
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
 * Сховати головну кнопку
 */
export function hideMainButton() {
  tg?.MainButton.hide()
}

/**
 * Показати прогрес на кнопці
 */
export function showMainButtonProgress() {
  tg?.MainButton.showProgress()
}

/**
 * Сховати прогрес на кнопці
 */
export function hideMainButtonProgress() {
  tg?.MainButton.hideProgress()
}

// ================================================
// THEME
// ================================================

/**
 * Отримати тему Telegram
 */
export function getTheme() {
  return tg?.colorScheme || 'dark'
}

/**
 * Отримати колір теми
 */
export function getThemeColor(colorKey) {
  return tg?.themeParams?.[colorKey] || null
}

/**
 * Чи темна тема?
 */
export function isDarkTheme() {
  return getTheme() === 'dark'
}

// ================================================
// VIEWPORT
// ================================================

/**
 * Отримати висоту viewport
 */
export function getViewportHeight() {
  return tg?.viewportHeight || window.innerHeight
}

/**
 * Отримати стабільну висоту (без клавіатури)
 */
export function getViewportStableHeight() {
  return tg?.viewportStableHeight || window.innerHeight
}

/**
 * Чи розгорнуто на весь екран?
 */
export function isExpanded() {
  return tg?.isExpanded || false
}

// ================================================
// CLOUD STORAGE (для зберігання налаштувань)
// ================================================

/**
 * Зберегти дані в Telegram Cloud Storage
 */
export async function saveToCloud(key, value) {
  if (!tg?.CloudStorage) {
    // Fallback на localStorage
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
 * Отримати дані з Telegram Cloud Storage
 */
export async function getFromCloud(key) {
  if (!tg?.CloudStorage) {
    // Fallback на localStorage
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
 * Видалити дані з Cloud Storage
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
 * Відкрити посилання
 */
export function openLink(url) {
  if (tg) {
    tg.openLink(url)
  } else {
    window.open(url, '_blank')
  }
}

/**
 * Відкрити Telegram посилання
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
 * Закрити Web App
 */
export function close() {
  tg?.close()
}

/**
 * Отримати Platform
 */
export function getPlatform() {
  return tg?.platform || 'unknown'
}

/**
 * Отримати версію Telegram
 */
export function getTelegramVersion() {
  return tg?.version || 'unknown'
}

/**
 * Чи підтримується функція
 */
export function isFeatureSupported(feature) {
  return tg?.isVersionAtLeast?.(feature) || false
}

/**
 * Логування в Development mode
 */
export function devLog(...args) {
  if (isDevelopmentMode()) {
    console.log('🔧 [DEV]', ...args)
  }
}

// ================================================
// INIT ON LOAD
// ================================================

// Автоматична ініціалізація при завантаженні модуля
if (tg) {
  initTelegram()
  devLog('Telegram WebApp Info:', {
    platform: getPlatform(),
    version: getTelegramVersion(),
    user: getTelegramUser(),
    theme: getTheme()
  })
}
