import { contractData } from './config';
import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { AddressZero, MaxUint256 } from "@ethersproject/constants";

export const performTx = async (
        activeChain,
        userData,
        signer,
        provider,
        contractName,
        functionName,
        args
    ) => {
        console.log('signer: ', signer, signer.getAddress());
        console.log('calling perfromTX: ',
            contractName,
            functionName,
            activeChain.id
        );
        const contract = getContract(activeChain, contractName, provider);
        console.log('contract: ', contract);
}

const getContract = (activeChain, contractName, provider) => {
    const contractAddress = contractData[activeChain.id][contractName].address;
    const contractAbi = contractData[activeChain.id][contractName].abi;
    console.log("contractAddress: ", contractAddress);

    if (!isAddress(contractAddress) || contractAddress === AddressZero) {
      console.error("Not a correct contract address");
      return;
    }

    return new Contract(contractAddress, contractAbi, provider);
}


export function isAddress(value) {
    try {
      return getAddress(value);
    } catch {
      return false;
    }
  }

// export function getContract(address, ABI, library, account) {
//     if (!isAddress(address) || address === AddressZero) {
//       console.log("not working");
//     }
  
//     return new Contract(address, ABI, getProviderOrSigner(library, account));
//   }