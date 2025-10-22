/**
 * Push Chain Universal Wallet Escrow Operations
 * Handles escrow operations for Push Chain Universal Wallets (UEA)
 */

import { ethers } from "ethers"
import { getEVMProvider } from './evmWalletUtils'
import { getWalletXContract, EscrowStatus, validateContractConnectivity, WALLETX_ABI, getWalletXContractAddress } from './contractConfig'
import { storeEscrowTransaction, updateEscrowStatus } from './escrowStorage'
import {
    validateEscrowParams,
    validateSufficientBalance,
    estimateGasWithFallback,
    handleContractError,
    waitForTransactionWithRetry
} from './escrowUtils'

/**
 * Create escrow using Push Chain Universal Wallet
 * @param {Object} pushChainClient - Push Chain client instance
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} senderAddress - The UEA address
 * @param {string} receiver - The recipient address
 * @param {string} amount - The amount in ETH
 * @returns {Promise<Object>} Transaction response with escrow ID
 */
export const createEscrowWithPushChain = async (pushChainClient, blockchain, network, senderAddress, receiver, amount) => {
    try {
        console.log("Creating escrow with Push Chain Universal Wallet:", {
            amount,
            receiver,
            blockchain,
            network,
            senderAddress
        })

        // Validate contract connectivity first
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            throw new Error("Cannot connect to WalletX contract. Please check your network connection.")
        }

        // Validate escrow parameters
        const paramValidation = await validateEscrowParams(receiver, amount, senderAddress)
        if (!paramValidation.isValid) {
            throw new Error(paramValidation.error)
        }

        // Get contract address and ABI
        const contractAddress = getWalletXContractAddress()
        const amountWei = ethers.parseEther(amount)

        // Prepare contract call data
        const contractInterface = new ethers.Interface(WALLETX_ABI)
        const calldata = contractInterface.encodeFunctionData("createEscrow", [receiver])

        console.log("Prepared contract call:", {
            contractAddress,
            calldata,
            value: amountWei.toString()
        })

        // Create transaction using Push Chain Universal Transaction
        const universalTx = await pushChainClient.createUniversalTransaction({
            to: contractAddress,
            data: calldata,
            value: amountWei.toString(),
            // Enable gasless transaction
            gasless: true
        })

        console.log("Universal transaction created:", universalTx)

        // Execute the transaction
        const txResponse = await pushChainClient.sendTransaction(universalTx)
        console.log("Transaction sent:", txResponse)

        // Wait for transaction confirmation
        const receipt = await waitForTransactionWithRetry(txResponse.hash, blockchain, network)
        console.log("Transaction confirmed:", receipt)

        // Parse escrow ID from logs
        let escrowId = null
        if (receipt.logs && receipt.logs.length > 0) {
            try {
                const contractInterface = new ethers.Interface(WALLETX_ABI)
                for (const log of receipt.logs) {
                    try {
                        const parsedLog = contractInterface.parseLog(log)
                        if (parsedLog.name === 'EscrowCreated') {
                            escrowId = parsedLog.args.escrowId?.toString()
                            break
                        }
                    } catch (parseError) {
                        // Skip logs that don't match our interface
                        continue
                    }
                }
            } catch (error) {
                console.warn("Could not parse escrow ID from logs:", error)
            }
        }

        // Store transaction in local storage
        const escrowTransaction = {
            id: escrowId || Date.now().toString(),
            hash: txResponse.hash,
            sender: senderAddress,
            receiver: receiver,
            amount: amount,
            status: EscrowStatus.PENDING,
            timestamp: Date.now(),
            blockchain: blockchain,
            network: network,
            gasUsed: receipt.gasUsed?.toString() || '0',
            blockNumber: receipt.blockNumber?.toString() || '0',
            type: 'create',
            walletType: 'pushchain-ui'
        }

        storeEscrowTransaction(blockchain, network, senderAddress, escrowTransaction)

        return {
            success: true,
            hash: txResponse.hash,
            escrowId: escrowId,
            receipt: receipt,
            transaction: escrowTransaction
        }

    } catch (error) {
        console.error("Error creating escrow with Push Chain:", error)
        throw handleContractError(error, 'createEscrow')
    }
}

/**
 * Claim escrow using Push Chain Universal Wallet
 * @param {Object} pushChainClient - Push Chain client instance
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} claimerAddress - The UEA address
 * @param {string} escrowId - The escrow ID to claim
 * @returns {Promise<Object>} Transaction response
 */
