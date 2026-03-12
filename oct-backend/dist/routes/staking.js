"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ethers_1 = require("ethers");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// In-memory storage (would be blockchain in production)
const stakes = new Map();
const totalStaked = new Map();
const rewardPool = new Map();
// Configuration
const UNSTAKE_COOLDOWN_SECONDS = 7 * 24 * 60 * 60; // 7 days
const REWARD_RATE = 0.1; // 10% APY (simplified)
// Validation schemas
const stakeSchema = zod_1.z.object({
    staker: zod_1.z.string().refine(ethers_1.ethers.isAddress, 'Invalid staker address'),
    amount: zod_1.z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Invalid amount')
});
const unstakeSchema = zod_1.z.object({
    staker: zod_1.z.string().refine(ethers_1.ethers.isAddress, 'Invalid staker address'),
    stakeIndex: zod_1.z.number().min(0)
});
const claimSchema = zod_1.z.object({
    staker: zod_1.z.string().refine(ethers_1.ethers.isAddress, 'Invalid staker address'),
    stakeIndex: zod_1.z.number().min(0)
});
// Get staking info
router.get('/info', (req, res) => {
    res.json({
        rewardRate: REWARD_RATE,
        cooldownPeriod: UNSTAKE_COOLDOWN_SECONDS,
        totalStakers: stakes.size,
        totalValueStaked: Array.from(totalStaked.values())
            .reduce((sum, val) => sum + BigInt(val), 0n).toString()
    });
});
// Stake tokens
router.post('/stake', (req, res) => {
    try {
        const result = stakeSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues
            });
        }
        const { staker, amount } = result.data;
        const stakerLower = staker.toLowerCase();
        const amountWei = BigInt(ethers_1.ethers.parseUnits(amount, 18).toString());
        const now = Math.floor(Date.now() / 1000);
        // Get existing stakes or create new array
        const userStakes = stakes.get(stakerLower) || [];
        // Create new stake
        const newStake = {
            staker: stakerLower,
            amount: amountWei.toString(),
            startTime: now,
            unlockTime: now + UNSTAKE_COOLDOWN_SECONDS,
            rewards: '0',
            claimed: false
        };
        userStakes.push(newStake);
        stakes.set(stakerLower, userStakes);
        // Update total staked
        const currentTotal = BigInt(totalStaked.get(stakerLower) || '0');
        totalStaked.set(stakerLower, (currentTotal + amountWei).toString());
        res.json({
            success: true,
            stake: {
                index: userStakes.length - 1,
                amount,
                startTime: newStake.startTime,
                unlockTime: newStake.unlockTime,
                rewards: '0'
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Staking failed' });
    }
});
// Request unstake
router.post('/unstake', (req, res) => {
    try {
        const result = unstakeSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues
            });
        }
        const { staker, stakeIndex } = result.data;
        const stakerLower = staker.toLowerCase();
        const userStakes = stakes.get(stakerLower);
        if (!userStakes || !userStakes[stakeIndex]) {
            return res.status(404).json({ error: 'Stake not found' });
        }
        const stake = userStakes[stakeIndex];
        const now = Math.floor(Date.now() / 1000);
        // Check if cooldown has passed
        if (now < stake.unlockTime) {
            const remaining = stake.unlockTime - now;
            return res.status(400).json({
                error: 'Cooldown not complete',
                unlockTime: stake.unlockTime,
                remainingSeconds: remaining
            });
        }
        // Calculate rewards
        const stakeDuration = now - stake.startTime;
        const stakeAmount = BigInt(stake.amount);
        const rewardWei = (stakeAmount * BigInt(Math.floor(stakeDuration * REWARD_RATE * 1000)) / BigInt(365 * 24 * 60 * 60 * 1000 * 1000));
        // Update stake
        stake.rewards = rewardWei.toString();
        stake.claimed = true;
        // Update total staked
        const currentTotal = BigInt(totalStaked.get(stakerLower) || '0');
        totalStaked.set(stakerLower, (currentTotal - stakeAmount).toString());
        res.json({
            success: true,
            unstaked: {
                amount: stake.amount,
                rewards: stake.rewards,
                duration: stakeDuration
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Unstake failed' });
    }
});
// Claim rewards
router.post('/claim', (req, res) => {
    try {
        const result = claimSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues
            });
        }
        const { staker, stakeIndex } = result.data;
        const stakerLower = staker.toLowerCase();
        const userStakes = stakes.get(stakerLower);
        if (!userStakes || !userStakes[stakeIndex]) {
            return res.status(404).json({ error: 'Stake not found' });
        }
        const stake = userStakes[stakeIndex];
        if (stake.claimed) {
            return res.status(400).json({ error: 'Rewards already claimed' });
        }
        // Calculate pending rewards
        const now = Math.floor(Date.now() / 1000);
        const stakeDuration = now - stake.startTime;
        const stakeAmount = BigInt(stake.amount);
        const pendingRewards = (stakeAmount * BigInt(Math.floor(stakeDuration * REWARD_RATE * 1000)) / BigInt(365 * 24 * 60 * 60 * 1000 * 1000));
        stake.rewards = pendingRewards.toString();
        stake.claimed = true;
        res.json({
            success: true,
            claimed: {
                amount: stake.rewards,
                stakeIndex
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Claim failed' });
    }
});
// Get rewards for an address
router.get('/rewards/:address', (req, res) => {
    try {
        const { address } = req.params;
        if (!ethers_1.ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        const stakerLower = address.toLowerCase();
        const userStakes = stakes.get(stakerLower);
        if (!userStakes) {
            return res.json({
                address,
                pendingRewards: '0',
                totalStaked: '0',
                stakeCount: 0
            });
        }
        const now = Math.floor(Date.now() / 1000);
        let totalPending = 0n;
        let totalStaked = 0n;
        let totalDuration = 0;
        userStakes.forEach((stake, index) => {
            if (!stake.claimed) {
                const stakeAmount = BigInt(stake.amount);
                const stakeDuration = now - stake.startTime;
                const pending = (stakeAmount * BigInt(Math.floor(stakeDuration * REWARD_RATE * 1000)) / BigInt(365 * 24 * 60 * 60 * 1000 * 1000));
                totalPending += pending;
                totalStaked += stakeAmount;
                totalDuration += stakeDuration;
            }
        });
        res.json({
            address,
            pendingRewards: totalPending.toString(),
            totalStaked: totalStaked.toString(),
            stakeCount: userStakes.length,
            averageStakeDuration: userStakes.length > 0 ? Math.floor(totalDuration / userStakes.length) : 0
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get rewards' });
    }
});
// Get stake info for an address
router.get('/stake-info/:address', (req, res) => {
    try {
        const { address } = req.params;
        if (!ethers_1.ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        const stakerLower = address.toLowerCase();
        const userStakes = stakes.get(stakerLower);
        if (!userStakes) {
            return res.json({
                address,
                stakes: []
            });
        }
        const now = Math.floor(Date.now() / 1000);
        const stakesWithPending = userStakes.map((stake, index) => {
            if (!stake.claimed) {
                const stakeAmount = BigInt(stake.amount);
                const stakeDuration = now - stake.startTime;
                const pending = (stakeAmount * BigInt(Math.floor(stakeDuration * REWARD_RATE * 1000)) / BigInt(365 * 24 * 60 * 60 * 1000 * 1000));
                return {
                    index,
                    amount: stake.amount,
                    startTime: stake.startTime,
                    unlockTime: stake.unlockTime,
                    pendingRewards: pending.toString(),
                    claimed: stake.claimed,
                    canUnstake: now >= stake.unlockTime
                };
            }
            return {
                index,
                amount: stake.amount,
                startTime: stake.startTime,
                unlockTime: stake.unlockTime,
                pendingRewards: stake.rewards,
                claimed: stake.claimed,
                canUnstake: now >= stake.unlockTime
            };
        });
        res.json({
            address,
            stakes: stakesWithPending,
            totalStaked: userStakes.reduce((sum, s) => sum + BigInt(s.amount), 0n).toString()
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get stake info' });
    }
});
// Get total value locked
router.get('/tvl', (req, res) => {
    const totalValueLocked = Array.from(totalStaked.values())
        .reduce((sum, val) => sum + BigInt(val), 0n);
    res.json({
        tvl: totalValueLocked.toString(),
        stakerCount: totalStaked.size
    });
});
exports.default = router;
//# sourceMappingURL=staking.js.map