/**
 * Feature Loader - Динамічне завантаження особливостей кампаній
 * Автоматично знаходить і завантажує конфігурації всіх фіч
 */

// Список всіх доступних фіч (просто ID папок)
const AVAILABLE_FEATURES = [
  'ship-customization'
]

/**
 * Завантажити конфігурації всіх фіч
 * @returns {Promise<Array>} Масив об'єктів з конфігураціями фіч
 */
export async function loadAllFeatures() {
  const features = []
  
  for (const featureId of AVAILABLE_FEATURES) {
    try {
      // Динамічний імпорт конфігу фічі
      const module = await import(`./features/${featureId}/feature-config.js`)
      const config = module.default
      
      // Додати шлях до фічі
      config.path = `/shared/features/${featureId}/index.html`
      
      features.push(config)
    } catch (error) {
      console.warn(`⚠️ Failed to load feature: ${featureId}`, error)
    }
  }
  
  return features
}

/**
 * Завантажити конфіг конкретної фічі
 * @param {string} featureId - ID фічі
 * @returns {Promise<Object>} Конфіг фічі
 */
export async function loadFeature(featureId) {
  try {
    const module = await import(`./features/${featureId}/feature-config.js`)
    const config = module.default
    config.path = `/shared/features/${featureId}/index.html`
    return config
  } catch (error) {
    console.error(`Failed to load feature config: ${featureId}`, error)
    return null
  }
}

/**
 * Фільтрувати фічі по типу кампанії
 * @param {Array} features - Масив фіч
 * @param {string} campaignType - Тип кампанії
 * @returns {Array} Відфільтровані фічі
 */
export function filterFeaturesByCampaign(features, campaignType) {
  return features.filter(feature => 
    !feature.campaignTypes || 
    feature.campaignTypes.includes(campaignType) ||
    feature.campaignTypes.includes('all')
  )
}

/**
 * Отримати фічі з Supabase по campaign_id
 * @param {number} campaignId - ID кампанії
 * @returns {Promise<Array>} Масив назв фіч для кампанії
 */
export async function getCampaignFeaturesFromDB(campaignId) {
  // TODO: Інтеграція з Supabase
  // const { data } = await supabase
  //   .from('campaigns')
  //   .select('features')
  //   .eq('id', campaignId)
  //   .single()
  // return data?.features || []
  
  // Поки що повертаємо всі доступні
  return AVAILABLE_FEATURES
}

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
