// Push Chain Universal App Integration
import { PushChainClient } from '@pushchain/core'
import { ethers } from 'ethers'

/**
 * Initialize Push Chain client for universal app functionality
 * @returns {PushChainClient} Push Chain client instance
 */
export const initializePushChain = () => {
  try {
    const client = new PushChainClient({
      network: 'testnet-donut',
      rpcUrl: 'https://evm.rpc-testnet-donut-node1.push.org',
      chainId: 42101
    })
    
    console.log('Push Chain client initialized successfully')
    return client
  } catch (error) {
    console.error('Failed to initialize Push Chain client:', error)
    // Fallback to basic ethers provider if Push Chain SDK fails
    return {
      createWallet: () => {
        const wallet = ethers.Wallet.createRandom()
        return {
          address: wallet.address,
          privateKey: wallet.privateKey,
          publicKey: wallet.publicKey
        }
      },
      importWallet: (privateKey) => {
        const wallet = new ethers.Wallet(privateKey)
        return {
          address: wallet.address,
          privateKey: wallet.privateKey,
          publicKey: wallet.publicKey
        }
      }
    }
  }
}

/**
 * Make your existing EVM app universal by enabling cross-chain transactions
 * @param {string} contractAddress - Your deployed contract address
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object>} Universal transaction result
 */
export const makeUniversalTransaction = async (contractAddress, transactionData) => {
  try {
    const client = initializePushChain()
    
    // Enable universal functionality - transactions from any chain
    const universalTx = await client.createUniversalTransaction({
      to: contractAddress,
      data: transactionData.data,
      value: transactionData.value || '0',
      // This allows users from Ethereum, Solana, Base, etc. to interact
      enableCrossChain: true,
      supportedChains: ['ethereum', 'solana', 'base', 'arbitrum', 'polygon']
    })
    
    console.log('Universal transaction created:', universalTx)
    return universalTx
  } catch (error) {
    console.error('Failed to create universal transaction:', error)
    throw error
  }
}

/**
 * Get universal wallet balance across all supported chains
 * @param {string} address - Wallet address
 * @returns {Promise<Object>} Balance across all chains
 */
export const getUniversalBalance = async (address) => {
  try {
    const client = initializePushChain()
    
    // Try Push Chain SDK first
    if (client.getUniversalBalance) {
      const balance = await client.getUniversalBalance(address)
      console.log('Universal balance retrieved:', balance)
      return balance
    } else {
      // Fallback to basic balance check
      const provider = new ethers.JsonRpcProvider('https://evm.rpc-testnet-donut-node1.push.org')
      const balanceWei = await provider.getBalance(address)
      const balance = ethers.formatEther(balanceWei)
      return {
        pushchain: balance,
        total: balance
      }
    }
  } catch (error) {
    console.error('Failed to get universal balance:', error)
    // Return zero balance on error
    return {
      pushchain: '0',
      total: '0'
    }
  }
}

/**
 * Enable your app to receive transactions from any blockchain
 * @param {string} contractAddress - Your contract address
 * @returns {Promise<void>}
 */
export const enableUniversalReceiver = async (contractAddress) => {
  try {
    const client = initializePushChain()
    
    await client.enableUniversalReceiver({
      contractAddress,
      supportedChains: ['ethereum', 'solana', 'base', 'arbitrum', 'polygon', 'bsc']
    })
    
    console.log('Universal receiver enabled for contract:', contractAddress)
  } catch (error) {
    console.error('Failed to enable universal receiver:', error)
    throw error
  }
}

export default {
  initializePushChain,
  makeUniversalTransaction,
  getUniversalBalance,
  enableUniversalReceiver
}