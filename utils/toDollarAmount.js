const { ethers: { BigNumber, utils: { formatEther } }} = require('ethers');

// hardcoding average gas to be 100 gwei, its around the going rate at the moment
const GAS_PRICE = BigNumber.from(100n);
const GWEI = BigNumber.from(10n ** 9n);
// hardcoding average ether price to $400
const ETHER_PRICE = BigNumber.from(400);

function toDollarAmount(gas) {
  return formatEther(gas.mul(GAS_PRICE).mul(GWEI).mul(ETHER_PRICE));
}

module.exports = {
  gasPrice: GAS_PRICE.toString(),
  etherPrice: ETHER_PRICE.toString(),
  calculate: toDollarAmount
};
