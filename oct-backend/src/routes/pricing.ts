import { Router, Request, Response } from 'express';
import { pricingService, PriceData } from '../services/pricing';

export const pricingRouter = Router();

// Get current pricing
pricingRouter.get('/current', async (req: Request, res: Response) => {
  try {
    const price = await pricingService.getCurrentPrice();
    res.json(price);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get current price' });
  }
});

// Get price history
pricingRouter.get('/history', async (req: Request, res: Response) => {
  try {
    const { period = '24h', limit = '100' } = req.query;
    const history = await pricingService.getPriceHistory(
      period as string, 
      parseInt(limit as string)
    );
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get price history' });
  }
});

// Get service pricing
pricingRouter.get('/services', async (req: Request, res: Response) => {
  try {
    const prices = await pricingService.getServicePrices();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get service prices' });
  }
});

// Calculate cost for a request
pricingRouter.post('/calculate', async (req: Request, res: Response) => {
  try {
    const { service, tier, tokens } = req.body;
    
    if (!service || !tier) {
      return res.status(400).json({ error: 'Missing service or tier' });
    }
    
    const cost = await pricingService.calculateCost(service, tier, tokens || 0);
    res.json(cost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate cost' });
  }
});

// Get gas price for transactions
pricingRouter.get('/gas', async (req: Request, res: Response) => {
  try {
    const gasPrice = await pricingService.getGasPrice();
    res.json(gasPrice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get gas price' });
  }
});

// Get exchange rates
pricingRouter.get('/exchange-rates', async (req: Request, res: Response) => {
  try {
    const rates = await pricingService.getExchangeRates();
    res.json(rates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get exchange rates' });
  }
});

// Get market stats
pricingRouter.get('/market', async (req: Request, res: Response) => {
  try {
    const stats = await pricingService.getMarketStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get market stats' });
  }
});
