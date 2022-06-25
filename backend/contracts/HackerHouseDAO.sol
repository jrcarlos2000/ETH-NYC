// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract HackerHouseDAO {
    using Counters for Counters.Counter;

    address public parentAddress;
    uint256 id;
    string public name;
    string public descriptionURI;
    address[] public coreTeam;
    uint256 public membershipPrice;
    bool public initialized = false;

    struct member {
        uint256 id;
        address memberAddr;
        bool isMember;
    }

    function initialize(
        address _parentAddress,
        uint256 _id,
        address[] memory _coreTeam,
        string memory _name,
        string memory _descriptionURI
    ) external {
        require(initialized == false, "Already initialized");
        initialized = true;
        parentAddress = _parentAddress;
        id = _id;
        coreTeam = _coreTeam;
        name = _name;
        descriptionURI = _descriptionURI;
    }
}