"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston"));
const token_1 = __importDefault(require("./routes/token"));
const staking_1 = __importDefault(require("./routes/staking"));
const ai_bridge_1 = require("./routes/ai-bridge");
const pricing_1 = require("./routes/pricing");
dotenv_1.default.config();
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json()),
    transports: [
        new winston_1.default.transports.Console()
    ]
});
exports.logger = logger;
const app = (0, express_1.default)();
exports.app = app;
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/token', token_1.default);
app.use('/api/staking', staking_1.default);
app.use('/api/ai', ai_bridge_1.aiBridgeRouter);
app.use('/api/pricing', pricing_1.pricingRouter);
// API Documentation endpoint
app.get('/api/docs', (req, res) => {
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
app.use((err, req, res, next) => {
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
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found', path: req.path });
});
const server = app.listen(PORT, () => {
    logger.info(`OCT Backend server running on port ${PORT}`);
});
exports.server = server;
//# sourceMappingURL=index.js.map