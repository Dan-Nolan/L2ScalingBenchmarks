const { assert } = require("chai");
const { utils: { solidityPack, solidityKeccak256 }} = require('ethers');

describe("MembershipCommit", function() {
  let addresses;
  beforeEach(async () => {
    addresses = await ethers.provider.listAccounts();
  });

  describe('for 3 members', () => {
    let contract;
    beforeEach(async () => {
      const members = addresses.slice(0, 3);
      const types = new Array(members.length).fill("address");
      const hash = solidityKeccak256(types, members);

      const MembershipCommit = await ethers.getContractFactory("MembershipCommit");
      contract = await MembershipCommit.deploy();
      await contract.deployed();
      await contract.commit(hash);
    });

    describe('for the first valid address', () => {
      it('should be certified', async () => {
        const otherAddresses = addresses.slice(1, 3);
        const types = new Array(otherAddresses.length).fill("address");
        const bytes = solidityPack(types, otherAddresses);
        const isMember = await contract.isMember("0x", addresses[0], bytes);
        assert(isMember);
      });

      it('should allow them to change the message', async () => {
        const otherAddresses = addresses.slice(1, 3);
        const types = new Array(otherAddresses.length).fill("address");
        const bytes = solidityPack(types, otherAddresses);

        const message = "Hello World";
        const tx = await contract.changeMessage(message, "0x", bytes);
        const receipt = await tx.wait();
        const newMessage = await contract.message();
        assert(message, newMessage);
      });
    });

    describe('for the second valid address', () => {
      it('should be certified', async () => {
        const beforeBytes = solidityPack(['address'], [addresses[0]]);
        const afterBytes = solidityPack(['address'], [addresses[2]]);
        const isMember = await contract.isMember(beforeBytes, addresses[1], afterBytes);
        assert(isMember);
      });

      it('should allow them to change the message', async () => {
        const beforeBytes = solidityPack(['address'], [addresses[0]]);
        const afterBytes = solidityPack(['address'], [addresses[2]]);
        const isMember = await contract.isMember(beforeBytes, addresses[1], afterBytes);
        assert(isMember);
      });
    });
  });

  describe('for 10 members', () => {
    let contract;
    let members = [];
    beforeEach(async () => {
      members.push(addresses[0]);
      for(let i = 0; i < 9; i++) {
        members.push(ethers.Wallet.createRandom().address);
      }

      const types = new Array(members.length).fill("address");
      const hash = solidityKeccak256(types, members);

      const MembershipCommit = await ethers.getContractFactory("MembershipCommit");
      contract = await MembershipCommit.deploy();
      await contract.deployed();
      await contract.commit(hash);
    });

    describe('for the first valid address', () => {
      it('should be certified', async () => {
        const otherAddresses = members.slice(1);
        const types = new Array(otherAddresses.length).fill("address");
        const bytes = solidityPack(types, otherAddresses);
        const isMember = await contract.isMember("0x", addresses[0], bytes);
        assert(isMember);
      });

      it('should allow them to change the message', async () => {
        const otherAddresses = members.slice(1);
        const types = new Array(otherAddresses.length).fill("address");
        const bytes = solidityPack(types, otherAddresses);

        const message = "Hello World";
        const tx = await contract.changeMessage(message, "0x", bytes);
        const receipt = await tx.wait();
        const newMessage = await contract.message();
        assert(message, newMessage);
      });
    });
  });
});
