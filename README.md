# Simple DEX & ERC-20 Token

A full-stack decentralized application (DApp) featuring a custom ERC-20 token and a basic Decentralized Exchange (DEX) for swapping ETH <-> Token.

## Features
- **ERC-20 Token (`Web3Token`)**: A standard fungible token with minting capabilities.
- **DEX Contract**: Allows users to buy tokens with ETH and sell tokens for ETH.
- **Swap Interface**: React-based UI to interact with the contracts using MetaMask.
- **Liquidity Management**: Simple liquidity provisioning for the DEX.

## Tech Stack
- **Smart Contracts**: Solidity, Hardhat, Ethers.js
- **Frontend**: React, Vite, CSS
- **Testing**: Chai, Hardhat Network

## Project Structure
The project is organized as a monorepo:
- `packages/hardhat`: Smart contracts, deployment scripts, and tests.
- `packages/react-app`: React frontend application.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MetaMask Browser Extension

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd simple-DEX
   ```

2. **Install Dependencies**
   ```bash
   # Install Hardhat dependencies
   cd packages/hardhat
   npm install

   # Install React dependencies
   cd ../react-app
   npm install
   ```

## Running Locally

### 1. Start Local Blockchain
Start a local Hardhat node. Keep this terminal running.
```bash
cd packages/hardhat
npx hardhat node
```

### 2. Deploy Contracts
In a new terminal, deploy the contracts to the local network.
```bash
cd packages/hardhat
npx hardhat run scripts/deploy.js --network localhost
```
> **Note**: Copy the deployed `Token` and `DEX` addresses from the output.

### 3. Configure Frontend
Open `packages/react-app/src/App.jsx` and update the contract addresses:
```javascript
const TOKEN_ADDRESS = "YOUR_TOKEN_ADDRESS"
const DEX_ADDRESS = "YOUR_DEX_ADDRESS"
```

### 4. Import Test Account
- Open MetaMask.
- Switch network to **Localhost 8545** (Chain ID: 31337).
- Import an account using one of the private keys displayed in the `npx hardhat node` terminal.

### 5. Start the App
Run the frontend application.
```bash
cd packages/react-app
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to start swapping!

## License
MIT
