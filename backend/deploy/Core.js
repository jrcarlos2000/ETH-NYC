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

const deployCore = async () => {
  const { deployerAddr, governorAddr } = await getNamedAccounts();

  const dSampleDAO = await deployWithConfirmation("HackerHouseDAO");
  const dNomadicVault = await deployWithConfirmation("NomadicVault",[dSampleDAO.address]);
};

const deployUserRegistry = async () => {
  // we read addresses that we want to use for our deployment function
  // const tokens = await getTokenAddresses();
  // Named accounts allows us to tell which account we want to use for a certain tx
  const { deployerAddr, governorAddr } = await getNamedAccounts();
  // Signers are used to call signed txs from contracts
  const sGovernor = await ethers.provider.getSigner(governorAddr);
  const sDeployer = await ethers.provider.getSigner(deployerAddr);
  //will deploy a contract and wait for its confirmation
  await deployWithConfirmation("UserRegistry");
  // this is how we read the contract
  const cUserRegistry = await ethers.getContract("UserRegistry");
};

const deployNomadicWorldCoin= async () => {
  const { deployerAddr, governorAddr } = await getNamedAccounts();
  const WorldCoinAddr = '0xABB70f7F39035586Da57B3c8136035f87AC0d2Aa';
  const dNomadicWorldCoin = await deployWithConfirmation("NomadicWorldCoin",[WorldCoinAddr]);
}

const main = async () => {
  await deployCore();
  await deployNomadicWorldCoin();
};

main.id = "Core";
main.skip = () => false;
module.exports = main;
