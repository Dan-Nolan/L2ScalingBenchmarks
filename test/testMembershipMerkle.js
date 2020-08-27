const { assert } = require("chai");
const { utils: { solidityPack, solidityKeccak256 }} = require('ethers');
const { keccakFromString, bufferToHex } = require('ethereumjs-util');
const MerkleTree = require('../helpers/MerkleTree');

describe("MembershipMerkle", function() {
  let merkleTree;
  let addresses;
  let contract;
  beforeEach(async () => {
    addresses = await ethers.provider.listAccounts();
    merkleTree = new MerkleTree(addresses.slice(0, 3));

    const MembershipMerkle = await ethers.getContractFactory("MembershipMerkle");
    contract = await MembershipMerkle.deploy();
    await contract.deployed();
    await contract.commit(merkleTree.getHexRoot());
  });

  it('should work for each address registered', async () => {
    for(let i = 0; i < 3; i++) {
      const address = addresses[i];
      const proof = merkleTree.getHexProof(address);
      const isMember = await contract.connect(address).isMember(proof, merkleTree.getHexRoot());
      assert(isMember);
    }
  });

  it('should not work for invalid proofs', async () => {
    const proof = merkleTree.getHexProof(addresses[1]);
    const isMember = await contract.connect(addresses[0]).isMember(proof, merkleTree.getHexRoot());
    assert(!isMember);
  });

  it('should not work for valid proof, unregistered sender', async () => {
    const proof = merkleTree.getHexProof(addresses[0]);
    const isMember = await contract.connect(addresses[4]).isMember(proof, merkleTree.getHexRoot());
    assert(!isMember);
  });
});
