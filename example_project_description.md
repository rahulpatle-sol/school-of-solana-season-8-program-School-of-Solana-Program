# Project Description

**Deployed Frontend URL:https://school-of-solana-season-8-program-s.vercel.app/

**Solana Program ID:75zeKfzrc1CzfcC6fDT3gYwTeYgqMoEkfSjbLHMykaVE

## Project Overview

### Description
Tip Oracle is a decentralized Solana-based application that allows users to send SOL tips to another wallet with full on-chain transparency. The dApp uses PDAs to track and record tip statistics such as total tips, amounts, and user history.

The frontend is built with Next.js + Wallet Adapter, while the smart contract is developed using Anchor. The goal of this project is to demonstrate secure Solana transactions, PDA-based state management, and real-time UI synchronization with on-chain data.

### Key Features
1️⃣ Send Tips On-Chain

Users can send SOL to any creator wallet using a single Solana transaction.

2️⃣ PDA-Based Stat Tracking

Each user gets an on-chain PDA that stores:

Total tips sent

Total SOL amount tipped

Last tipped timestamp

3️⃣ Wallet-Based Authentication

No login system — the user's Solana wallet acts as their identity.

4️⃣ Instant Real-Time Updates

After each tip:

Transaction is confirmed

PDA data is re-fetched

UI updates instantly

5️⃣ Secure + Gas Efficient

Only the PDA owner can update their tipping history.

Uses minimal compute and rent-exempt account sizes.

### How to Use the dApp
User connects their wallet

App derives PDA for the user

If PDA doesn’t exist → show “Initialize Tip Account”

User enters:

Receiver wallet

Amount

Optional message

When "Send Tip" is clicked:

SOL transfer happens

PDA stats update

UI refreshes with latest values

## Program Architecture
User Clicks "Send Tip"
      ↓
Wallet Adapter prompts signature
      ↓
Program validates PDA → updates stats
      ↓
SOL transfer executes
      ↓
Frontend fetches PDA → updates UI
file:///home/rahul-patle/Pictures/Screenshots/Screenshot%20from%202025-11-27%2000-22-59.png

### PDA Usage
The program uses Program Derived Addresses to create deterministic counter accounts for each user.

**PDAs Used:**
- **Counter PDA**: Derived from seeds `["counter", user_wallet_pubkey]` - ensures each user has a unique counter account that only they can modify

### Program Instructions
**Instructions Implemented:**
- **Initialize**: Creates a new counter account for the user with initial value of 0
- **Increment**: Increases the counter value by 1 and tracks total increments
- **Reset**: Sets the counter value back to 0 while preserving the owner information
🧠 Problems Solved & How
1️⃣ Secure Payments Without Backend

❌ Problem: Traditional apps need backend to process payments
✅ Solution: Solana transfer directly from wallet → wallet (no backend)

2️⃣ Transaction Confirmation Reliability

❌ Problem: Solana is async, UI may show wrong state
✅ Solution:

connection.confirmTransaction(signature, "finalized")

Toast notifications

3️⃣ Wallet Connection Handling

❌ Problem: Phantom sometimes doesn’t auto-connect
✅ Solution:

Wallet Adapter autoConnect + hooks

Graceful fallback UI

4️⃣ Clean and Modern UI for Non-Tech Users

❌ Problem: Web3 UIs often confusing
✅ Solution:

Card-based UI

Clear tip options

One-click actions

5️⃣ Low-Fee Tipping System

❌ Problem: Ethereum fees too high for micro-tips
✅ Solved: Solana transaction ≈ $0.0002
### Account Structure
```rust
#[account]
pub struct CreatorAccount {
    pub total_tips: u64,
    pub last_tipper: Pubkey,
    pub creator: Pubkey,   // REQUIRED FOR has_one
    pub bump: u8,
}
```

## Testing

### Test Coverage
Comprehensive test suite covering all instructions with both successful operations and error conditions to ensure program security and reliability.
<img width="1920" height="1080" alt="Screenshot from 2025-11-26 23-26-47" src="https://github.com/user-attachments/assets/ee1c1495-7017-4123-b7ea-feb9430df38c" />


Happy Path Tests:

Initialize Creator PDA: Successfully creates the creator PDA with correct seeds and default values

Send Tip: Correctly transfers SOL to the creator PDA and updates balance

Withdraw Tips: Allows the creator to withdraw accumulated tips into their wallet

Unhappy Path Tests:

Initialize Wrong PDA: Fails when PDA is derived using incorrect seeds

Tip Overflow: Fails when user tries to tip more SOL than their balance

Unauthorized Withdraw: Fails when someone other than the creator tries to withdraw tips

PDA Not Found: Fails when sending a tip to a non-existent or uninitialized creator PDA

### Running Tests
```bash
yarn install    # install dependencies
anchor test     # run tests
```

### Additional Notes for Evaluators

This was my first Solana dApp and the learning curve was steep! The biggest challenges were figuring out account ownership validation (kept getting unauthorized errors) and dealing with async transaction confirmations. PDAs were confusing at first but once they clicked, the deterministic addressing made everything much cleaner.
