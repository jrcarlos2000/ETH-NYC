import NomadicVault from '../artifacts/contracts/NomadicVault.sol/NomadicVault.json';
import NomadicWorldCoin from '../artifacts/contracts/NomadicWorldCoin.sol/NomadicWorldCoin.json';
import HackerHouseDAO from '../artifacts/contracts/HackerHouseDAO.sol/HackerHouseDAO.json';

export const NOMADICVAULT = 'NomadicVault';
export const HACKER_HOUSE_DAO = 'HackerHouseDAO';
export const NOMADICWORLDCOIN = 'NomadicWorldCoin';
export const CONTRACT_NAMES = {
    [NOMADICVAULT]: 'NomadicVault',
    [NOMADICWORLDCOIN]: 'NomadicWorldCoin',
    [HACKER_HOUSE_DAO]: HACKER_HOUSE_DAO
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
            abi: NomadicVault.abi,
            rpc: "https://matic-mumbai.chainstacklabs.com/"
        },

        // [NOMADICVAULT]: {
        //     address: "0x15f339CC948D544c75685C806FFf69a8612888c0",
        //     abi: NomadicWorldCoin.abi,
        //     rpc: "https://matic-mumbai.chainstacklabs.com/"
        // }

    },
    1337: { // localhost
        [NOMADICVAULT]: {
            address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
            abi: NomadicVault.abi,
        },
        [HACKER_HOUSE_DAO]: {
            address: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
            abi: HackerHouseDAO.abi,
        }
    },
}