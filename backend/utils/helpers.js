const { createFixtureLoader } = require("ethereum-waffle");

const {addresses} = require("../utils/addresses");
const forkedNetwork = process.env.NETWORK;
const isPolygon = hre.network.name === "polygon" || forkedNetwork == "polygon";
const isMainnet = hre.network.name === "mainnet" || forkedNetwork == "mainnet";
const isLocalHost = hre.network.name === "localhost";
const isFork = hre.network.name == "hardhat";

const getTokenAddresses = async (deployments) => {
  if (isPolygon) {
    return {
      USDT: addresses.polygon.USDT,
      USDC: addresses.polygon.USDC,
      DAI: addresses.polygon.DAI,
    };
  }
};
const loadFixture = createFixtureLoader(
  [
    hre.ethers.provider.getSigner(0),
    hre.ethers.provider.getSigner(1),
    hre.ethers.provider.getSigner(2),
    hre.ethers.provider.getSigner(3),
    hre.ethers.provider.getSigner(4),
    hre.ethers.provider.getSigner(5),
    hre.ethers.provider.getSigner(6),
    hre.ethers.provider.getSigner(7),
    hre.ethers.provider.getSigner(8),
    hre.ethers.provider.getSigner(9),
  ],
  hre.ethers.provider
);

module.exports = {
  getTokenAddresses,
  isPolygon,
  isMainnet,
  isLocalHost,
  isFork,
  forkedNetwork,
  loadFixture,
};
