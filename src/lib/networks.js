// Multi-blockchain network configuration
export const NETWORK_CONFIGS = {
  pushchain: {
    id: 'pushchain',
    name: 'Push Chain',
    symbol: 'PC',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'Push Chain Donut Testnet',
        chainId: 42101,
        rpcUrl: import.meta.env.VITE_PUSHCHAIN_TESTNET_RPC_URL || 'https://evm.rpc-testnet-donut-node1.push.org',
        explorerUrl: 'https://donut.push.network',
        faucetUrl: 'https://faucet.push.org'
      }
    }
  }
}

// Helper functions
export const getNetworkConfig = (blockchain, network = 'testnet') => {
  return NETWORK_CONFIGS[blockchain]?.networks[network]
}

export const getBlockchainConfig = (blockchain) => {
  return NETWORK_CONFIGS[blockchain]
}

export const getAllSupportedBlockchains = () => {
  return Object.keys(NETWORK_CONFIGS)
}

export const getEVMCompatibleBlockchains = () => {
  return Object.keys(NETWORK_CONFIGS).filter(blockchain =>
    NETWORK_CONFIGS[blockchain].coinType === 60
  )
}

export const isEVMCompatible = (blockchain) => {
  return NETWORK_CONFIGS[blockchain]?.coinType === 60
}