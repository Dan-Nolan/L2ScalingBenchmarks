//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MembershipCommit is Ownable {
    mapping(bytes32 => bool) commitments;

    string public message;

    function commit(bytes32 _hash) public onlyOwner {
        commitments[_hash] = true;
    }

    function isMember(bytes memory _before, address _addr, bytes memory _after) public view returns(bool) {
        require(_before.length % 20 == 0);
        require(_after.length % 20 == 0);
        bytes32 _hash = keccak256(abi.encodePacked(_before, _addr, _after));
        return commitments[_hash];
    }

    function changeMessage(string memory _message, bytes memory _before, bytes memory _after) public {
      require(isMember(_before, msg.sender, _after));
      message = _message;
    }
}
