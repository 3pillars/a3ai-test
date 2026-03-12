"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingService = void 0;
class PricingService {
    constructor() {
        this.priceHistory = [];
        this.lastUpdate = 0;
        // Service pricing (in OCT)
        this.servicePrices = [
            { service: 'ai-request', basic: '0.1', advanced: '1', unit: 'per request' },
            { service: 'ai-advanced', basic: '1', advanced: '10', unit: 'per request' },
            { service: 'memory-query', basic: '0.01', advanced: '0.1', unit: 'per query' },
            { service: 'agent-listing', basic: '10', advanced: '50', unit: 'per listing' },
            { service: 'skill-encoding', basic: '50', advanced: '200', unit: 'per skill' },
            { service: 'data-storage', basic: '0.001', advanced: '0.01', unit: 'per MB/day' }
        ];
        // Simulated base price (would fetch from DEX in production)
        this.basePriceUSD = 0.05; // $0.05 per OCT
        // Initialize with some historical data
        this.initializeHistory();
    }
    initializeHistory() {
        const now = Date.now();
        const hour = 3600 * 1000;
        for (let i = 24; i >= 0; i--) {
            const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
            const price = this.basePriceUSD * (1 + variation);
            this.priceHistory.push({
                price: price.toFixed(6),
                change24h: (variation * 100).toFixed(2),
                volume24h: (Math.random() * 1000000).toFixed(2),
                marketCap: (1000000000 * price).toFixed(2),
                timestamp: now - (i * hour)
            });
        }
        this.lastUpdate = now;
    }
    async getCurrentPrice() {
        // Update price with slight variation
        const variation = (Math.random() - 0.5) * 0.01;
        const newPrice = this.basePriceUSD * (1 + variation);
        this.basePriceUSD = newPrice;
        const currentData = {
            price: newPrice.toFixed(6),
            change24h: ((newPrice - 0.05) / 0.05 * 100).toFixed(2),
            volume24h: (Math.random() * 1000000).toFixed(2),
            marketCap: (1000000000 * newPrice).toFixed(2),
            timestamp: Date.now()
        };
        // Add to history
        this.priceHistory.push(currentData);
        if (this.priceHistory.length > 168) { // Keep 7 days of hourly data
            this.priceHistory.shift();
        }
        return currentData;
    }
    async getPriceHistory(period, limit) {
        await this.getCurrentPrice(); // Ensure we have recent data
        const now = Date.now();
        const hour = 3600 * 1000;
        let cutoff = now;
        switch (period) {
            case '1h':
                cutoff = now - hour;
                break;
            case '24h':
                cutoff = now - (24 * hour);
                break;
            case '7d':
                cutoff = now - (7 * 24 * hour);
                break;
            case '30d':
                cutoff = now - (30 * 24 * hour);
                break;
        }
        return this.priceHistory
            .filter(p => p.timestamp >= cutoff)
            .slice(-limit);
    }
    async getServicePrices() {
        const currentPrice = await this.getCurrentPrice();
        const priceNum = parseFloat(currentPrice.price);
        // Convert OCT prices to USD equivalents
        return this.servicePrices.map(sp => ({
            ...sp,
            basicUSD: (parseFloat(sp.basic) * priceNum).toFixed(4),
            advancedUSD: (parseFloat(sp.advanced) * priceNum).toFixed(4)
        }));
    }
    async calculateCost(service, tier, tokens = 0) {
        const servicePrice = this.servicePrices.find(s => s.service === service);
        if (!servicePrice) {
            throw new Error('Service not found');
        }
        const octCost = tier === 'advanced' ? servicePrice.advanced : servicePrice.basic;
        // Add token cost if applicable
        let totalOct = parseFloat(octCost);
        if (tokens > 0) {
            totalOct += tokens * 0.0001; // 0.0001 OCT per token
        }
        const currentPrice = await this.getCurrentPrice();
        const usdCost = totalOct * parseFloat(currentPrice.price);
        return {
            oct: totalOct.toFixed(4),
            usd: usdCost.toFixed(4)
        };
    }
    async getGasPrice() {
        // Simulated gas prices in Gwei
        const baseGas = 0.001; // Base fee
        return {
            slow: (baseGas * 0.8).toFixed(4),
            standard: baseGas.toFixed(4),
            fast: (baseGas * 1.5).toFixed(4),
            unit: 'Gwei'
        };
    }
    async getExchangeRates() {
        const currentPrice = await this.getCurrentPrice();
        const price = parseFloat(currentPrice.price);
        return {
            ETH: (price * 0.00001).toFixed(8), // Rough OCT/ETH ratio
            USD: price.toFixed(6),
            BTC: (price * 0.000001).toFixed(8) // Rough OCT/BTC ratio
        };
    }
    async getMarketStats() {
        return {
            totalSupply: '1000000000000000000000000000', // 1B in wei
            circulatingSupply: '50000000000000000000000000', // 50M
            totalStaked: '1000000000000000000000000', // 1M
            stakingAPY: '10.5',
            burnRate: '10000' // OCT per day
        };
    }
    // Dynamic pricing based on demand
    async calculateDynamicPrice(basePrice, demandFactor) {
        // Price increases with demand
        const minPrice = basePrice * 0.8;
        const maxPrice = basePrice * 1.5;
        const dynamicPrice = basePrice * (1 + (demandFactor - 1) * 0.3);
        return Math.max(minPrice, Math.min(maxPrice, dynamicPrice));
    }
    // Get optimal price for bundle purchases
    async getBundlePrice(services, discount = 0.1) {
        let total = 0;
        for (const service of services) {
            const price = this.servicePrices.find(s => s.service === service);
            if (price) {
                total += parseFloat(price.basic);
            }
        }
        const discounted = total * (1 - discount);
        return {
            original: total.toFixed(4),
            discounted: discounted.toFixed(4),
            savings: (total * discount).toFixed(4)
        };
    }
}
exports.pricingService = new PricingService();
//# sourceMappingURL=pricing.js.map