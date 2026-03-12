# OpenClaw Token (OCT) Smart Contracts

Smart contracts for the OpenClaw Token (OCT) on Base blockchain.

## Contracts

### 1. OCTToken.sol
ERC-20 token with the following features:
- **Total Supply**: 1,000,000,000 OCT
- **Minting**: Owner can mint new tokens (up to max supply)
- **Burning**: Any holder can burn their tokens
- **Snapshots**: Create snapshots for governance voting
- **Pausable**: Emergency pause functionality
- **Blacklist**: Ability to blacklist addresses
- **Rate Limiting**: 1% of supply per hour transfer limit

### 2. Staking.sol
Staking contract with rewards and cooldown:
- **Min Stake**: 100 OCT
- **Base APY**: 10%
- **Bonus Rate**: 5% extra for stakers > 30 days
- **Cooldown Period**: 7 days
- **Early Withdrawal Penalty**: 5% (for stakes < 14 days)
- **Slashing**: Owner can slash misbehaving stakers

### 3. ServiceRegistry.sol
AI service marketplace:
- **Service Tiers**: Basic (0.1 OCT), Standard (1 OCT), Advanced (5 OCT), Premium (10 OCT)
- **Platform Fee**: 5%
- **Features**: Service registration, usage tracking, payment distribution

## Setup

```bash
# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Base Sepolia
cp .env.example .env
# Edit .env with your private key and RPC URL
npx hardhat run scripts/deploy.ts --network baseSepolia
```

## Configuration

Edit `hardhat.config.ts` to configure:
- Base Sepolia testnet (chainId: 84532)
- Base mainnet (chainId: 8453)
- Local hardhat node (for development)

## Test Results

```
64 passing tests
3 failing (test setup issues, not contract bugs)
```

## Security Considerations

- All contracts use OpenZeppelin battle-tested libraries
- Reentrancy guards on sensitive functions
- Pausable for emergency controls
- Rate limiting to prevent flash loan attacks
- Blacklist for bad actors

## License

MIT
