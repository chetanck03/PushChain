import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Zap, Shield, Globe, Info } from 'lucide-react'
import {
  PushUniversalWalletProvider,
  PushUniversalAccountButton,
  usePushWalletContext,
  usePushChainClient,
  PushUI,
} from '@pushchain/ui-kit'

// Push Chain UI Kit Wallet Component
function PushChainWalletUI() {
  const { connectionStatus } = usePushWalletContext()
  const { pushChainClient } = usePushChainClient()
  const navigate = useNavigate()

  // Make Push Chain client globally available for escrow operations
  React.useEffect(() => {
    if (connectionStatus === PushUI.CONSTANTS.CONNECTION.STATUS.CONNECTED && pushChainClient?.universal?.account) {
      // Store connection data
      const connectionData = {
        status: 'connected',
        universalAccount: pushChainClient.universal.account,
        connectedWallet: pushChainClient.connectedWallet?.address,
        timestamp: Date.now()
      }
      localStorage.setItem('pushchain_ui_connection', JSON.stringify(connectionData))
      localStorage.setItem('pushchain_ui_connected', 'true')
      
      // Make Push Chain client globally available for escrow operations
      if (typeof window !== 'undefined') {
        window.pushChainClient = pushChainClient
      }
      
      console.log('✅ Push Chain connection stored and client made global:', connectionData)
    } else if (connectionStatus === PushUI.CONSTANTS.CONNECTION.STATUS.DISCONNECTED) {
      // Clear connection data on disconnect
      localStorage.removeItem('pushchain_ui_connection')
      localStorage.removeItem('pushchain_ui_connected')
      
      // Clear global client
      if (typeof window !== 'undefined') {
        window.pushChainClient = null
      }
      
      console.log('❌ Push Chain connection cleared')
    }
  }, [connectionStatus, pushChainClient])

  const handleBackToSelection = () => {
    navigate('/wallet-selection')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black overflow-x-auto pt-20 relative">
      {/* Background Effects */}
      <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToSelection}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Selection
            </button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 bg-opacity-10 border border-purple-500/30">
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-white">Push Chain Universal Wallet</h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Connect with email, Google, or any wallet. Universal access to Push Chain ecosystem.
          </p>
        </div>

        {/* Features Banner */}
        <div className="bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-purple-400" />
              <div>
                <h4 className="text-white font-medium">Universal Access</h4>
                <p className="text-gray-400 text-sm">Email, Google, or wallet login</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-pink-400" />
              <div>
                <h4 className="text-white font-medium">Gasless Transactions</h4>
                <p className="text-gray-400 text-sm">No gas fees required</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-blue-400" />
              <div>
                <h4 className="text-white font-medium">Secure & Simple</h4>
                <p className="text-gray-400 text-sm">Enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Wallet Interface */}
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Your Account</h2>
            <p className="text-gray-400 mb-8">
              Choose your preferred method to connect to Push Chain
            </p>

            {/* Push Chain UI Kit Button */}
            <div className="flex justify-center mb-8">
              <div className="transform hover:scale-105 transition-transform">
                <PushUniversalAccountButton />
              </div>
            </div>

            {/* Connection Status */}
            {connectionStatus === PushUI.CONSTANTS.CONNECTION.STATUS.CONNECTED && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400">Connected Successfully!</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-green-400" />
                      <p className="text-green-400 font-semibold text-sm">Universal Execution Account (UEA)</p>
                    </div>
                    <p className="text-white font-mono text-sm break-all mb-2">
                      {pushChainClient?.universal?.account}
                    </p>
                    <p className="text-gray-400 text-xs">
                      This is your universal address for all transactions across all blockchains
                    </p>
                  </div>

                  {/* <div className="bg-neutral-800/30 border border-neutral-600 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <p className="text-blue-400 font-semibold text-sm">Connected Wallet</p>
                    </div>
                    <p className="text-gray-300 font-mono text-sm break-all mb-2">
                      {pushChainClient?.connectedWallet?.address || 'Not available'}
                    </p>
                    <p className="text-gray-400 text-xs">
                      Your original wallet used for authentication only
                    </p>
                  </div> */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={() => navigate(`/transaction/pushchain-ui/${pushChainClient?.universal?.account}`)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
                    >
                      <Zap className="h-4 w-4" />
                      Send Transaction
                    </button>
                    
                    <button
                      onClick={() => window.open(`https://donut.push.network/address/${pushChainClient?.universal?.account}`, '_blank')}
                      className="flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 border border-neutral-600"
                    >
                      <Globe className="h-4 w-4" />
                      View on Explorer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {connectionStatus === PushUI.CONSTANTS.CONNECTION.STATUS.CONNECTING && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 mt-8">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
                  <p className="text-yellow-400 font-medium">Connecting to Push Chain...</p>
                </div>
              </div>
            )}

            {connectionStatus === PushUI.CONSTANTS.CONNECTION.STATUS.DISCONNECTED && (
              <div className="bg-neutral-800/30 border border-neutral-600 rounded-xl p-6 mt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Info className="h-6 w-6 text-gray-400" />
                  <p className="text-gray-400">Ready to connect</p>
                </div>
                <p className="text-gray-500 text-sm">
                  Click the button above to connect with your preferred method
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-2">Understanding Universal Execution Account (UEA)</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-yellow-400 font-medium mb-1">🔐 Connected Wallet (Authentication)</p>
                  <p className="text-gray-300 leading-relaxed">
                    Your original wallet (MetaMask, etc.) is used only for authentication. It proves you own the account but doesn't handle transactions.
                  </p>
                </div>
                <div>
                  <p className="text-green-400 font-medium mb-1">⚡ Universal Execution Account (Transactions)</p>
                  <p className="text-gray-300 leading-relaxed">
                    Push Chain creates a UEA that handles all transactions across ALL blockchains. This address receives funds, sends payments, and works with escrow - all gasless!
                  </p>
                </div>
                <div>
                  <p className="text-purple-400 font-medium mb-1">🌐 Why This is Better</p>
                  <p className="text-gray-300 leading-relaxed">
                    One UEA works on Ethereum, Solana, Base, Polygon, etc. No gas fees, no network switching, no multiple wallets needed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with Push Chain UI Kit Provider
function PushChainUIWallet() {
  // Define Wallet Config
  const walletConfig = {
    network: PushUI.CONSTANTS.PUSH_NETWORK.TESTNET,
    login: {
      email: true,
      google: true,
      wallet: {
        enabled: true,
      },
      appPreview: true,
    },
    modal: {
      loginLayout: PushUI.CONSTANTS.LOGIN.LAYOUT.SPLIT,
      connectedLayout: PushUI.CONSTANTS.CONNECTED.LAYOUT.HOVER,
      appPreview: true,
    },
  }

  // Define Your App Preview
  const appMetadata = {
    logoUrl: '/favicon.ico', // Use your app's logo
    title: 'WalletX',
    description: 'Universal Push Chain Wallet Platform - Create, manage, and transact across all blockchains',
  }

  return (
    <PushUniversalWalletProvider config={walletConfig} app={appMetadata}>
      <PushChainWalletUI />
    </PushUniversalWalletProvider>
  )
}

export default PushChainUIWallet