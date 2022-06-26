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
const test1Inch = async () => {

  const {deployerAddr,governorAddr} = await getNamedAccounts();
  const routerAddr = '0x1111111254fb6c44bac0bed2854e76f90643097d';
  const tokenA = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
  const amount = '500000'

  const ctokenA = await ethers.getContractAt(ERC20ABI,tokenA);

  const sDeployer = ethers.provider.getSigner(deployerAddr);

  // await ctokenA['approve'](routerAddr,amount);

  const tokenB = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
  const ctokenB = await ethers.getContractAt(ERC20ABI,tokenB);
  const excAddr = '0x2A71693A4d88b4f6AE6697A87b3524c04B92ab38'

  const response = await fetch(`https://api.1inch.io/v4.0/137/swap?fromTokenAddress=0xc2132D05D31c914a87C6611C10748AEb04B58e8F&toTokenAddress=0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063&amount=${amount}&fromAddress=${deployerAddr}&slippage=20&disableEstimate=true`);

  const data = (await response.json())
  console.log(data);
  let currBalance = await ctokenA['balanceOf'](governorAddr);
  await ctokenA['approve'](routerAddr,amount);
  console.log(currBalance.toString());
  console.log(data.tx.data)

  const cRouter = await ethers.getContractAt(OneInchABI,'0x1111111254fb6c44bac0bed2854e76f90643097d');

  await cRouter.connect(sDeployer)['swap'](excAddr,[tokenA,tokenB,excAddr,deployerAddr,amount,'12','4','0x'],data.tx.data, {gasLimit : '2500000'});


  currBalance = await ctokenA['balanceOf'](governorAddr);

  console.log(currBalance.toString())
}
const main = async () => {
  await deployNomadicKeeper();
  // await test1Inch();
};

main.id = "Extras";
main.skip = () => isFork;
module.exports = main;
