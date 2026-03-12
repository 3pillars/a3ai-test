export interface PriceData {
    price: string;
    change24h: string;
    volume24h: string;
    marketCap: string;
    timestamp: number;
}
export interface ServicePrice {
    service: string;
    basic: string;
    advanced: string;
    unit: string;
}
export interface GasPrice {
    slow: string;
    standard: string;
    fast: string;
    unit: string;
}
export interface ExchangeRates {
    ETH: string;
    USD: string;
    BTC: string;
}
export interface MarketStats {
    totalSupply: string;
    circulatingSupply: string;
    totalStaked: string;
    stakingAPY: string;
    burnRate: string;
}
declare class PricingService {
    private priceHistory;
    private lastUpdate;
    private servicePrices;
    private basePriceUSD;
    constructor();
    private initializeHistory;
    getCurrentPrice(): Promise<PriceData>;
    getPriceHistory(period: string, limit: number): Promise<PriceData[]>;
    getServicePrices(): Promise<ServicePrice[]>;
    calculateCost(service: string, tier: 'basic' | 'advanced', tokens?: number): Promise<{
        oct: string;
        usd: string;
    }>;
    getGasPrice(): Promise<GasPrice>;
    getExchangeRates(): Promise<ExchangeRates>;
    getMarketStats(): Promise<MarketStats>;
    calculateDynamicPrice(basePrice: number, demandFactor: number): Promise<number>;
    getBundlePrice(services: string[], discount?: number): Promise<{
        original: string;
        discounted: string;
        savings: string;
    }>;
}
export declare const pricingService: PricingService;
export {};
//# sourceMappingURL=pricing.d.ts.map