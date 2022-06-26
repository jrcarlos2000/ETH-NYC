import NomadicVault from '../artifacts/contracts/NomadicVault.sol/NomadicVault.json';
import NomadicWorldCoin from '../artifacts/artifacts/contracts/NomadicWorldCoin.sol/NomadicWorldCoin.json';

export const NOMADICVAULT = 'NomadicVault';
export const NOMADICWORLDCOIN = 'NomadicWorldCoin';
export const CONTRACT_NAMES = {
    [NOMADICVAULT]: 'NomadicVault',
    [NOMADICWORLDCOIN]: 'NomadicWorldCoin'
};

export const contractData = {
    1: { // mainnet
        [NOMADICVAULT]: {
            address: "0x90B60a419C78776c6687C507b2089DD65Dcb66F9",
            abi: NomadicVault.abi,
        },
        [NOMADICWORLDCOIN]: {
            address: "0xD40E7cF386469137C9479396204b29dE4b51Fb49",
            abi: NomadicWorldCoin.abi,
        }
    },
    4: {// rinkeby
        [NOMADICVAULT]: {
            address: "",
            abi: NomadicVault.abi,
        }
    },
    69: { // kovan
        [NOMADICVAULT]: {
            address: "",
            abi: NomadicVault.abi,
        }
    },
    80001: { // mumbai
        [NOMADICVAULT]: {
            address: "0x90B60a419C78776c6687C507b2089DD65Dcb66F9",
            abi: NomadicVault,
            rpc: "https://matic-mumbai.chainstacklabs.com/"
        },

        // [NOMADICVAULT]: {
        //     address: "0x15f339CC948D544c75685C806FFf69a8612888c0",
        //     abi: NomadicWorldCoin.abi,
        //     rpc: "https://matic-mumbai.chainstacklabs.com/"
        // }

    },
    31337: { // localhost
        [NOMADICVAULT]: {
            address: "",
            abi: NomadicVault.abi,
        }
    },
}