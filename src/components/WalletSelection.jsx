import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wallet, 
  Key, 
  Shield, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Info,
  ArrowLeft,
  Globe,
  Link
} from 'lucide-react'
import toast from 'react-hot-toast'

function WalletSelection() {
  const navigate = useNavigate()
  const [selectedWalletType, setSelectedWalletType] = useState(null)

  // Check if user has existing wallets
  const [hasExistingBIP, setHasExistingBIP] = useState(false)
  const [hasExistingPushChain, setHasExistingPushChain] = useState(false)

  useEffect(() => {
    // Check for existing BIP wallets
    const bipSeed = localStorage.getItem('shared_evm_seed_phrase')
    const bipWallets = localStorage.getItem('pushchain_wallets')
    setHasExistingBIP(!!(bipSeed || bipWallets))

    // Check for existing Push Chain UI Kit connection
    const pushChainConnection = localStorage.getItem('pushchain_ui_connected')
    setHasExistingPushChain(!!pushChainConnection)
  }, [])

  const handleWalletTypeSelect = (type) => {
    setSelectedWalletType(type)
    
    // Save selection to localStorage
    localStorage.setItem('selected_wallet_type', type)
    
    // Navigate to appropriate wallet interface
    if (type === 'bip') {
      // Navigate to existing BIP wallet interface
      localStorage.setItem('selected_blockchain', 'evm')
      navigate('/dashboard')
      window.dispatchEvent(new CustomEvent('blockchainChanged', { detail: 'evm' }))
    } else if (type === 'pushchain-ui') {
      // Navigate to Push Chain UI Kit wallet interface
      navigate('/pushchain-wallet')
    }
  }

  const handleBackToDashboard = () => {
    navigate('/dashboard')
  }

  const walletTypes = [
    {
      id: 'bip',
      name: 'BIP HD Wallets',
      subtitle: 'Standard Hierarchical Deterministic Wallets',
      description: 'Industry-standard BIP39/BIP44 wallets compatible with all major wallet applications and hardware wallets.',
      icon: Key,
      color: 'from-blue-500 to-cyan-500',
      borderColor: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-400/50',
      features: [
        'BIP39 seed phrase compatibility',
        'Works with MetaMask, Ledger, Trezor',
        'Standard derivation paths',
        'Universal wallet support',
        'Backup & recovery anywhere',
        'Hardware wallet compatible'
      ],
      pros: [
        'Industry standard',
        'Universal compatibility',
        'Hardware wallet support',
        'Widely adopted'
      ],
      bestFor: 'Users who want maximum compatibility and standard wallet features',
      hasExisting: hasExistingBIP
    },
    {
      id: 'pushchain-ui',
      name: 'Push Chain Universal Wallet',
      subtitle: 'Email, Google & Wallet Login',
      description: 'Universal wallet powered by Push Chain UI Kit. Connect with email, Google, or any existing wallet for seamless cross-chain access.',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      borderColor: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-400/50',
      features: [
        'Email & Google login',
        'Universal wallet connection',
        'Gasless transactions',
        'Cross-chain compatibility',
        'Push Protocol integration',
        'No seed phrase needed'
      ],
      pros: [
        'Easy email login',
        'No private keys',
        'Gasless transactions',
        'Universal access'
      ],
      bestFor: 'Users who want the simplest, most secure wallet experience',
      hasExisting: hasExistingPushChain
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black">
      {/* Background Effects */}
      <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      <div className="pointer-events-none absolute h-full w-full overflow-hidden opacity-30 sm:opacity-50 [perspective:200px]">
        <div className="absolute inset-0 [transform:rotateX(35deg)]">
          <div className="animate-grid [inset:0%_0px] [margin-left:-50%] [height:300vh] [width:600vw] [transform-origin:100%_0_0] [background-image:linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_0)] sm:[background-image:linear-gradient(to_right,rgba(255,255,255,0.25)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.2)_1px,transparent_0)] [background-size:80px_80px] sm:[background-size:120px_120px] [background-repeat:repeat]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent to-90%" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 pt-24 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={handleBackToDashboard}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
          
          <h1 className="font-geist text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Wallet Type
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Select the wallet technology that best fits your needs. Both options support Push Chain and escrow payments.
          </p>
        </div>

        {/* Wallet Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {walletTypes.map((walletType) => (
            <motion.div
              key={walletType.id}
              className="group cursor-pointer relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={() => handleWalletTypeSelect(walletType.id)}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${walletType.color} rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              
              <div className={`relative bg-neutral-900/50 backdrop-blur-sm border ${walletType.borderColor} ${walletType.hoverBorder} rounded-xl p-6 transition-all duration-200 h-full flex flex-col min-h-[600px]`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${walletType.color} bg-opacity-10 border ${walletType.borderColor}`}>
                      <walletType.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{walletType.name}</h3>
                      <p className="text-sm text-gray-400">{walletType.subtitle}</p>
                    </div>
                  </div>
                  
                  {walletType.hasExisting && (
                    <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-1">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">Existing</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {walletType.description}
                </p>

                {/* Features */}
                <div className="mb-6 flex-grow">
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Key Features
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {walletType.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Best For */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Best For
                  </h4>
                  <p className="text-gray-300 text-sm bg-neutral-800/30 rounded-lg p-3 border border-neutral-700/50">
                    {walletType.bestFor}
                  </p>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] w-full cursor-pointer">
                    <span className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,${walletType.color.includes('blue') ? '#3B82F6' : '#A855F7'}_0%,${walletType.color.includes('blue') ? '#06B6D4' : '#EC4899'}_50%,${walletType.color.includes('blue') ? '#3B82F6' : '#A855F7'}_100%)]`} />
                    <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
                      <div className="w-full inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-6 py-3 text-white font-medium transition-colors hover:bg-transparent/90">
                        <span>
                          {walletType.hasExisting ? 'Continue with' : 'Create'} {walletType.name}
                        </span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Feature Comparison
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Feature</th>
                  <th className="text-center py-3 px-4 text-blue-400 font-medium">BIP HD Wallets</th>
                  <th className="text-center py-3 px-4 text-purple-400 font-medium">Push Chain UI Kit</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Standard Compatibility</td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Email/Google Login</td>
                  <td className="text-center py-3 px-4">
                    <span className="text-gray-500">-</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Gasless Transactions</td>
                  <td className="text-center py-3 px-4">
                    <span className="text-gray-500">-</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Cross-Chain Support</td>
                  <td className="text-center py-3 px-4">
                    <span className="text-yellow-400 text-xs">Manual</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-neutral-800">
                  <td className="py-3 px-4">Push Protocol Integration</td>
                  <td className="text-center py-3 px-4">
                    <span className="text-yellow-400 text-xs">Basic</span>
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Escrow Payments</td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                  <td className="text-center py-3 px-4">
                    <CheckCircle className="h-4 w-4 text-green-400 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="text-white font-semibold mb-2">Important Note</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Both wallet types support all core WalletX features including escrow payments, Push Chain transactions, and secure storage. 
                You can switch between wallet types at any time, and your existing wallets will remain accessible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletSelection