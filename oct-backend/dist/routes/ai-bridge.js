"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiBridgeRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const ai_bridge_1 = require("../services/ai-bridge");
exports.aiBridgeRouter = (0, express_1.Router)();
// Validation schemas
const aiRequestSchema = zod_1.z.object({
    userAddress: zod_1.z.string(),
    agentId: zod_1.z.string(),
    prompt: zod_1.z.string().min(1).max(10000),
    tier: zod_1.z.enum(['basic', 'advanced']).default('basic'),
    maxTokens: zod_1.z.number().min(100).max(100000).default(4000)
});
// Create AI request
exports.aiBridgeRouter.post('/request', async (req, res) => {
    try {
        const result = aiRequestSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: result.error.issues
            });
        }
        const { userAddress, agentId, prompt, tier, maxTokens } = result.data;
        const request = await ai_bridge_1.aiBridgeService.createRequest({
            userAddress,
            agentId,
            prompt,
            tier,
            maxTokens
        });
        res.json({
            success: true,
            request: {
                id: request.id,
                status: request.status,
                estimatedCost: request.estimatedCost,
                createdAt: request.createdAt
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create AI request' });
    }
});
// Get request status
exports.aiBridgeRouter.get('/status/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await ai_bridge_1.aiBridgeService.getRequest(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }
        res.json({
            id: request.id,
            status: request.status,
            result: request.result,
            actualCost: request.actualCost,
            createdAt: request.createdAt,
            completedAt: request.completedAt
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get request status' });
    }
});
// Get available agents
exports.aiBridgeRouter.get('/agents', async (req, res) => {
    try {
        const agents = await ai_bridge_1.aiBridgeService.getAgents();
        res.json({ agents });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get agents' });
    }
});
// Get agent by ID
exports.aiBridgeRouter.get('/agents/:agentId', async (req, res) => {
    try {
        const { agentId } = req.params;
        const agent = await ai_bridge_1.aiBridgeService.getAgent(agentId);
        if (!agent) {
            return res.status(404).json({ error: 'Agent not found' });
        }
        res.json(agent);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get agent' });
    }
});
// Get user requests
exports.aiBridgeRouter.get('/requests/:userAddress', async (req, res) => {
    try {
        const { userAddress } = req.params;
        const requests = await ai_bridge_1.aiBridgeService.getUserRequests(userAddress);
        res.json({ requests });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get user requests' });
    }
});
// Cancel request
exports.aiBridgeRouter.post('/cancel/:requestId', async (req, res) => {
    try {
        const { requestId } = req.params;
        const success = await ai_bridge_1.aiBridgeService.cancelRequest(requestId);
        if (!success) {
            return res.status(404).json({ error: 'Request not found or already completed' });
        }
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to cancel request' });
    }
});
// Register new agent
exports.aiBridgeRouter.post('/register-agent', async (req, res) => {
    try {
        const { name, description, model, pricing } = req.body;
        if (!name || !model || !pricing) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const agent = await ai_bridge_1.aiBridgeService.registerAgent({
            name,
            description: description || '',
            model,
            pricing,
            capabilities: req.body.capabilities || [],
            owner: req.body.owner || ''
        });
        res.json({
            success: true,
            agent
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to register agent' });
    }
});
//# sourceMappingURL=ai-bridge.js.map