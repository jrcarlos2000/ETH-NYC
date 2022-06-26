const { expect } = require("chai");
const { ethers } = require("hardhat");
const {defaultFixture} = require('./_fixture');
const {loadFixture} = require('../utils/helpers');
const { parseUnits, hexStripZeros } = require("ethers/lib/utils");

const proposedDAOs = [
  [
    'Hacker House DAO 1',
    'some ipfs URI',
    100
  ],
  [
    'Hacker House DAO 2',
    'some ipfs URI',
    100
  ],
  [
    'Hacker House DAO 3',
    'some ipfs URI',
    100
  ]
]

describe("Nomadic", async () => {
  describe("Vault", async ()=>{
    it("can create and keep track of stay ids", async () => {
      const { NomadicVault } = await loadFixture(defaultFixture);
      const signers = await ethers.getSigners();
      const signer1 = signers[0];
      const signer2 = signers[1];

      const stays = [
        [
          '0000001',
          3,
         200000000000,
         15000,
          false
        ],
        [
          '0000002',
          3,
         200000000000,
         12000,
          false
        ],
        [
          '0000003',
          3,
         200000000000,
         20000,
         false
        ],
        [
          '0000004',
          3,
         200000000000,
         30000,
         false
        ],
        [
          '0000005',
          7,
         200000000000,
         45000,
         false
        ]
      ]

      console.log('done')

      for ( let i = 0; i < stays.length ; i++){
        const stayId = await NomadicVault.connect(signer1)['proposeShortStay'](...stays[i]);
        // console.log(stayId);
        const currID = await NomadicVault['stays'](i);
      }
    
    });
    it("can join a expired short stay within deadline", async () => {
      const { NomadicVault } = await loadFixture(defaultFixture);
      const signers = await ethers.getSigners();
      const signer1 = signers[0];
      const signer2 = signers[1];

      const stay =
        [
          '0000003',
          3,
         300000000000,
         20000,
         false
        ]
      const stayId = await NomadicVault.connect(signer1)['proposeShortStay'](...stay); 
      await ethers.provider.send("evm_increaseTime", [2001]);
      // await NomadicVault.connect(signer1)['joinShortStay'](0,{value : 100000000001}); 
      await NomadicVault.connect(signer1)['joinShortStay'](0,{value : 100000000001});
    });

    it("cannot join a expired short stay after deadline", async () => {
      const { NomadicVault } = await loadFixture(defaultFixture);
      const signers = await ethers.getSigners();
      const signer1 = signers[0];
      const signer2 = signers[1];

      const stay =
        [
          '0000003',
          3,
         300000000000,
         20000,
         false
        ]
      const stayId = await NomadicVault.connect(signer1)['proposeShortStay'](...stay); 
      await ethers.provider.send("evm_increaseTime", [20001]);
      // await NomadicVault.connect(signer1)['joinShortStay'](0,{value : 100000000001}); 
      await expect(NomadicVault.connect(signer1)['joinShortStay'](0,{value : 100000000001}))
      .to.be.revertedWith('Stay is full, inactive or deadline was reached');
    });
    it("can create and keep track of stay ids", async () => {
      const { NomadicVault } = await loadFixture(defaultFixture);
      const signers = await ethers.getSigners();
      const signer1 = signers[0];
      const signer2 = signers[1];

      const stays = [
        [
          '0000001',
          3,
         200000000000,
         1500000,
          false
        ],
        [
          '0000002',
          3,
         200000000000,
         1600000,
          false
        ],
        [
          '0000003',
          3,
         200000000000,
         1700000,
         false
        ],
        [
          '0000004',
          3,
         200000000000,
         1800000,
         false
        ],
        [
          '0000005',
          7,
         200000000000,
         1900000,
         false
        ]
      ]

      for ( let i = 0; i < stays.length ; i++){
        const stayId = await NomadicVault.connect(signer1)['proposeShortStay'](...stays[i]);
      }

      await ethers.provider.send("evm_increaseTime", [1600000]);

      await NomadicVault['checkDeadlines']();

      const stay0 = await NomadicVault['stays'](0);
      expect(stay0.isActive.toString()).to.equal('false');
      const stay1 = await NomadicVault['stays'](1);
      expect(stay1.isActive.toString()).to.equal('false');
      const stay2 = await NomadicVault['stays'](2);
      expect(stay2.isActive.toString()).to.equal('true');
    });

    it("can propose a dao ", async () => {
      const { NomadicVault } = await loadFixture(defaultFixture);
      const signers = await ethers.getSigners();
      const signer1 = signers[0];
      
      for (let i = 0; i < proposedDAOs.length; i++) {
        await NomadicVault.connect(signer1)['proposeDAO'](...proposedDAOs[i]);
      }

      const dao0 = await NomadicVault.connect(signer1)['getFormingDAOs']();
      expect(dao0.length).to.equal(proposedDAOs.length);
    })

    it("can join a DAO", async () => {
      const { NomadicVault } = await loadFixture(defaultFixture);
      const signers = await ethers.getSigners();
      const signer1 = signers[0];
      const signer2 = signers[1];
      
      await NomadicVault.connect(signer1)['proposeDAO'](...proposedDAOs[0]);

      await NomadicVault.connect(signer2)['joinCoreTeam'](0);

      const dao0 = await NomadicVault.connect(signer1)['getFormingDAOs']();
      expect(dao0[0].coreTeamCount.toNumber()).to.equal(2);
    })

    it("can activate a DAO after 5 members join", async () => {
      const { NomadicVault } = await loadFixture(defaultFixture);
      const signers = await ethers.getSigners();
      const signer1 = signers[0];
      const signer2 = signers[1];
      const signer3 = signers[2];
      const signer4 = signers[3];
      const signer5 = signers[4];
      
      for (let i = 0; i < proposedDAOs.length; i++) {
        await NomadicVault.connect(signer1)['proposeDAO'](...proposedDAOs[i]);
      }

      await NomadicVault.connect(signer2)['joinCoreTeam'](0);
      await NomadicVault.connect(signer3)['joinCoreTeam'](0);
      await NomadicVault.connect(signer4)['joinCoreTeam'](0);
      await NomadicVault.connect(signer5)['joinCoreTeam'](0);

      const dao0 = await NomadicVault.connect(signer1)['getActiveDAOs']();
      expect(dao0.length).to.equal(1);
    })
  })
});
