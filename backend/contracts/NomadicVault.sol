// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

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

    mapping (uint256 => ShortStay) public stays ; 
    address public owner;
    Counters.Counter public stayId;

    event ProposeStay(uint256 _stayId, address _trustee);
    event JoinStay(uint256 _stayId, address _newMember);
    event StayIsFull(uint256 _stayId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyActiveShortStay(uint256 _stayId) {
        require(stays[_stayId].isActive && !stays[_stayId].isFull && stays[_stayId].deadline > block.timestamp, "HackerHouse: Stay is full, inactive or deadline was reached");
        _;
    }

    function proposeShortStay(
        string memory _descriptionURI,
        uint256 _nPersons,
        uint256 _totalPrice,
        uint256 _timeAvailable,
        bool _isCreatorSlot
    ) external returns (uint256) {
        require(_nPersons > 0, "HackerHouse: At least one room required");
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
        require(msg.value >= _stay.pricePerPerson, "HackerHouse: Insufficient value sent");
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
        require(!isMember, "HackerHouse: You are already signed up");
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
}