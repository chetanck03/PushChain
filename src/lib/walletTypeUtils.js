// Wallet Type Management Utilities

/**
 * Get the currently selected wallet type
 * @returns {string|null} 'bip' or 'pushchain-sdk' or null
 */
export const getSelectedWalletType = () => {
  try {
    return localStorage.getItem('selected_wallet_type')
  } catch (error) {
    console.error('Error getting wallet type:', error)
    return null
  }
}

/**
 * Set the selected wallet type
 * @param {string} type - 'bip' or 'pushchain-sdk'
 */
export const setSelectedWalletType = (type) => {
  try {
    localStorage.setItem('selected_wallet_type', type)
  } catch (error) {
    console.error('Error setting wallet type:', error)
  }
}

/**
 * Clear the selected wallet type
 */
export const clearSelectedWalletType = () => {
  try {
    localStorage.removeItem('selected_wallet_type')
  } catch (error) {
    console.error('Error clearing wallet type:', error)
  }
}

/**
 * Check if user has any existing wallets of a specific type
 * @param {string} type - 'bip' or 'pushchain-ui'
 * @returns {boolean}
 */
export const hasExistingWallets = (type) => {
  try {
    if (type === 'bip') {
      const bipSeed = localStorage.getItem('shared_evm_seed_phrase')
      const bipWallets = localStorage.getItem('pushchain_wallets')
      return !!(bipSeed || bipWallets)
    } else if (type === 'pushchain-ui') {
      const pushChainConnection = localStorage.getItem('pushchain_ui_connected')
      return !!pushChainConnection
    }
    return false
  } catch (error) {
    console.error('Error checking existing wallets:', error)
    return false
  }
}

/**
 * Get wallet count for a specific type
 * @param {string} type - 'bip' or 'pushchain-ui'
 * @returns {number}
 */
export const getWalletCount = (type) => {
  try {
    if (type === 'bip') {
      const bipWallets = localStorage.getItem('pushchain_wallets')
      return bipWallets ? JSON.parse(bipWallets).length : 0
    } else if (type === 'pushchain-ui') {
      // Push Chain UI Kit uses a single universal account
      const pushChainConnection = localStorage.getItem('pushchain_ui_connected')
      return pushChainConnection ? 1 : 0
    }
    return 0
  } catch (error) {
    console.error('Error getting wallet count:', error)
    return 0
  }
}

/**
 * Clear all wallets of a specific type
 * @param {string} type - 'bip' or 'pushchain-ui'
 */
export const clearWallets = (type) => {
  try {
    if (type === 'bip') {
      localStorage.removeItem('shared_evm_seed_phrase')
      localStorage.removeItem('pushchain_wallets')
    } else if (type === 'pushchain-ui') {
      localStorage.removeItem('pushchain_ui_connected')
      // Clear any Push Chain UI Kit related data
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('pushchain_ui_') || key.startsWith('push_wallet_')) {
          localStorage.removeItem(key)
        }
      })
    }
  } catch (error) {
    console.error('Error clearing wallets:', error)
  }
}

export default {
  getSelectedWalletType,
  setSelectedWalletType,
  clearSelectedWalletType,
  hasExistingWallets,
  getWalletCount,
  clearWallets
}