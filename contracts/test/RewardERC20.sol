// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RewardERC20 is ERC20 {
    constructor() ERC20("RewardERC20", "RWRD") {
        _mint(msg.sender, 1000000000 * 10 ** decimals());
    }
}
