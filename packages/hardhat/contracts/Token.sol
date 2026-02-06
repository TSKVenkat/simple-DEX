// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Web3Token
 * @dev A custom ERC-20 token with minting capabilities restricted to the owner.
 */
contract Web3Token is ERC20, Ownable {
    /**
     * @dev Constructor that mints the initial supply to the deployer.
     * @param initialSupply The amount of tokens to mint upon deployment.
     */
    constructor(uint256 initialSupply) ERC20("Web3Token", "W3T") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Mint new tokens.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
