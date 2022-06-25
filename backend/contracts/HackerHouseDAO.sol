// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract HackerHouseDAO {
    using Counters for Counters.Counter;

    address public parentAddress;
    uint256 id;
    Counters.Counter public userId;
    string public name;
    string public descriptionURI;
    address[] public coreTeam;
    uint256 public membershipPrice;
    bool public initialized = false;
    mapping (address => User) public users;
    address[] userAddresses;

    struct User {
        uint256 id;
        bool exists;
        address userAddr;
        bool isMember;
        address[] approvers;
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

    function applyForMembership() external {
        require(!users[msg.sender].isMember, "already a member or applicants");
        uint256 _memId = userId.current();
        address[] memory _approvers;
        User memory _user = User({
            id: _memId,
            exists: true,
            userAddr: address(msg.sender),
            isMember: false,
            approvers: _approvers
        });
        users[msg.sender] = _user;
        userAddresses.push(msg.sender);
        userId.increment();
    }

    function fetchAllApplicants() public view returns (User[] memory applicantsArr) {
        uint256 usersLen = userAddresses.length;
        uint256 applicantsCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < usersLen; i++) {
            if (!users[userAddresses[i]].isMember) {
                applicantsCount++;
            }
        }
        User[] memory applicantsArr = new User[](applicantsCount);
        for (uint256 i = 0; i < usersLen; i++) {
            if (!users[userAddresses[i]].isMember) {
                applicantsArr[currentIndex] = (users[userAddresses[i]]);
                currentIndex++;
            }
        }
    }
}