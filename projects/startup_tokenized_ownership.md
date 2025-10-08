## Build Tokenized Ownership + ETH Distribution Smart Contract

> I want to build a smart contract system that represents company ownership using ERC-20 tokens and distributes ETH from a vault based on token holdings. Here's the full spec:

### 🔹 Ownership Structure
- Total token supply: 100,000 tokens
- Partner A: 40,000 tokens (40%)
- Partner B: 40,000 tokens (40%)
- Investor: 10,000 tokens (10%)
- Reserve: 10,000 tokens (10%) — optional

### 🔹 Requirements

#### 1. ERC-20 Token Contract
- Standard ERC-20 implementation
- Mint total supply to specified addresses
- Token represents ownership in the company

#### 2. Vault Contract
- Accepts ETH deposits
- Has a `distribute()` function that:
  - Reads token balances of all holders
  - Calculates each holder’s percentage of total supply
  - Transfers ETH proportionally to each holder’s wallet

#### 3. Distribution Logic
- Triggered manually by an admin
- Uses `totalSupply()` and `balanceOf(address)` from token contract
- Must be gas-efficient and secure (e.g., reentrancy protection)

#### 4. Security
- Use OpenZeppelin libraries
- Add access control to restrict `distribute()` to admin
- Prevent reentrancy and overflow issues

#### 5. Optional Features (if time allows)
- Vesting schedule for founders
- Governance (voting based on token holdings)
- Buyback/burn mechanism

### 🔹 Deliverables
- Solidity contracts for ERC-20 token and vault
- Deployment scripts (e.g., Hardhat or Foundry)
- Test cases for deposit and distribution logic
- README with setup instructions

---

You can paste this into your AI coding tool or share it with a dev team to get started. Want me to generate the actual Solidity code for the token and vault contracts next?
