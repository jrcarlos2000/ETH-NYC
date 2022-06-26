import { contractData } from "./config";
import { getAddress } from "@ethersproject/address";
import { Contract } from "@ethersproject/contracts";
import { AddressZero, MaxUint256 } from "@ethersproject/constants";
import { NFTStorage, Bob } from "nft.storage";

export async function publishToIPFS(metadata) {
  const ipfs = new NFTStorage({
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDkxREVEZjVCMmI3REU3NDA1RjM4YjkwMjNhYzAxNTdFMTU3MGE1NjkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1MDcyMTAwODQyMiwibmFtZSI6ImFtc3RlcmRhbSJ9.Sn1JCXO3xWD5tLdsCsWVRzbNyJFE1fOSQjTYzaKfEPU",
  });
  let sampleDict = {
    name: "carlos",
    title: " asasdasd ",
    options: {
      carlos: "assss",
      emerson: "assss",
    },
  };

  sampleDict = JSON.stringify(sampleDict);
  const someData = new Blob([sampleDict]);
  console.log("printing metadata: ", someData);
  const cid = await ipfs.storeBlob(someData);
  console.log(cid);
  return `https://ipfs.io/ipfs/${cid}`;
}
export async function uploadDataToIPFS() {
  await publishToIPFS();
}

export const performTx = async (
  activeChain,
  userData,
  signer,
  provider,
  contractName,
  functionName,
  args
) => {
  console.log("signer: ", signer, signer.getAddress());
  console.log(
    "calling perfromTX: ",
    contractName,
    functionName,
    activeChain.id
  );
  const contract = getContract(activeChain, contractName, provider);
  console.log("contract: ", contract);
};

const getContract = (activeChain, contractName, provider) => {
  const contractAddress = contractData[activeChain.id][contractName].address;
  const contractAbi = contractData[activeChain.id][contractName].abi;
  console.log("contractAddress: ", contractAddress);

  if (!isAddress(contractAddress) || contractAddress === AddressZero) {
    console.error("Not a correct contract address");
    return;
  }

  return new Contract(contractAddress, contractAbi, provider);
};

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
