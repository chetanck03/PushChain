import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Key,
  Zap,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
  Link
} from 'lucide-react'

function WalletSelection() {
  const navigate = useNavigate()


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
    // Save selection to localStorage
    localStorage.setItem('selected_wallet_type', type)

    // Navigate to appropriate wallet interface
    if (type === 'bip') {
      // Navigate to existing BIP wallet interface
      localStorage.setItem('selected_blockchain', 'evm')
      navigate('/dashboard')
      window.dispatchEvent(new CustomEvent('blockchainChanged', { detail: 'evm' }))
    } else if (type === 'pushchain-ui') {
      // Navigate directly to escrow page with pushchain-ui type
      navigate('/transaction/pushchain-ui/connect')
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
      features: [
        'BIP39 seed phrase compatibility',
        'Works with MetaMask, Ledger, Trezor'
      ],
      hasExisting: hasExistingBIP
    },
    {
      id: 'pushchain-ui',
      name: 'Push Chain Universal Wallet',
      subtitle: 'Email, Google & Wallet Login',
      description: 'Universal wallet powered by Push Chain UI Kit. Connect with email, Google, or any existing wallet for seamless cross-chain access.',
      icon: Zap,
      features: [
        'Email & Google login',
        'Universal wallet connection'
      ],
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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button - Positioned at top left */}
        <div className="mb-8">
         
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-geist text-2xl sm:text-3xl md:text-4xl bg-clip-text text-transparent bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Wallet Type
            </span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto text-sm sm:text-base px-4 sm:px-0">
            Select the wallet technology that best fits your needs. Both options support Push Chain and escrow payments.
          </p>
        </div>

        {/* Wallet Type Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {walletTypes.map((walletType) => (
            <motion.div
              key={walletType.id}
              onClick={() => handleWalletTypeSelect(walletType.id)}
              className="group cursor-pointer relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-xl p-6 hover:border-neutral-600 transition-all duration-200 h-full flex flex-col">

                {/* Existing Badge */}
                {walletType.hasExisting && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-purple-600/20 to-purple-400/20 border border-purple-500/30 rounded-full px-2 py-1">
                    <CheckCircle className="h-3 w-3 text-purple-400" />
                    <span className="text-xs text-purple-400 font-medium">Existing</span>
                  </div>
                )}

                <div className="text-center flex-1 flex flex-col">
                  {/* Central Icon Display */}
                  <div className="flex justify-center mb-4">
                    <div className="relative inline-block overflow-hidden rounded-full p-[2px]">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-950 backdrop-blur-3xl">
                        <div className="w-14 h-14 rounded-full border border-purple-500/30 flex items-center justify-center">
                          <walletType.icon className="w-6 h-6 text-purple-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{walletType.name}</h3>
                  <p className="text-gray-400 mb-4 text-sm">{walletType.description}</p>

                  {/* Features Grid - Simplified */}
                  <div className="grid grid-cols-1 gap-2 mb-6">
                    {walletType.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 justify-center">
                        <CheckCircle className="h-3 w-3 text-purple-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <span className="relative inline-block overflow-hidden rounded-full p-[1.5px] w-full cursor-pointer">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <div className="inline-flex h-full w-full items-center justify-center rounded-full bg-gray-950 backdrop-blur-3xl">
                        <div className="w-full inline-flex items-center justify-center rounded-full border-[1px] border-transparent bg-gradient-to-tr from-zinc-300/5 via-purple-400/20 to-transparent px-4 py-2 text-white font-medium transition-colors hover:bg-transparent/90">
                          <span className="text-sm">
                            {walletType.hasExisting ? 'Continue with' : 'Create'} {walletType.name}
                          </span>
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>



      </div>
    </div>
  )
}

export default WalletSelection