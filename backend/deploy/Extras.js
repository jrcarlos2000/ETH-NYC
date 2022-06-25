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

const deployNomadicKeeper = async () => {
  const { deployerAddr, governorAddr } = await getNamedAccounts();
  // const config = '0x111122223333444455556666777788889999AAAABBBBCCCCDDDDEEEEFFFFCCCC'
  const config = '0x1200000000000000000000000000000000000000000000000000000000000000';
  const cNomadicVault = await ethers.getContract('NomadicVault');

  const currentId = await cNomadicVault['stayId']();
  // console.log(currentId);
  //pass days to execute this function as bytes in this keeper we wanna do this every
  //starting form left to right ( sunday ) 
  //00010010 wednesday and saturday 
  const dNomadicKeeper = await deployWithConfirmation("NomadicKeeper",[config,cNomadicVault.address]);
  const cNomadicKeeper = await ethers.getContract('NomadicKeeper');
  // const checkupkeep = await cNomadicKeeper['checkUpkeep']('0x0600000000000000000000000000000000000000000000000000000000000000');
  // console.log(checkupkeep);
};

const main = async () => {
  await deployNomadicKeeper();
};

main.id = "Extras";
main.skip = () => false;
module.exports = main;
