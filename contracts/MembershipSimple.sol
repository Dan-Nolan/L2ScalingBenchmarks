//SPDX-License-Identifier: Unlicense
pragma solidity ^0.6.8;

import "@openzeppelin/contracts/access/Ownable.sol";

contract MembershipSimple is Ownable {
    mapping(address => bool) members;

    string public message;

    function register(address _addr) public onlyOwner {
        members[_addr] = true;
    }

    function isMember(address _addr) public view returns(bool) {
        return members[_addr];
    }

    function changeMessage(string memory _message) public {
        require(isMember(msg.sender));
        message = _message;
    }
}
