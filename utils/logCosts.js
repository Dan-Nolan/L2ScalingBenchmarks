const { calculate, etherPrice, gasPrice } = require('./toDollarAmount');

function logCosts(deploymentGas, registrationGas, proofGas) {
  console.log(`
    Costs In Gas
    ============
    Deployment Costs: ${deploymentGas.toString()}
    Registration Costs: ${registrationGas.toString()}
    Proof/Update Costs: ${proofGas.toString()}
    Total Costs: ${deploymentGas.add(registrationGas).add(proofGas).toString()}
  `);

  console.log(`
    Costs in USD (@ $${etherPrice} ETH and ${gasPrice} Gwei Gas Price)
    ================================================
    Deployment Costs: $${calculate(deploymentGas)}
    Registration Costs: $${calculate(registrationGas)}
    Proof/Update Costs: $${calculate(proofGas)}
    Total Costs: $${calculate(deploymentGas.add(registrationGas).add(proofGas))}
  `);
}

module.exports = logCosts;
