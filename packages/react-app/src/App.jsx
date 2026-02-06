import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import TokenArtifact from './contracts/Token.json'
import DexArtifact from './contracts/DEX.json'
import './App.css'

// UPDATE THESE ADDRESSES AFTER DEPLOYING TO LOCALHOST
// Run: npx hardhat run scripts/deploy.js --network localhost
const TOKEN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const DEX_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

function App() {
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [account, setAccount] = useState(null)
  const [tokenContract, setTokenContract] = useState(null)
  const [dexContract, setDexContract] = useState(null)

  const [ethBalance, setEthBalance] = useState("0")
  const [tokenBalance, setTokenBalance] = useState("0")

  const [buyAmount, setBuyAmount] = useState("")
  const [sellAmount, setSellAmount] = useState("")

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const _provider = new ethers.BrowserProvider(window.ethereum)
        const _signer = await _provider.getSigner()
        const _account = await _signer.getAddress()

        setProvider(_provider)
        setSigner(_signer)
        setAccount(_account)

        // Load contracts
        const _token = new ethers.Contract(TOKEN_ADDRESS, TokenArtifact.abi, _signer)
        const _dex = new ethers.Contract(DEX_ADDRESS, DexArtifact.abi, _signer)

        setTokenContract(_token)
        setDexContract(_dex)

        await updateBalances(_account, _provider, _token)
      } catch (err) {
        console.error("Error connecting wallet:", err)
      }
    } else {
      alert("Please install MetaMask!")
    }
  }

  const updateBalances = async (acc, prov, tok) => {
    if (!acc || !prov || !tok) return
    const ethBal = await prov.getBalance(acc)
    const tokBal = await tok.balanceOf(acc)
    setEthBalance(ethers.formatEther(ethBal))
    setTokenBalance(ethers.formatEther(tokBal))
  }

  const buyTokens = async () => {
    if (!dexContract) return
    try {
      const tx = await dexContract.buy({ value: ethers.parseEther(buyAmount) })
      await tx.wait()
      alert("Bought tokens successfully!")
      updateBalances(account, provider, tokenContract)
    } catch (err) {
      console.error(err)
      alert("Error buying tokens")
    }
  }

  const sellTokens = async () => {
    if (!dexContract || !tokenContract) return
    try {
      const amount = ethers.parseEther(sellAmount)
      // Approve DEX first
      const approveTx = await tokenContract.approve(DEX_ADDRESS, amount)
      await approveTx.wait()

      // Then sell
      const tx = await dexContract.sell(amount)
      await tx.wait()
      alert("Sold tokens successfully!")
      updateBalances(account, provider, tokenContract)
    } catch (err) {
      console.error(err)
      alert("Error selling tokens")
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple DEX</h1>
        {!account ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <p>Connected: {account}</p>
        )}
      </header>

      {account && (
        <div className="dex-container">
          <div className="balances">
            <p>ETH Balance: {parseFloat(ethBalance).toFixed(4)}</p>
            <p>Token Balance: {parseFloat(tokenBalance).toFixed(4)}</p>
          </div>

          <div className="swap-card">
            <h3>Buy Tokens (ETH -&gt; Token)</h3>
            <input
              type="number"
              placeholder="Amount in ETH"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
            />
            <button onClick={buyTokens}>Swap</button>
          </div>

          <div className="swap-card">
            <h3>Sell Tokens (Token -&gt; ETH)</h3>
            <input
              type="number"
              placeholder="Amount in Token"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
            />
            <button onClick={sellTokens}>Swap</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
