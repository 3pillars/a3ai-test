import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import winston from 'winston';

import tokenRoutes from './routes/token';
import stakingRoutes from './routes/staking';
import { aiBridgeRouter } from './routes/ai-bridge';
import { pricingRouter } from './routes/pricing';

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/token', tokenRoutes);
app.use('/api/staking', stakingRoutes);
app.use('/api/ai', aiBridgeRouter);
app.use('/api/pricing', pricingRouter);

// API Documentation endpoint
app.get('/api/docs', (req: Request, res: Response) => {
  res.json({
    name: 'OpenClaw Token (OCT) API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      token: {
        balance: 'GET /api/token/balance/:address',
        transfer: 'POST /api/token/transfer',
        approve: 'POST /api/token/approve',
        allowance: 'GET /api/token/allowance/:owner/:spender'
      },
      staking: {
        stake: 'POST /api/staking/stake',
        unstake: 'POST /api/staking/unstake',
        rewards: 'GET /api/staking/rewards/:address',
        stakeInfo: 'GET /api/staking/stake-info/:address'
      },
      ai: {
        request: 'POST /api/ai/request',
        status: 'GET /api/ai/status/:requestId',
        agents: 'GET /api/ai/agents'
      },
      pricing: {
        current: 'GET /api/pricing/current',
        history: 'GET /api/pricing/history'
      }
    }
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

const server = app.listen(PORT, () => {
  logger.info(`OCT Backend server running on port ${PORT}`);
});

export { app, server, logger };
