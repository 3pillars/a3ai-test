"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingRouter = void 0;
const express_1 = require("express");
const pricing_1 = require("../services/pricing");
exports.pricingRouter = (0, express_1.Router)();
// Get current pricing
exports.pricingRouter.get('/current', async (req, res) => {
    try {
        const price = await pricing_1.pricingService.getCurrentPrice();
        res.json(price);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get current price' });
    }
});
// Get price history
exports.pricingRouter.get('/history', async (req, res) => {
    try {
        const { period = '24h', limit = '100' } = req.query;
        const history = await pricing_1.pricingService.getPriceHistory(period, parseInt(limit));
        res.json({ history });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get price history' });
    }
});
// Get service pricing
exports.pricingRouter.get('/services', async (req, res) => {
    try {
        const prices = await pricing_1.pricingService.getServicePrices();
        res.json(prices);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get service prices' });
    }
});
// Calculate cost for a request
exports.pricingRouter.post('/calculate', async (req, res) => {
    try {
        const { service, tier, tokens } = req.body;
        if (!service || !tier) {
            return res.status(400).json({ error: 'Missing service or tier' });
        }
        const cost = await pricing_1.pricingService.calculateCost(service, tier, tokens || 0);
        res.json(cost);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to calculate cost' });
    }
});
// Get gas price for transactions
exports.pricingRouter.get('/gas', async (req, res) => {
    try {
        const gasPrice = await pricing_1.pricingService.getGasPrice();
        res.json(gasPrice);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get gas price' });
    }
});
// Get exchange rates
exports.pricingRouter.get('/exchange-rates', async (req, res) => {
    try {
        const rates = await pricing_1.pricingService.getExchangeRates();
        res.json(rates);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get exchange rates' });
    }
});
// Get market stats
exports.pricingRouter.get('/market', async (req, res) => {
    try {
        const stats = await pricing_1.pricingService.getMarketStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get market stats' });
    }
});
//# sourceMappingURL=pricing.js.map