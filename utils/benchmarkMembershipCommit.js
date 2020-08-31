const logCosts = require('./logCosts');

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
    const types = new Array(members.length).fill("address");
    const hash = solidityKeccak256(types, members);

    const Membership = await ethers.getContractFactory("MembershipCommit");
    const contract = await Membership.deploy();
    await contract.deployed();
    const receipt1 = await contract.deployTransaction.wait();

    const tx2 = await contract.commit(hash);
    const receipt2 = await tx2.wait();

    let gas3Cumulative = ethers.constants.Zero;
    const numTransactions = Math.min(numAccounts, addresses.length);
    for(let i = 0; i < numTransactions; i++) {
        const before = members.slice(0, i);
        const after = members.slice(i + 1);
        const typesBefore = new Array(before.length).fill("address");
        const bytesBefore = solidityPack(typesBefore, before);
        const typesAfter = new Array(after.length).fill("address");
        const bytesAfter = solidityPack(typesAfter, after);
        const signer = ethers.provider.getSigner(i);
        const changeTx = await contract.connect(signer).changeMessage(`message-${i}`, bytesBefore, bytesAfter);
        const changeReceipt = await changeTx.wait();
        gas3Cumulative = gas3Cumulative.add(changeReceipt.cumulativeGasUsed);
    }
    const gas3 = gas3Cumulative.div(numTransactions);

    const gas1 = receipt1.cumulativeGasUsed;
    const gas2 = receipt2.cumulativeGasUsed;

    logCosts(gas1, gas2, gas3);
}

module.exports = benchmark;
