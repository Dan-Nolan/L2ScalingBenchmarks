const { calculate, etherPrice, gasPrice } = require('./toDollarAmount');

function logCosts(deploymentGas, registrationGas, proofGas) {
  console.log(`
    Costs In Gas
    ============
    Deployment Cost: ${deploymentGas.toString()}
    Total Registration Cost: ${registrationGas.toString()}
    Average Proof & Update Cost: ${proofGas.toString()}
  `);

  console.log(`
    Costs in USD (@ $${etherPrice} ETH and ${gasPrice} Gwei Gas Price)
    ================================================
    Deployment Cost: $${calculate(deploymentGas)}
    Total Registration Cost: $${calculate(registrationGas)}
    Average Proof & Update Cost: $${calculate(proofGas)}
  `);
}

module.exports = logCosts;
