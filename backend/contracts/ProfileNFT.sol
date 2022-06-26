// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ProfileNFT is ERC721 {
    address public owner;
    mapping (address => string) badges;

    constructor(string memory _name, string memory _symbol, address _owner) ERC721(_name, _symbol) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Restricted to owner");
        _;
    }

    function setBadge(address _to, string memory badge) external onlyOwner {
        badges[_to] = badge;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal override(ERC721)
    {
      require(from == address(0), "Err: token is SOUL BOUND");
      super._beforeTokenTransfer(from, to, tokenId);
   }
}