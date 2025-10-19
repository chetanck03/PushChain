import { ethers } from "ethers"
import { getEVMProvider } from './evmWalletUtils'

// WalletX Escrow Contract ABI - Latest version with escrow functionality
export const WALLETX_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "claim",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "at",
				"type": "uint256"
			}
		],
		"name": "Claimed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "createEscrow",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "EscrowCreated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "escrowCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "escrows",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum WalletX.EscrowStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "refundedAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "getEscrowDetails",
		"outputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "enum WalletX.EscrowStatus",
				"name": "status",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "createdAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "claimedAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "refundedAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getPendingActions",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "claimable",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "refundable",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserReceivedEscrows",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getUserSentEscrows",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			}
		],
		"name": "refund",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "escrowId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "at",
				"type": "uint256"
			}
		],
		"name": "Refunded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "receivedEscrows",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sentEscrows",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Multi-blockchain contract address configuration - ONLY SOMNIA NETWORK
export const getWalletXContractAddress = (blockchain) => {
	// Only support Somnia network
	if (blockchain !== 'somnia') {
		throw new Error(`Unsupported blockchain: ${blockchain}. Only Somnia network is supported.`)
	}
	
	const envAddress = import.meta.env.VITE_SOMNIA_CONTRACT_ADDRESS
	if (envAddress && ethers.isAddress(envAddress) && envAddress !== '0x0000000000000000000000000000000000000000') {
		console.log(`Using ${blockchain} contract address:`, envAddress)
		return envAddress
	}
	
	// For demo purposes, return a placeholder address
	// In production, you would deploy contracts to each network
	const placeholderAddress = "0x0000000000000000000000000000000000000000"
	console.warn(`No contract deployed for ${blockchain}, using placeholder address`)
	return placeholderAddress
}

// Legacy export for backward compatibility (defaults to somnia)
export const WALLETX_CONTRACT_ADDRESS = getWalletXContractAddress('somnia')

// Escrow status enum
export const EscrowStatus = {
    PENDING: 0,
    CLAIMED: 1,
    REFUNDED: 2
}

/**
 * Get WalletX contract instance with proper validation
 * @param {string} blockchain - The blockchain name (only 'somnia' supported)
 * @param {string} network - The network name
 * @param {string} privateKey - Optional private key for write operations
 * @returns {ethers.Contract} Contract instance
 */
export const getWalletXContract = (blockchain, network, privateKey = null) => {
    try {
        // Only support Somnia network
        if (blockchain !== 'somnia') {
            throw new Error(`Unsupported blockchain: ${blockchain}. Only Somnia network is supported.`)
        }
        
        const contractAddress = getWalletXContractAddress(blockchain)
        
        // Check if contract is deployed
        if (contractAddress === '0x0000000000000000000000000000000000000000') {
            throw new Error(`WalletX contract not deployed on ${blockchain}`)
        }
        
        const provider = getEVMProvider(blockchain, network)
        if (!provider) {
            throw new Error("Failed to create provider")
        }

        let contractInstance
        if (privateKey) {
            const wallet = new ethers.Wallet(privateKey, provider)
            contractInstance = new ethers.Contract(contractAddress, WALLETX_ABI, wallet)
        } else {
            contractInstance = new ethers.Contract(contractAddress, WALLETX_ABI, provider)
        }

        // Validate contract is properly initialized
        if (!contractInstance) {
            throw new Error("Failed to create contract instance")
        }

        return contractInstance
    } catch (error) {
        console.error("Error creating WalletX contract instance:", error)
        throw error
    }
}

/**
 * Validate contract connectivity
 * @param {string} blockchain - The blockchain name (only 'somnia' supported)
 * @param {string} network - The network name
 * @returns {Promise<boolean>} True if contract is accessible
 */
export const validateContractConnectivity = async (blockchain, network) => {
    try {
        // Only support Somnia network
        if (blockchain !== 'somnia') {
            console.warn(`Unsupported blockchain: ${blockchain}. Only Somnia network is supported.`)
            return false
        }
        
        const contractAddress = getWalletXContractAddress(blockchain)
        
        // Check if contract is deployed (not placeholder address)
        if (contractAddress === '0x0000000000000000000000000000000000000000') {
            console.warn(`Contract not deployed on ${blockchain}`)
            return false
        }
        
        const contract = getWalletXContract(blockchain, network)
        
        // Try to call a simple read-only function to verify connectivity
        await contract.escrowCount()
        return true
    } catch (error) {
        console.error("Contract validation failed:", error)
        return false
    }
}

/**
 * Check if contract is deployed on blockchain
 * @param {string} blockchain - The blockchain name (only 'somnia' supported)
 * @returns {boolean} True if contract is deployed
 */
export const isContractDeployed = (blockchain) => {
    try {
        // Only support Somnia network
        if (blockchain !== 'somnia') {
            return false
        }
        
        const contractAddress = getWalletXContractAddress(blockchain)
        return contractAddress !== '0x0000000000000000000000000000000000000000'
    } catch (error) {
        return false
    }
}