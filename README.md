# Installation

This project is built using [Buidler](https://buidler.dev/) 👷‍♀️👷‍♂️

To get started, clone the repository and then install all the dependencies using `npm install`.

## Contracts

In this repository, there are three contracts.

Each contract keeps a record of registered members in a different way. The registered members are allowed to change the `message` in the smart contract if they can prove they are registered.

Here are the three approaches:

- **MembershipSimple** - The simplest approach to doing membership, keeping a `mapping` of an `address` to a `bool`. If `true` is stored associated with the account, they are registered. Each member needs to be registered separately, requiring that a new transaction is created for each member.
- **MembershipCommit** - This approach allows us to take a list of new members, hash their addresses together and then commit the hash as a single representation of all the new members. This means we can commit many new registrations in one transaction. The proof requires a member to push up the entire preimage (a series of bytes) so that it can be proven they were part of that registration.
- **MembershipMerkle** - This extends up on the Commit approach by committing a **Merkle Root** to the contract rather than the hash of the entire list. When a member needs to prove their registration they can provide a **Merkle Proof** which has significant gas cost savings over the list approach as we scale.

## Benchmarking

There are three benchmarking tasks built into the configuration:

- `benchmarkSimple` - Runs the `MembershipSimple` benchmark
- `benchmarkCommit` - Runs the `MembershipCommit` benchmark
- `benchmarkMerkle` - Runs the `MembershipMerkle` benchmark

Each of these benchmark tasks take an `accounts` parameter that will specify how many accounts you want to run the benchmark with.

Example usage:

```
npx buidler benchmarkMerkle --accounts 1000
```

This will run the `MembershipMerkle` contract, registering `1000` accounts and will display the total gas required to register those accounts and change the message as one of the members.

## Testing

You can run all tests in the suite with buidler, by running `npx buidler test`
