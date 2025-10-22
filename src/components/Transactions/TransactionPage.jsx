import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Send, RefreshCw, Copy, Network, QrCode, Key, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import EVMTransaction from './EVMTransaction'
import EscrowTransaction from './EscrowTransaction'
import { isEVMCompatible, NETWORK_CONFIGS } from '../../lib/networks'
import { WALLETX_CONTRACT_ADDRESS } from '../../lib/contractUtils'
import QRCodeModal from '../Wallet/EthComponents/QRCodeModal'

// Import blockchain logos
import pushchainLogo from '../../assests/pushchain.png'

function TransactionPage() {
    const { address } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const [walletData, setWalletData] = useState(null)
    const [currentBlockchain, setCurrentBlockchain] = useState('pushchain') // Only Push Chain supported
    const [showQRModal, setShowQRModal] = useState(false)
    const [walletType, setWalletType] = useState('bip') // 'bip' or 'pushchain-sdk'

    // Get all available blockchains for network selection (only Push Chain)
    const availableBlockchains = Object.keys(NETWORK_CONFIGS).map(blockchainId => ({
        id: blockchainId,
        name: NETWORK_CONFIGS[blockchainId].name,
        symbol: NETWORK_CONFIGS[blockchainId].symbol,
        config: NETWORK_CONFIGS[blockchainId]
    }))

    // Function to get the correct logo based on blockchain
    const getBlockchainLogo = (blockchain) => {
        switch (blockchain) {
            case 'pushchain':
                return pushchainLogo
            default:
                return pushchainLogo // fallback to pushchain
        }
    }

    // Handle blockchain change (only Push Chain supported)
    const handleBlockchainChange = (newBlockchain) => {
        // Only allow Push Chain
        if (newBlockchain === 'pushchain') {
            setCurrentBlockchain(newBlockchain)
            // Update localStorage to persist selection
            localStorage.setItem('selected_network', newBlockchain)
            // Dispatch event to notify other components
            window.dispatchEvent(new CustomEvent('blockchainChanged', { detail: newBlockchain }))
            toast.success(`Switched to ${NETWORK_CONFIGS[newBlockchain].name}`)
        } else {
            toast.error('Only Push Chain network is supported')
        }
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        toast.success('Address copied to clipboard!')
    }

    const handleShowQRCode = () => {
        setShowQRModal(true)
    }

    const handleCloseQRModal = () => {
        setShowQRModal(false)
    }

    useEffect(() => {
        // Get the current blockchain from localStorage (only Push Chain supported)
        const savedNetwork = localStorage.getItem('selected_network') || 'pushchain'
        setCurrentBlockchain(savedNetwork)

        // Determine wallet type from URL path or location state
        let detectedWalletType = 'bip' // default
        if (location.pathname.includes('pushchain-ui')) {
            detectedWalletType = 'pushchain-ui'
        } else if (location.state?.walletType) {
            detectedWalletType = location.state.walletType
        }
        setWalletType(detectedWalletType)

        // Debug: Log what we're looking for
        console.log('🔍 TransactionPage Debug:')
        console.log('- Looking for wallet address:', address)
        console.log('- Saved network:', savedNetwork)
        console.log('- Detected wallet type:', detectedWalletType)
        console.log('- Available storage keys:', Object.keys(localStorage))

        let foundWallet = null

        // Search based on wallet type
        if (detectedWalletType === 'pushchain-ui') {
            // For Push Chain UI Kit, create a mock wallet data since it's handled by the UI Kit
            foundWallet = {
                publicKey: address,
                address: address,
                blockchain: savedNetwork,
                walletType: 'pushchain-ui',
                name: 'Push Chain Universal Account'
            }
        } else {
            // Search in BIP wallets (existing logic)
            // First check unified EVM storage
            const unifiedWallets = localStorage.getItem('evm_shared_wallets')
            console.log('- Unified wallets storage:', unifiedWallets)
            if (unifiedWallets) {
                try {
                    const wallets = JSON.parse(unifiedWallets)
                    console.log('- Parsed wallets:', wallets)
                    console.log('- Number of wallets:', wallets.length)
                    const wallet = wallets.find(w => w.publicKey === address)
                    console.log('- Found wallet in unified storage:', wallet)
                    if (wallet) {
                        foundWallet = {
                            ...wallet,
                            blockchain: savedNetwork,
                            walletType: 'bip'
                        }
                    }
                } catch (error) {
                    console.error('Error parsing unified wallet data:', error)
                }
            }
        }

        // If not found and it's BIP wallet, try legacy storage for backward compatibility
        if (!foundWallet && detectedWalletType === 'bip') {
            // Try to find the wallet in any blockchain's storage
            Object.keys(NETWORK_CONFIGS).forEach(blockchainId => {
                if (!foundWallet) {
                    const storageKey = `evm_wallets_${blockchainId}`
                    const savedWallets = localStorage.getItem(storageKey)

                    if (savedWallets) {
                        try {
                            const wallets = JSON.parse(savedWallets)
                            const wallet = wallets.find(w => w.publicKey === address)
                            if (wallet) {
                                foundWallet = {
                                    ...wallet,
                                    blockchain: savedNetwork,
                                    walletType: 'bip'
                                }
                            }
                        } catch (error) {
                            console.error(`Error parsing wallet data for ${blockchainId}:`, error)
                        }
                    }
                }
            })

            // Also check the old 'evm_wallets' key for backward compatibility
            if (!foundWallet) {
                const savedWallets = localStorage.getItem('evm_wallets')
                if (savedWallets) {
                    try {
                        const wallets = JSON.parse(savedWallets)
                        const wallet = wallets.find(w => w.publicKey === address)
                        if (wallet) {
                            foundWallet = {
                                ...wallet,
                                blockchain: savedNetwork,
                                walletType: 'bip'
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing legacy wallet data:', error)
                    }
                }
            }
        }

        if (foundWallet) {
            console.log('✅ Wallet found:', foundWallet)
            setWalletData(foundWallet)
        } else {
            console.log('❌ Wallet not found anywhere!')
            console.log('- Searched wallet type:', detectedWalletType)
            console.log('- Address being searched:', address)
            toast.error('Wallet not found')
            // Navigate back to appropriate wallet interface
            if (detectedWalletType === 'pushchain-ui') {
                navigate('/pushchain-wallet')
            } else {
                navigate('/dashboard')
            }
        }
    }, [address, navigate, location])

    if (!walletData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center relative">
                <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
                <div className="relative z-10 text-center">
                    <div className="relative inline-block overflow-hidden rounded-full p-[2px] mb-6">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#9945ff_0%,#14f195_50%,#9945ff_100%)]" />
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-950 backdrop-blur-3xl">
                            <RefreshCw className="animate-spin text-purple-400" size={32} />
                        </div>
                    </div>
                    <p className="text-lg text-gray-300 font-geist">Loading wallet...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black pt-16 relative">
            {/* Background Effects */}
            <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center mb-6 sm:mb-8">
                    <button
                        onClick={() => {
                            // Navigate back to appropriate wallet interface based on wallet type
                            if (walletType === 'pushchain-ui') {
                                navigate('/pushchain-wallet')
                            } else {
                                localStorage.setItem('selected_blockchain', 'evm')
                                navigate('/dashboard')
                            }
                        }}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-200 font-medium bg-neutral-900/70 backdrop-blur-sm border border-neutral-600 hover:border-neutral-400 rounded-lg px-4 py-2.5 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>

                {/* Wallet Info */}
                <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-400/20 rounded-xl blur opacity-75"></div>
                        <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative inline-block overflow-hidden rounded-full p-[2px]">
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-950 backdrop-blur-3xl">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 flex items-center justify-center">
                                            {walletType === 'pushchain-ui' ? (
                                                <Zap size={20} className="text-purple-400" />
                                            ) : (
                                                <Key size={20} className="text-blue-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-semibold capitalize text-white font-geist">
                                        {walletType === 'pushchain-ui' ? 'Push Chain Universal' : 'BIP HD'} Wallet #{walletData.index !== undefined ? walletData.index + 1 : (walletData.name ? walletData.name.replace(/\D/g, '') : '')}
                                    </h1>
                                    <p className="text-sm text-gray-400">
                                        {walletType === 'pushchain-ui' ? 'Universal Execution Account' : 'Standard HD Wallet'}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3 font-geist">
                                    Wallet Address
                                </label>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <div className="flex-1 px-4 py-3 bg-neutral-800/50 border border-neutral-600 rounded-lg">
                                        <p className="font-mono text-sm break-all text-gray-200 leading-relaxed">{walletData?.publicKey || address}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleShowQRCode}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <QrCode size={16} />
                                            <span>QR Code</span>
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(walletData?.publicKey || address)}
                                            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 border border-purple-500/30 rounded-lg transition-colors text-sm font-medium"
                                        >
                                            <Copy size={14} />
                                            <span>Copy</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Blockchain Network Selection - ONLY PUSH CHAIN */}
                <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-blue-400/20 rounded-xl blur opacity-75"></div>
                        <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 md:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative inline-block overflow-hidden rounded-full p-[1px]">
                                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                    <div className="inline-flex items-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-400/20 border border-purple-500/30 justify-center bg-neutral-950 backdrop-blur-3xl">
                                        <Network className="text-purple-400" size={20} />
                                    </div>
                                </div>
                                <h2 className="text-lg sm:text-xl font-semibold text-white font-geist">Push Chain Network</h2>
                            </div>



                            {/* Current Network Info */}
                            <div className="mt-6 p-4 bg-neutral-800/30 border  border-neutral-600 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={getBlockchainLogo(currentBlockchain)}
                                        alt={NETWORK_CONFIGS[currentBlockchain]?.name}
                                        width={32}
                                        height={32}
                                    />
                                    <div>
                                        <p className="text-sm sm:text-base font-medium text-white">
                                            <span className='text-purple-400'>Active Network:</span> {NETWORK_CONFIGS[currentBlockchain]?.networks.testnet.name}
                                        </p>
                                        <p className="text-sm sm:text-base text-gray-400">
                                            Your wallet works on the Push Chain network
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction Component */}
                {currentBlockchain && isEVMCompatible(currentBlockchain) && (
                    // Use EscrowTransaction if WalletX contract is configured, otherwise use EVMTransaction
                    WALLETX_CONTRACT_ADDRESS && WALLETX_CONTRACT_ADDRESS !== "0xYourWalletXContractAddress" ? (
                        <EscrowTransaction walletData={walletData} blockchain={currentBlockchain} />
                    ) : (
                        <EVMTransaction walletData={walletData} blockchain={currentBlockchain} />
                    )
                )}

                <QRCodeModal
                    isOpen={showQRModal}
                    onClose={handleCloseQRModal}
                    walletAddress={walletData?.publicKey || address}
                    walletName={`Push Chain Wallet #${walletData?.index !== undefined ? walletData.index + 1 : ''}`}
                />
            </div>
        </div>
    )
}

export default TransactionPage