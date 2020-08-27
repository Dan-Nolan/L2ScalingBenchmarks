const { ethers: { BigNumber, utils: { formatEther } }} = require('ethers');

// hardcoding average gas to be 100 gwei, its around the going rate at the moment
const AVERAGE_GAS_PRICE = BigNumber.from(100n * (10n ** 9n));
// hardcoding average ether price to $400
const ETHER_PRICE = BigNumber.from(400);

function toDollarAmount(gas) {
  return formatEther(gas.mul(AVERAGE_GAS_PRICE).mul(ETHER_PRICE));
}

module.exports = toDollarAmount;
