// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DEX is Ownable {
    IERC20 public token;

    event Bought(uint256 amount);
    event Sold(uint256 amount);

    constructor(address tokenAddress) Ownable(msg.sender) {
        token = IERC20(tokenAddress);
    }

    function buy() payable public {
        uint256 amount = msg.value; // 1 ETH = 1 Token (simplified exchange rate)
        // In a real DEX, you'd have a price formula or oracle. Here 1 wei = 1 wei of token.
        
        uint256 dexBalance = token.balanceOf(address(this));
        require(amount > 0, "You need to send some Ether");
        require(amount <= dexBalance, "Not enough tokens in the reserve");

        token.transfer(msg.sender, amount);
        emit Bought(amount);
    }

    function sell(uint256 amount) public {
        require(amount > 0, "You need to sell at least some tokens");
        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= amount, "Check the token allowance");

        token.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(amount);
        emit Sold(amount);
    }

    function withdraw(uint256 amount) public onlyOwner {
         payable(owner()).transfer(amount);
    }
    
    function withdrawToken(uint256 amount) public onlyOwner {
        token.transfer(owner(), amount);
    }

    // Allow contract to receive ETH for liquidity
    receive() external payable {}
}
