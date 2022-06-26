const { ethers } = require("hardhat");
const hre = require("hardhat");

async function defaultFixture() {
    await deployments.fixture();
    // const dummyToken = await ethers.getContract('DummyToken');
    const HackerHouseDAO = await ethers.getContract('HackerHouseDAO');
    const NomadicVault = await ethers.getContract('NomadicVault');
    
    return {
        // dummyToken,
        HackerHouseDAO,
        NomadicVault
    }
}

module.exports = {
    defaultFixture
}