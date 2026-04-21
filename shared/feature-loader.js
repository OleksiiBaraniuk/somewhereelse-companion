/**
 * Feature Loader - Dynamic loading of campaign features
 * Automatically finds and loads configurations for all features
 */

// List of all available features (folder IDs)
const AVAILABLE_FEATURES = [
  'ship-management'
]

/**
 * Load configurations for all features
 * @returns {Promise<Array>} Array of feature config objects
 */
export async function loadAllFeatures() {
  const features = []

  for (const featureId of AVAILABLE_FEATURES) {
    try {
      // Dynamic import of feature config
      const module = await import(`./features/${featureId}/feature-config.js`)
      const config = module.default

      // Add feature path
      config.path = `/shared/features/${featureId}/index.html`

      features.push(config)
    } catch (error) {
      console.warn(`⚠️ Failed to load feature: ${featureId}`, error)
    }
  }

  return features
}

/**
 * Load config for a specific feature
 * @param {string} featureId - Feature ID
 * @returns {Promise<Object>} Feature config
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
 * Filter features by campaign type
 * @param {Array} features - Array of features
 * @param {string} campaignType - Campaign type
 * @returns {Array} Filtered features
 */
export function filterFeaturesByCampaign(features, campaignType) {
  return features.filter(feature =>
    !feature.campaignTypes ||
    feature.campaignTypes.includes(campaignType) ||
    feature.campaignTypes.includes('all')
  )
}

/**
 * Get features from Supabase by campaign_id
 * @param {number} campaignId - Campaign ID
 * @returns {Promise<Array>} Array of feature names for campaign
 */
export async function getCampaignFeaturesFromDB(campaignId) {
  // TODO: Supabase integration
  // const { data } = await supabase
  //   .from('campaigns')
  //   .select('features')
  //   .eq('id', campaignId)
  //   .single()
  // return data?.features || []

  // Return all available for now
  return AVAILABLE_FEATURES
}

// ============================================================
// Credits
// ============================================================
// Idea: Baraniuk
// Code: Claude (Anthropic AI Assistant)
// ============================================================
