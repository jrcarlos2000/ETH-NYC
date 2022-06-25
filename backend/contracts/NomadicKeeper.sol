// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

contract NomadicKeeper is KeeperCompatibleInterface {
    event ConfigUpdated(bytes32 config);

    address public vault;
    address public owner;
    uint256 lastRunDay = 0;
    bytes32 public config; // we use bytes for saving gas

    constructor(
        bytes32 config_,
        address vault_
    ) {
        vault = vault_;
        config = config_;
        owner = msg.sender;
    }

    function setConfig(bytes32 config_) external {
        require(msg.sender == owner);
        config = config_;
        emit ConfigUpdated(config);
    }

    function checkUpkeep(bytes calldata checkData)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        (bool runCheck) = _shouldRun();
        upkeepNeeded = (runCheck);
        performData = checkData;
    }

    function performUpkeep(bytes calldata performData) external override {
        (bool runCheck) = _shouldRun();
        if (runCheck) {
            // write today, so that we only run once per day
            lastRunDay = (block.timestamp / 86400);
        }
        if (runCheck) {
            vault.call(abi.encodeWithSignature("checkDeadlines()"));
        }
        
    }

    function _shouldRun()
        internal
        view
        returns (bool runCheck)
    {
        bytes32 _config = config; // Gas savings

        // Have we run today?
        uint256 day = block.timestamp / 86400;
        if (lastRunDay >= day) {
            return (false);
        }

        // Load schedule
        uint8 checkDays = uint8(_config[0]); // day of week bits

        // Weekday
        uint8 weekday = uint8((day + 4) % 7);

        // Need a runCheck?
        if (((checkDays >> weekday) & 1) != 0) {
            runCheck = true;
        }
    }
}