const { ethers } = require("hardhat");
const hre = require("hardhat");

async function defaultFixture() {
    await deployments.fixture();
    // const dummyToken = await ethers.getContract('DummyToken');
    const NomadicVault = await ethers.getContract('NomadicVault');
    
    return {
        // dummyToken,
        NomadicVault
    }
}

module.exports = {
    defaultFixture
}