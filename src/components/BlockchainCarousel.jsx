import React from 'react';
import { CheckCircle, Network, Zap, Shield, Globe, Cpu } from 'lucide-react';

// Using Push Chain logo for the universal blockchain platform
import pushchainLogo from '../assests/pushchain.png';
const BlockchainCarousel = () => {
    const pushchainNetworks = [
        {
            name: "Push Chain Donut Testnet",
            description: "Universal blockchain platform enabling seamless cross-chain interactions",
            chainId: "42101", // Push Chain testnet chain ID
            rpc: "https://evm.rpc-testnet-donut-node1.push.org",
            explorer: "https://donut.push.network/", // Push Chain testnet explorer URL
            features: [
                { icon: "Network", text: "Universal Chain Access", description: "Access any blockchain from one platform" },
                { icon: "Zap", text: "Gasless Transactions", description: "Zero gas fees for seamless interactions" },
                { icon: "Shield", text: "Free PC Tokens", description: "Free testnet tokens for development" },
                { icon: "Cpu", text: "Cross-Chain Tools", description: "Universal development ecosystem" },
                { icon: "Globe", text: "Multi-Chain Compatible", description: "Works with all major blockchains" }
            ],
            highlights: [
                "Unified wallet experience",
                "Build universal apps effortlessly",
                "Instant cross-chain settlements",
                "Gasless transactions across all chains",

            ]
        }
    ];

    const getIcon = (iconName) => {
        const icons = {
            Network,
            Zap,
            Shield,
            Cpu,
            Globe,
            CheckCircle
        };
        return icons[iconName] || CheckCircle;
    };

    return (
        <section className="relative py-16 bg-neutral-950 border-t border-neutral-600">
            <div className="absolute top-0 z-[0] h-full w-full bg-neutral-900/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="text-center mb-1">
                    <h2 className="font-geist mx-auto bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-3xl md:text-4xl lg:text-4xl tracking-tighter text-transparent leading-tight mb-6">
                        Powered by{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Push Chain Network
                        </span>
                    </h2>
                    <p className="text-gray-300 text-xl max-w-3xl mx-auto mb-4 leading-relaxed">
                        Experience the future of universal blockchain technology with Push Chain's revolutionary cross-chain platform
                    </p>
                  
                </div>

                {/* Push Chain Networks Grid */}
                <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
                    {pushchainNetworks.map((network, index) => (
                        <div
                            key={network.name}
                            className="group relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-700 rounded-2xl p-8 hover:border-neutral-600 transition-all duration-200 h-full">
                                
                                {/* Header with Logo - Centered */}
                                <div className="text-center mb-3">
                                    <div className="relative inline-block overflow-hidden rounded-full p-[2px] mb-4">
                                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-950 backdrop-blur-3xl">
                                            <div className="w-14 h-14 rounded-full border border-purple-500/30 flex items-center justify-center backdrop-blur-sm">
                                                <img src={pushchainLogo} alt="Push Chain" className="w-8 h-8 object-contain" />
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white ">{network.name}</h3>
                                </div>

                                {/* Network Details - Centered */}
                                <div className="text-center mb-3">
                                    <div className="inline-flex items-center space-x-2 text-base text-purple-400 bg-purple-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                                        <Network className="h-5 w-5" />
                                        <span className="font-semibold">Chain ID: {network.chainId}</span>
                                    </div>
                                </div>

                             

                                {/* Network Highlights */}
                                <div className="text-center">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-4xl mx-auto">
                                        {network.highlights.map((highlight, highlightIndex) => (
                                            <div key={highlightIndex} className="flex items-center justify-center space-x-2 text-gray-300 bg-neutral-800/20 px-4 py-3 rounded-lg border border-neutral-700/30">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span className="text-center">{highlight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

               
            </div>
        </section>
    );
};

export default BlockchainCarousel;