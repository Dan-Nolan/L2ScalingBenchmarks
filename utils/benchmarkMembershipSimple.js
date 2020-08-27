const logCosts = require('./logCosts');

async function benchmark({ ethers }, numAccounts) {
    const { utils: { solidityPack, solidityKeccak256 }} = ethers;
    const addresses = await ethers.provider.listAccounts();

    const Membership = await ethers.getContractFactory("MembershipSimple");
    const contract = await Membership.deploy();
    await contract.deployed();
    const receipt1 = await contract.deployTransaction.wait();
    const gas1 = receipt1.cumulativeGasUsed;

    let gas2 = ethers.constants.Zero;
    const tx = await contract.register(addresses[0]);
    gas2 = gas2.add((await tx.wait()).cumulativeGasUsed);
    for(let i = 0; i < numAccounts - 1; i++) {
        const wallet = ethers.Wallet.createRandom();
        const tx2 = await contract.register(wallet.address);
        gas2 = gas2.add((await tx2.wait()).cumulativeGasUsed);
    }

    const tx3 = await contract.changeMessage("yippee");
    const receipt3 = await tx3.wait();
    const gas3 = receipt3.cumulativeGasUsed;

    logCosts(gas1, gas2, gas3);
}

module.exports = benchmark;
