import { expect } from "chai";
import hre from "hardhat";

describe("DEX", function () {
    it("Should mint tokens and allow swapping", async function () {
        const [owner, user1] = await hre.ethers.getSigners();

        // Deploy Token
        const initialSupply = hre.ethers.parseEther("1000000");
        const Token = await hre.ethers.getContractFactory("Web3Token");
        const token = await Token.deploy(initialSupply);
        await token.waitForDeployment();
        const tokenAddress = await token.getAddress();

        // Deploy DEX
        const DEX = await hre.ethers.getContractFactory("DEX");
        const dex = await DEX.deploy(tokenAddress);
        await dex.waitForDeployment();
        const dexAddress = await dex.getAddress();

        // Add liquidity
        const liquidityAmount = hre.ethers.parseEther("1000");
        await token.transfer(dexAddress, liquidityAmount);

        // Check DEX balance
        expect(await token.balanceOf(dexAddress)).to.equal(liquidityAmount);

        // Swap ETH for Token (buy)
        const buyAmount = hre.ethers.parseEther("1");
        // Connect user1
        // DEX.sol buy() function automatically uses msg.sender, so just connecting contract instance is enough?
        // Wait, hardhat-ethers v6 syntax:
        const dexUser1 = dex.connect(user1);

        await dexUser1.buy({ value: buyAmount });

        // Check User1 balance (1 ETH = 1 Token)
        expect(await token.balanceOf(user1.address)).to.equal(buyAmount);

        // Approve DEX to spend user's tokens
        // token.connect(user1)
        const tokenUser1 = token.connect(user1);
        await tokenUser1.approve(dexAddress, buyAmount);

        // Swap Token for ETH (sell)
        await expect(dexUser1.sell(buyAmount))
            .to.emit(dex, "Sold")
            .withArgs(buyAmount);

        // Check User1 token balance should be 0
        expect(await token.balanceOf(user1.address)).to.equal(0);
    });
});
