import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { aiBridgeService, AIRequest, AIRequestStatus, AIAgent } from '../services/ai-bridge';

export const aiBridgeRouter = Router();

// Validation schemas
const aiRequestSchema = z.object({
  userAddress: z.string(),
  agentId: z.string(),
  prompt: z.string().min(1).max(10000),
  tier: z.enum(['basic', 'advanced']).default('basic'),
  maxTokens: z.number().min(100).max(100000).default(4000)
});

// Create AI request
aiBridgeRouter.post('/request', async (req: Request, res: Response) => {
  try {
    const result = aiRequestSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: result.error.issues 
      });
    }
    
    const { userAddress, agentId, prompt, tier, maxTokens } = result.data;
    
    const request = await aiBridgeService.createRequest({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to create AI request' });
  }
});

// Get request status
aiBridgeRouter.get('/status/:requestId', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const request = await aiBridgeService.getRequest(requestId);
    
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to get request status' });
  }
});

// Get available agents
aiBridgeRouter.get('/agents', async (req: Request, res: Response) => {
  try {
    const agents = await aiBridgeService.getAgents();
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get agents' });
  }
});

// Get agent by ID
aiBridgeRouter.get('/agents/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const agent = await aiBridgeService.getAgent(agentId);
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get agent' });
  }
});

// Get user requests
aiBridgeRouter.get('/requests/:userAddress', async (req: Request, res: Response) => {
  try {
    const { userAddress } = req.params;
    const requests = await aiBridgeService.getUserRequests(userAddress);
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user requests' });
  }
});

// Cancel request
aiBridgeRouter.post('/cancel/:requestId', async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const success = await aiBridgeService.cancelRequest(requestId);
    
    if (!success) {
      return res.status(404).json({ error: 'Request not found or already completed' });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel request' });
  }
});

// Register new agent
aiBridgeRouter.post('/register-agent', async (req: Request, res: Response) => {
  try {
    const { name, description, model, pricing } = req.body;
    
    if (!name || !model || !pricing) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const agent = await aiBridgeService.registerAgent({
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
  } catch (error) {
    res.status(500).json({ error: 'Failed to register agent' });
  }
});
