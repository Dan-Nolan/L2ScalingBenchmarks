const { assert } = require("chai");

describe("MembershipSimple", function() {
  let addresses;
  beforeEach(async () => {
    addresses = await ethers.provider.listAccounts();

    const MembershipSimple = await ethers.getContractFactory("MembershipSimple");
    contract = await MembershipSimple.deploy();

    await contract.deployed();
    await contract.register(addresses[1]);
  });

  it('should recognize a member', async () => {
    assert( await contract.isMember(addresses[1]) );
  });

  it('should allow a member to change the message', async () => {
    const message = "Hello World!";
    await contract.connect(ethers.provider.getSigner(1)).changeMessage(message);
    const newMessage = await contract.message();
    assert.equal(message, newMessage);
  });

  it('should not recognize a non-member', async () => {
    assert(! (await contract.isMember(addresses[2])) );
  });

  it('should not allow a member to change the message', async () => {
    let ex;
    try {
      await contract.connect(ethers.provider.getSigner(2)).changeMessage("Hi");
    }
    catch(_ex) {
      ex = _ex;
    }
    assert(ex);
  });
});
