import { InjectedConnector } from "@web3-react/injected-connector";

const POLLING_INTERVAL = 12000;
export const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/84842078b09946638c03157f83405213",
  4: "https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213",
  69: "https://kovan.optimism.io/",
  80001: "https://matic-mumbai.chainstacklabs.com/", // mumbai

};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 69, 80001]
});
