const logCosts = require('./logCosts');
const MerkleTree = require('./MerkleTree');

async function benchmark({ ethers }, numAccounts) {
    const { utils: { solidityPack, solidityKeccak256 }} = ethers;
    const addresses = await ethers.provider.listAccounts();
    const members = [addresses[0]];
    for(let i = members.length; i < addresses.length && i < numAccounts; i++) {
        members.push(addresses[i]);
    }
    for(let i = members.length; i < numAccounts; i++) {
        members.push(ethers.Wallet.createRandom().address);
    }
    const merkleTree = new MerkleTree(members);
    const Membership = await ethers.getContractFactory("MembershipMerkle");
    const contract = await Membership.deploy();
    await contract.deployed();
    const receipt1 = await contract.deployTransaction.wait();

    const tx2 = await contract.commit(merkleTree.getHexRoot());
    const receipt2 = await tx2.wait();

    // set the message before calculating the average
    // initial sstore costs more and can be a skewed data point
    const proof = merkleTree.getHexProof(addresses[0]);
    await contract.changeMessage("first", proof, merkleTree.getHexRoot())

    let gas3Cumulative = ethers.constants.Zero;
    const numTransactions = Math.min(numAccounts, addresses.length);
    for(let i = 0; i < numTransactions; i++) {
        const proof = merkleTree.getHexProof(addresses[i]);
        const changeTx = await contract.connect(ethers.provider.getSigner(i)).changeMessage(`merkle-${i}`, proof, merkleTree.getHexRoot());
        const changeReceipt = await changeTx.wait();
        gas3Cumulative = gas3Cumulative.add(changeReceipt.cumulativeGasUsed);
    }
    const gas3 = gas3Cumulative.div(numTransactions);

    const gas1 = receipt1.cumulativeGasUsed;
    const gas2 = receipt2.cumulativeGasUsed;

    logCosts(gas1, gas2, gas3);
}

module.exports = benchmark;
