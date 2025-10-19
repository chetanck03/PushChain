// Multi-blockchain network configuration
export const NETWORK_CONFIGS = {
  somnia: {
    id: 'somnia',
    name: 'Somnia',
    symbol: 'STT',
    coinType: 60, // EVM compatible
    networks: {
      testnet: {
        name: 'Somnia Testnet',
        chainId: 50312,
        rpcUrl: import.meta.env.VITE_SOMNIA_TESTNET_RPC_URL || 'https://dream-rpc.somnia.network',
        explorerUrl: 'https://shannon-explorer.somnia.network',
        faucetUrl: 'https://cloud.google.com/application/web3/faucet/somnia/shannon'
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