import { cookieStorage, createStorage, http } from 'wagmi'
import {somniaTestnet } from 'wagmi/chains'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694' // Public testing ID

export const networks = [somniaTestnet]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [somniaTestnet.id] : http('https://api.infra.testnet.somnia.network/ext/bc/C/rpc'),
    // [avalanche.id]: http('https://api.avax.network/ext/bc/C/rpc'),
    // [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc')
  }
})

export const config = wagmiAdapter.wagmiConfig

//chain id smnia = 50312

