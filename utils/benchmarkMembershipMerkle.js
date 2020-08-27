const MerkleTree = require('../helpers/MerkleTree');

async function benchmark({ ethers }, numAccounts) {
    const { utils: { solidityPack, solidityKeccak256 }} = ethers;
    const addresses = await ethers.provider.listAccounts();
    const members = [addresses[0]];
    for(let i = 0; i < numAccounts - 1; i++) {
      members.push(ethers.Wallet.createRandom().address);
    }
    const merkleTree = new MerkleTree(members);
    const Membership = await ethers.getContractFactory("MembershipMerkle");
    const contract = await Membership.deploy();
    await contract.deployed();
    const receipt1 = await contract.deployTransaction.wait();

    const tx2 = await contract.commit(merkleTree.getHexRoot());
    const receipt2 = await tx2.wait();

    const proof = merkleTree.getHexProof(addresses[0]);
    const tx3 = await contract.connect(ethers.provider.getSigner(0)).changeMessage("Hello World", proof, merkleTree.getHexRoot());
    const receipt3 = await tx3.wait();

    const gas1 = receipt1.cumulativeGasUsed;
    const gas2 = receipt2.cumulativeGasUsed;
    const gas3 = receipt3.cumulativeGasUsed;

    console.log({
      gas1: gas1.toString(),
      gas2: gas2.toString(),
      gas3: gas3.toString(),
      totalGas: gas1.add(gas2).add(gas3).toString()
    });
}

module.exports = benchmark;
