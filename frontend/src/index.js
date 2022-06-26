import React from "react";
import ReactDOM from "react-dom";
import App from "./App"
import {Provider} from "react-redux";
import { createStore } from "redux";
import reducers from "./reducers"
import { Web3Provider } from "@ethersproject/providers";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import "@rainbow-me/rainbowkit/styles.css";
import { infuraProvider } from 'wagmi/providers/infura'
import { RPC_URLS } from './connectors';

const infuraId = process.env.INFURA_ID
const alchemyId = process.env.ALCHEMY_ID

const mumbaiChain = {
  id: 80001,
  name: 'Mumbai',
  network: 'mumbai',
  gas: 2100000,
  gasPrice: 8000000000,
  nativeCurrency: {
    decimals: 18,
    name: 'Matic',
    symbol: 'MATIC',
  },
  rpcUrls: {
    default: RPC_URLS[80001],
  },
  testnet: true,
}
console.log("chain: ", chain);

const { provider, chains } = configureChains(
  [chain.mainnet, mumbaiChain],
  // use this for localhost dev
  // [chain.mainnet, mumbaiChain, chain.localhost],
  [
    alchemyProvider({ alchemyId }),
    infuraProvider({ infuraId }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== mumbaiChain.id) return null
        return { http: chain.rpcUrls.default }
      },
    }),
    // use this for localhost
    // jsonRpcProvider({
    //   rpc: (chain) => ({
    //     http: `https://${chain.id}.example.com`,
    //   }),
    // }),
  ],
)

console.log('provider: ', provider);
const { connectors } = getDefaultWallets({
  appName: 'NomadDAO',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

ReactDOM.render(
     <Provider store={createStore(reducers)}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme({
              accentColor: '#FF3E60',
              accentColorForeground: 'white',
              borderRadius: 'small',
              fontStack: 'system'
            })}>
            <App />
        </RainbowKitProvider>
      </WagmiConfig>
     </Provider>
, 
document.querySelector("#root"));