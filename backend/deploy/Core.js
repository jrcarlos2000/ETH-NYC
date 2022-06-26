require("hardhat");
const { utils } = require("ethers");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { parseUnits, formatUnits } = require("ethers").utils;
const { getTokenAddresses, isFork } = require("../utils/helpers");
const {
  deployWithConfirmation,
  withConfirmation,
  log,
} = require("../utils/deploy");

const deployVault = async () => {
  const { deployerAddr, governorAddr } = await getNamedAccounts();
  const dNomadicVault = await deployWithConfirmation("NomadicVault");
};

const deployNomadicWorldCoin= async () => {
  const { deployerAddr, governorAddr } = await getNamedAccounts();
  const WorldCoinAddr = '0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa';
  const dNomadicWorldCoin = await deployWithConfirmation("NomadicWorldCoin",[WorldCoinAddr]);
}

const main = async () => {
  await deployVault();
  await deployNomadicWorldCoin();
};

main.id = "Core";
main.skip = () => true;
module.exports = main;
