// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./HackerHouseDAO.sol";
import "hardhat/console.sol";

contract NomadicVault {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    struct ShortStay {
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

    struct HackerHouse {
        uint256 id;
        address addr;
        bool isActive;
        address[] coreTeam;
        uint256 coreTeamCount;
        string name;
        string descriptionURI;
    }

    mapping (uint256 => ShortStay) public stays;
    mapping (uint256 => HackerHouse) public hhouses;

    address public owner;
    address public hhTemplate;
    address[] public hhAddresses;
    uint256 public numOfCoreTeam = 5;
    Counters.Counter public stayId;
    Counters.Counter public daoId;

    event ProposeStay(uint256 _stayId, address _trustee);
    event JoinStay(uint256 _stayId, address _newMember);
    event StayIsFull(uint256 _stayId);
    event DAOProposed(uint256 _daoId);
    event HHouseDeployed(uint256 _daoId, address _daoAddress, string _daoName);

    constructor(address _hhTemplate) {
        owner = msg.sender;
        hhTemplate = _hhTemplate;
    }

    modifier onlyActiveShortStay(uint256 _stayId) {
        require(stays[_stayId].isActive && !stays[_stayId].isFull && stays[_stayId].deadline > block.timestamp, "Stay is full, inactive or deadline was reached");
        _;
    }

    function proposeShortStay(
        string memory _descriptionURI,
        uint256 _nPersons,
        uint256 _totalPrice,
        uint256 _timeAvailable,
        bool _isCreatorSlot
    ) external returns (uint256) {
        require(_nPersons > 0, "At least one room required");
        uint256 _stayId = stayId.current(); 
        uint256 _slotsReserved = _isCreatorSlot ? 1 : 0;
        address[] memory _members = new address[](_nPersons);

        if (_isCreatorSlot) {
            _members[0] = msg.sender;
        }

        stays[_stayId] = ShortStay({
            id: _stayId,
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
        stayId.increment();
        emit ProposeStay(_stayId, msg.sender);
        return _stayId;
    }

    function joinShortStay(
        uint256 _stayId
    ) external payable onlyActiveShortStay(_stayId) {
        ShortStay storage _stay = stays[_stayId];
        require(msg.value >= _stay.pricePerPerson, "Insufficient value sent");
        bool isMember = false;
        // make sure that the sender is not already a member of the stay
        uint256 i = 0;
        uint256 memLen = _stay.nPersons;
        for (i; i < memLen; i++) {
            if (_stay.members[i] == msg.sender) {
                isMember = true;
                break;
            }
        }
        require(!isMember, "You are already signed up");
        _stay.members.push(msg.sender);
        _stay.slotsReserved++;
        _stay.amountFunded += _stay.pricePerPerson;
        emit JoinStay(_stayId, msg.sender);

        if (_stay.slotsReserved >= _stay.nPersons) {
            _stay.isFull = true;
            emit StayIsFull(_stayId);
        }
    }

    function getShortStays(uint256[] memory _stayIndexes) public view returns(ShortStay[] memory) {
        uint256 returnStaysLen = _stayIndexes.length;
        ShortStay[] memory returnStays = new ShortStay[](returnStaysLen);

        uint256 stayLen = _stayIndexes.length;
        uint256 i = 0;
        for (i; i < stayLen; i++) {
            returnStays[i] = stays[_stayIndexes[i]];
        }
        return returnStays;
    }

    function checkDeadlines() external {
        uint256 stayLen = stayId.current(); 
        uint256 i = 0;
        for(i;i<stayLen;i++){
            checkSingleDeadline(i);
        }
    }

    function checkSingleDeadline(uint256 id) internal {
        if(stays[id].deadline < block.timestamp){
            stays[id].isActive = false;
        }
    }

    function proposeDAO(string memory _name, string memory _descriptionURI, uint256 _membershipCost) external {
        uint256 _daoId = daoId.current();
        address[] memory _coreTeam = new address[](numOfCoreTeam);
        _coreTeam[0] = address(msg.sender);

        hhouses[_daoId] = HackerHouse({
            id: _daoId,
            addr: address(0),
            isActive: false,
            coreTeam: _coreTeam,
            coreTeamCount: 1,
            name: _name,
            descriptionURI: _descriptionURI
        });
        emit DAOProposed(_daoId);

        daoId.increment();

    }

    function getActiveDAOs() public view returns (HackerHouse[] memory) {
        uint256 count = daoId.current();
        uint256 activeCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < count; i++) {
            if (hhouses[i].isActive) {
                activeCount++;
            }
        }
        HackerHouse[] memory activeHH = new HackerHouse[](activeCount);
        for (uint256 i = 0; i < activeCount; i++) {
            if (hhouses[i].isActive) {
                activeHH[currentIndex] = hhouses[i];
                currentIndex++;
            }
        }
        return activeHH;
    }

    function getFormingDAOs() public view returns (HackerHouse[] memory) {
        uint256 count = daoId.current();
        uint256 formingCount = 0;
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < count; i++) {
            if (!hhouses[i].isActive) {
                formingCount++;
            }
        }
        HackerHouse[] memory formingHH = new HackerHouse[](formingCount);
        for (uint256 i = 0; i < formingCount; i++) {
            if (!hhouses[i].isActive) {
                formingHH[currentIndex] = hhouses[i];
                currentIndex++;
            }
        }
        return formingHH;
    }

    function joinCoreTeam(uint256 _daoId) external {
        require(!hhouses[_daoId].isActive, "dao is already active");
        hhouses[_daoId].coreTeam[hhouses[_daoId].coreTeamCount] = address(msg.sender);
        hhouses[_daoId].coreTeamCount++;
        if (hhouses[_daoId].coreTeamCount >= numOfCoreTeam) {
            hhouses[_daoId].isActive = true;
            _deployHHouse(_daoId);
        }
        console.log("joinCoreTeam daoId: %s hhouses[_daoId].coreTeam.length %s", _daoId, hhouses[_daoId].coreTeam.length);
    }

    function _deployHHouse(uint256 _daoId) internal {
        HackerHouseDAO hhDao = HackerHouseDAO(_createClone(hhTemplate));

        hhDao.initialize(address(this), _daoId, hhouses[_daoId].coreTeam, hhouses[_daoId].name, hhouses[_daoId].descriptionURI);
        hhouses[_daoId].addr = address(hhDao);
        hhAddresses.push(address(hhDao));
        console.log("deployed %s", address(hhDao));

        emit HHouseDeployed(_daoId, address(hhDao), hhouses[_daoId].name);
    }

    function _createClone(address target) internal returns (address result) {
        bytes20 targetBytes = bytes20(target);
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            result := create(0, clone, 0x37)
        }
    }
}