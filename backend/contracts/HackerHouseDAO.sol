// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";

contract HackerHouseDAO {
    using Counters for Counters.Counter;

    address public parentAddress;
    uint256 id;
    Counters.Counter public userId;
    Counters.Counter public cohortId;
    string public name;
    string public descriptionURI;
    address[] public coreTeam;
    uint256 public membershipPrice;
    bool public initialized = false;
    mapping (address => User) public users;
    address[] userAddresses;

    event ProposeCohort(uint256 _cohortId, address _trustee);
    event JoinCohort(uint256 _cohortId, address _member);
    event CohortIsFull(uint256 _cohortId);

    struct Cohort {
        uint256 id;
        string descriptionURI;
        address trustee;
        uint256 nPersons;
        uint256 slotsReserved;
        uint256 amountFunded;
        address[] members;
        uint256 totalPrice;
        uint256 pricePerPerson;
        uint256 deadline;
        bool isCreatorSlot; // true if creator of short stay is one of the persons staying (nPersons)
        bool isActive; // if stay is currently open for booking
        bool isFull; // if all member slots are filled or not
    }

    struct User {
        uint256 id;
        bool exists;
        address userAddr;
        bool isMember;
        address[] approvers;
    }

    mapping(uint256 => Cohort) public cohorts;

    modifier onlyCoreTeam() {
        bool isCoreTeam = false;
        for (uint256 i = 0; i < coreTeam.length; i++) {
            if (msg.sender == coreTeam[i]) {
                isCoreTeam = true;
            }
        }
        require(isCoreTeam, "Only core team");
        _;
    }

    modifier onlyMemberActiveCohort(uint256 _cohortId) {
        require(users[msg.sender].isMember, "Restricted to members");
        require(
            cohorts[_cohortId].isActive
                && !cohorts[_cohortId].isFull
                && cohorts[_cohortId].deadline > block.timestamp,
            "Cohort is full, inactive or deadline was reached"
        );
        _;
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

    function approveApplicants(address[] memory _applicants) external onlyCoreTeam() {
        uint256 appsLen = _applicants.length;
        for (uint256 i = 0; i < appsLen; i++) {
            User storage _user = users[_applicants[i]];
            uint256 approversLen = _user.approvers.length;
            for (uint256 i = 0; i < approversLen; i++) {
                require(_user.approvers[i] != msg.sender, "sender already approved applicant");
            }
        }
        for (uint256 i = 0; i < appsLen; i++) {
            User storage _user = users[_applicants[i]];
            _user.approvers.push(msg.sender);
        }
    }

    function proposeCohort(
        string memory _descriptionURI,
        uint256 _nPersons,
        uint256 _totalPrice,
        uint256 _timeAvailable,
        bool _isCreatorSlot
    ) external returns (uint256) {
        require(_nPersons > 0, "At least one room required");
        uint256 _cohortId = cohortId.current(); 
        uint256 _slotsReserved = _isCreatorSlot ? 1 : 0;
        address[] memory _members = new address[](_nPersons);

        if (_isCreatorSlot) {
            _members[0] = msg.sender;
        }

        cohorts[_cohortId] = Cohort({
            id: _cohortId,
            descriptionURI: _descriptionURI,
            trustee: msg.sender,
            nPersons: _nPersons,
            slotsReserved: _slotsReserved,
            amountFunded: 0,
            members: _members,
            totalPrice: _totalPrice,
            pricePerPerson: (_totalPrice / _nPersons ) + 1,
            deadline: block.timestamp + _timeAvailable,
            isCreatorSlot: _isCreatorSlot,
            isActive: true,
            isFull: false
        });
        cohortId.increment();
        emit ProposeCohort(_cohortId, msg.sender);
        return _cohortId;
    }

    function joinCohort(
        uint256 _cohortId
    ) external payable onlyMemberActiveCohort(_cohortId) {
        Cohort storage _cohort = cohorts[_cohortId];
        require(msg.value >= _cohort.pricePerPerson, "Insufficient value sent");
        bool isMember = false;
        // check sender is not already a member of cohort
        uint256 i = 0;
        uint256 memLen = _cohort.nPersons;
        for (i; i < memLen; i++) {
            if (_cohort.members[i] == msg.sender) {
                isMember = true;
                break;
            }
        }
        require(!isMember, "You are already signed up!");
        _cohort.members.push(msg.sender);
        _cohort.slotsReserved++;
        _cohort.amountFunded+= _cohort.pricePerPerson;
        emit JoinCohort(_cohortId, msg.sender);

        if (_cohort.slotsReserved >= _cohort.nPersons) {
            _cohort.isFull = true;
            // send $ funds to trustee
            payable(address(_cohort.trustee)).transfer(_cohort.amountFunded);
            // todo: Add badge to soulbound NFT

            emit CohortIsFull(_cohortId);
        }
    }

    function getCohorts() external returns(Cohort[] memory) {
        Cohort[] memory cohortsArr = new Cohort[](cohortId.current());
        for (uint256 i = 0; i < cohortId.current(); i++) {
            cohortsArr[i] = cohorts[i];
        }
        return cohortsArr;
    }
}