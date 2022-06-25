
/* global BigInt */
import { defaultAbiCoder as abi } from "@ethersproject/abi";
import { keccak256 } from "@ethersproject/solidity";
import worldID from "@worldcoin/id";
import { solidityKeccak256, solidityPack } from "ethers/lib/utils";
import React from "react";
// import { CONTRACT_ADDRESS } from "./const";

const CONTRACT_ADDRESS = '0x15f339CC948D544c75685C806FFf69a8612888c0';

const hashBytes = (input)=> {
  return abi.encode(
    ["uint256"],
    [BigInt(keccak256(["bytes"], [input])) >> BigInt(8)],
  );
};

export const WorldIDComponent = (props) => {
    console.log('world id loaded')
  const {signal, setProof,signalParams} = props;
  const enableWorldID = async () => {
    try {
      const result = await worldID.enable();
      setProof(result);
    } catch (error) {
      console.error(error);
      enableWorldID().catch(console.error.bind(console));
    }
  };
  React.useEffect(() => {
    if (!worldID.isInitialized()) {
        console.log('initializing coinworld')
      worldID.init("world-id-container", {
        action_id: hashBytes(CONTRACT_ADDRESS),
        signal: encode(...signalParams),
        advanced_use_raw_signal: true
      });
    }
    if (!worldID.isEnabled()) {
      enableWorldID().catch(console.error.bind(console));
    }
  }, []);
  return <div id="world-id-container" />;
};

export const encode = (param1, param2, param3, param4 ) => {
    console.log(param1, param2, param3, param4);
    const rawDigest = (BigInt(solidityKeccak256(["bytes"], [solidityPack(['string', 'uint256', 'uint256', 'uint256'], [param1, param2, param3, param4])])) >> BigInt(8)).toString(16);
    console.log(rawDigest);
    return `0x${rawDigest.padStart(64, "0")}`
}