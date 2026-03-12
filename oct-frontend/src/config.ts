import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, base, sepolia, baseSepolia } from 'wagmi/chains'
import { http } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'OpenClaw Token',
  projectId: 'YOUR_PROJECT_ID', // Replace with actual project ID
  chains: [mainnet, base, sepolia, baseSepolia],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: false,
})
