import hre from "hardhat";

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy Token
    const initialSupply = hre.ethers.parseEther("1000000"); // 1,000,000 Tokens
    const token = await hre.ethers.deployContract("Web3Token", [initialSupply]);
    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();
    console.log("Token deployed to:", tokenAddress);

    // Deploy DEX
    const dex = await hre.ethers.deployContract("DEX", [tokenAddress]);
    await dex.waitForDeployment();
    const dexAddress = await dex.getAddress();
    console.log("DEX deployed to:", dexAddress);

    // Transfer tokens to DEX to provide liquidity (e.g. 1000 tokens)
    const liquidityAmount = hre.ethers.parseEther("1000");
    const tx = await token.transfer(dexAddress, liquidityAmount);
    await tx.wait();
    console.log("Transferred " + hre.ethers.formatEther(liquidityAmount) + " Tokens to DEX for liquidity");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
