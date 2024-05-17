import {
    RainbowKitProvider,
    getDefaultConfig,
  } from '@rainbow-me/rainbowkit';
  import { WagmiProvider } from 'wagmi';
  import {
    QueryClientProvider,
    QueryClient,
  } from "@tanstack/react-query";
  import { defineChain } from 'viem'
  import { mainnet, sepolia, pulsechain, skaleTitan } from 'wagmi/chains'
  import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
  import { createWeb3Modal } from '@web3modal/wagmi/react'
  
  const blueberry = defineChain({
    id: 88_153_591_557,
    name: 'Arbitrum Blueberry',
    iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
    iconBackground: '#fff',
    nativeCurrency: { name: ' CGT', symbol: ' CGT', decimals: 18 },
    rpcUrls: {
      default: { http: [' https://rpc.arb-blueberry.gelato.digital'] },
    },
    blockExplorers: {
      default: { name: 'ARBITRUM', url: ' https://arb-blueberry.gelatoscout.com' },
    },
  });
  const projectId = '2a6133e95d7eeefc55a380b838aa9d1d'
  
// 2. Create wagmiConfig
const metadata = {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://web3modal.com', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  }
  const chains = [mainnet, blueberry];
  const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata
  })
// 3. Create modal
createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true, // Optional - defaults to your Cloud configuration
    enableOnramp: true // Optional - false as default
  })
  const queryClient = new QueryClient();
  
  export const BlueberryModalProvider = ({children}) => {
    return (
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
  };