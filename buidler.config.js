const benchmarkMembershipCommit = require("./utils/benchmarkMembershipCommit");
const benchmarkMembershipSimple = require("./utils/benchmarkMembershipSimple");
const benchmarkMembershipMerkle = require("./utils/benchmarkMembershipMerkle");
usePlugin("@nomiclabs/buidler-waffle");

task("benchmarkSimple", "Benchmark the MembershipSimple Contract")
  .addParam("accounts", "The number of accounts to use for membership")
  .setAction(async ({ accounts }, bre) => {
    await benchmarkMembershipSimple(bre, accounts);
  });

task("benchmarkCommit", "Benchmark the MembershipCommit Contract")
  .addParam("accounts", "The number of accounts to use for membership")
  .setAction(async ({ accounts }, bre) => {
    await benchmarkMembershipCommit(bre, accounts);
  });

task("benchmarkMerkle", "Benchmark the MembershipMerkle Contract")
  .addParam("accounts", "The number of accounts to use for membership")
  .setAction(async ({ accounts }, bre) => {
    await benchmarkMembershipMerkle(bre, accounts);
  });

module.exports = {
  solc: {
    version: "0.6.8",
  }
};