export const claimEscrowWithPushChain = async (pushChainClient, blockchain, network, claimerAddress, escrowId) => {
    try {
        console.log("Claiming escrow with Push Chain Universal Wallet:", {
            escrowId,
            claimerAddress,
            blockchain,
            network
        })

        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            throw new Error("Cannot connect to WalletX contract. Please check your network connection.")
        }

        // Get contract address and prepare call data
        const contractAddress = getWalletXContractAddress()
        const contractInterface = new ethers.Interface(WALLETX_ABI)
        const calldata = contractInterface.encodeFunctionData("claimEscrow", [escrowId])

        // Create universal transaction
        const universalTx = await pushChainClient.createUniversalTransaction({
            to: contractAddress,
            data: calldata,
            value: '0',
            gasless: true
        })

        // Execute transaction
        const txResponse = await pushChainClient.sendTransaction(universalTx)
        const receipt = await waitForTransactionWithRetry(txResponse.hash, blockchain, network)

        // Update local storage
        updateEscrowStatus(blockchain, network, claimerAddress, escrowId, EscrowStatus.CLAIMED, txResponse.hash)

        return {
            success: true,
            hash: txResponse.hash,
            receipt: receipt
        }

    } catch (error) {
        console.error("Error claiming escrow with Push Chain:", error)
        throw handleContractError(error, 'claimEscrow')
    }
}

/**
 * Refund escrow using Push Chain Universal Wallet
 * @param {Object} pushChainClient - Push Chain client instance
 * @param {string} blockchain - The blockchain name
 * @param {string} network - The network name
 * @param {string} senderAddress - The UEA address
 * @param {string} escrowId - The escrow ID to refund
 * @returns {Promise<Object>} Transaction response
 */
export const refundEscrowWithPushChain = async (pushChainClient, blockchain, network, senderAddress, escrowId) => {
    try {
        console.log("Refunding escrow with Push Chain Universal Wallet:", {
            escrowId,
            senderAddress,
            blockchain,
            network
        })

        // Validate contract connectivity
        const isContractAccessible = await validateContractConnectivity(blockchain, network)
        if (!isContractAccessible) {
            throw new Error("Cannot connect to WalletX contract. Please check your network connection.")
        }

        // Get contract address and prepare call data
        const contractAddress = getWalletXContractAddress()
        const contractInterface = new ethers.Interface(WALLETX_ABI)
        const calldata = contractInterface.encodeFunctionData("refundEscrow", [escrowId])

        // Create universal transaction
        const universalTx = await pushChainClient.createUniversalTransaction({
            to: contractAddress,
            data: calldata,
            value: '0',
            gasless: true
        })

        // Execute transaction
        const txResponse = await pushChainClient.sendTransaction(universalTx)
        const receipt = await waitForTransactionWithRetry(txResponse.hash, blockchain, network)

        // Update local storage
        updateEscrowStatus(blockchain, network, senderAddress, escrowId, EscrowStatus.REFUNDED, txResponse.hash)

        return {
            success: true,
            hash: txResponse.hash,
            receipt: receipt
        }

    } catch (error) {
        console.error("Error refunding escrow with Push Chain:", error)
        throw handleContractError(error, 'refundEscrow')
    }
}

/**
 * Get Push Chain client from stored connection or current context
 * @returns {Object|null} Push Chain client instance
 */
export const getPushChainClientFromStorage = () => {
    try {
        // Try to get from global context first (if available)
        if (window.pushChainClient) {
            return window.pushChainClient
        }

        // Check if we have stored connection data
        const storedConnection = localStorage.getItem('pushchain_ui_connection')
        if (storedConnection) {
            const connectionData = JSON.parse(storedConnection)
            console.log("Found stored Push Chain connection:", connectionData)

            // Return a helpful error message for stored connections
            return {
                universal: {
                    account: connectionData.universalAccount
                },
                createUniversalTransaction: async (txData) => {
                    throw new Error("Push Chain UI Kit not active. Please go back to the Push Chain wallet page and reconnect for full functionality.")
                },
                sendTransaction: async (tx) => {
                    throw new Error("Push Chain UI Kit not active. Please go back to the Push Chain wallet page and reconnect for full functionality.")
                }
            }
        }

        return null
    } catch (error) {
        console.error("Error getting Push Chain client:", error)
        return null
    }
}

export default {
    createEscrowWithPushChain,
    claimEscrowWithPushChain,
    refundEscrowWithPushChain,
    getPushChainClientFromStorage
}