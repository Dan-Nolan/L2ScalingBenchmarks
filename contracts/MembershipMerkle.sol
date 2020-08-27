//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/cryptography/MerkleProof.sol";

contract MembershipMerkle is Ownable {
    mapping(bytes32 => bool) committments;

    string public message;

    function commit(bytes32 _hash) public onlyOwner {
        committments[_hash] = true;
    }

    function isMember(bytes32[] memory proof, bytes32 root) public view returns(bool) {
        require(committments[root]);
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        return MerkleProof.verify(proof, root, leaf);
    }

    function changeMessage(string memory _message, bytes32[] memory proof, bytes32 root) public {
        require(isMember(proof, root));
        message = _message;
    }
}
