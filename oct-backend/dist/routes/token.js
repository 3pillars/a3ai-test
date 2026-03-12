"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ethers_1 = require("ethers");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
// Mock token contract address (would be from env in production)
const TOKEN_CONTRACT_ADDRESS = process.env.OCT_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000';
// In-memory balance storage (for demo - would use blockchain in production)
const balances = new Map();
const allowances = new Map();
// Validation schemas
const transferSchema = zod_1.z.object({
    from: zod_1.z.string().refine(ethers_1.ethers.isAddress, 'Invalid from address'),
    to: zod_1.z.string().refine(ethers_1.ethers.isAddress, 'Invalid to address'),
    amount: zod_1.z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Invalid amount')
});
const approveSchema = zod_1.z.object({
    owner: zod_1.z.string().refine(ethers_1.ethers.isAddress, 'Invalid owner address'),
    spender: zod_1.z.string().refine(ethers_1.ethers.isAddress, 'Invalid spender address'),
    amount: zod_1.z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) > 0, 'Invalid amount')
});
// Get token info
router.get('/info', (req, res) => {
    res.json({
        name: 'OpenClaw Token',
        symbol: 'OCT',
        decimals: 18,
        totalSupply: '1000000000000000000000000000', // 1B OCT in wei
        contractAddress: TOKEN_CONTRACT_ADDRESS
    });
});
// Get balance of an address
router.get('/balance/:address', (req, res) => {
    try {
        const { address } = req.params;
        if (!ethers_1.ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        const balance = balances.get(address.toLowerCase()) || '0';
        res.json({ address, balance });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get balance' });
    }
});
// Transfer tokens
router.post('/transfer', (req, res) => {
    try {
        const result = transferSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues
            });
        }
        const { from, to, amount } = result.data;
        const fromLower = from.toLowerCase();
        const toLower = to.toLowerCase();
        // Get current balances
        const fromBalance = BigInt(balances.get(fromLower) || '0');
        const amountWei = BigInt(ethers_1.ethers.parseUnits(amount, 18).toString());
        if (fromBalance < amountWei) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        // Update balances
        balances.set(fromLower, (fromBalance - amountWei).toString());
        const toBalance = BigInt(balances.get(toLower) || '0');
        balances.set(toLower, (toBalance + amountWei).toString());
        res.json({
            success: true,
            transaction: {
                from,
                to,
                amount,
                hash: `0x${Math.random().toString(16).slice(2)}${Math.random().toString(16).slice(2)}`
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Transfer failed' });
    }
});
// Approve tokens
router.post('/approve', (req, res) => {
    try {
        const result = approveSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues
            });
        }
        const { owner, spender, amount } = result.data;
        const ownerLower = owner.toLowerCase();
        if (!allowances.has(ownerLower)) {
            allowances.set(ownerLower, new Map());
        }
        allowances.get(ownerLower).set(spender.toLowerCase(), amount);
        res.json({
            success: true,
            owner,
            spender,
            amount
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Approval failed' });
    }
});
// Get allowance
router.get('/allowance/:owner/:spender', (req, res) => {
    try {
        const { owner, spender } = req.params;
        if (!ethers_1.ethers.isAddress(owner) || !ethers_1.ethers.isAddress(spender)) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        const ownerLower = owner.toLowerCase();
        const allowance = allowances.get(ownerLower)?.get(spender.toLowerCase()) || '0';
        res.json({ owner, spender, allowance });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get allowance' });
    }
});
// Get total supply
router.get('/supply', (req, res) => {
    res.json({
        totalSupply: '1000000000000000000000000000',
        circulating: Array.from(balances.values())
            .reduce((sum, bal) => sum + BigInt(bal), 0n).toString()
    });
});
// Mint tokens (admin only in production)
router.post('/mint', (req, res) => {
    try {
        const { to, amount } = req.body;
        if (!to || !amount) {
            return res.status(400).json({ error: 'Missing to or amount' });
        }
        if (!ethers_1.ethers.isAddress(to)) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        const toLower = to.toLowerCase();
        const currentBalance = BigInt(balances.get(toLower) || '0');
        const amountWei = BigInt(ethers_1.ethers.parseUnits(amount, 18).toString());
        balances.set(toLower, (currentBalance + amountWei).toString());
        res.json({
            success: true,
            minted: amount,
            newBalance: (currentBalance + amountWei).toString()
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Mint failed' });
    }
});
// Burn tokens
router.post('/burn', (req, res) => {
    try {
        const { from, amount } = req.body;
        if (!from || !amount) {
            return res.status(400).json({ error: 'Missing from or amount' });
        }
        if (!ethers_1.ethers.isAddress(from)) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        const fromLower = from.toLowerCase();
        const currentBalance = BigInt(balances.get(fromLower) || '0');
        const amountWei = BigInt(ethers_1.ethers.parseUnits(amount, 18).toString());
        if (currentBalance < amountWei) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }
        balances.set(fromLower, (currentBalance - amountWei).toString());
        res.json({
            success: true,
            burned: amount,
            newBalance: (currentBalance - amountWei).toString()
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Burn failed' });
    }
});
exports.default = router;
//# sourceMappingURL=token.js.map