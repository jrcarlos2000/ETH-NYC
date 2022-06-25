// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interfaces/AggregatorV3Interface.sol";

contract DummyToken is ERC20 {
    
    address public priceFeed;
    address immutable owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    constructor(
        string memory name,
        string memory symbol
    ) ERC20(name, symbol) {
        _mint(msg.sender, 1000 * 10e18);
        owner = msg.sender;
    }

    function setPriceFeed(address _priceFeed) external onlyOwner {
        require (_priceFeed != priceFeed,"new address is same as current one");
        require (_priceFeed != address(0),"zero address not allowed");
        priceFeed = _priceFeed;
    }

    function getPrice() public view returns(uint256){
        (, int256 _iprice, , , ) = AggregatorV3Interface(priceFeed)
            .latestRoundData();
        uint256 _price = uint256(_iprice);
        return uint256(_price);
    }
}
