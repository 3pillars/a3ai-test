"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiBridgeService = void 0;
// In-memory storage (would use database in production)
const requests = new Map();
const userRequests = new Map();
const agents = new Map();
// Initialize with some demo agents
const demoAgents = [
    {
        id: 'agent-1',
        name: 'Code Assistant',
        description: 'AI agent for code generation, review, and debugging',
        model: 'claude-3-opus',
        pricing: { basic: '1', advanced: '10' },
        capabilities: ['code-generation', 'code-review', 'debugging', 'refactoring'],
        owner: '0x0000000000000000000000000000000000000001',
        isActive: true,
        totalRequests: 0,
        rating: 4.8
    },
    {
        id: 'agent-2',
        name: 'Research Assistant',
        description: 'AI agent for research, summarization, and analysis',
        model: 'gpt-4-turbo',
        pricing: { basic: '0.5', advanced: '5' },
        capabilities: ['research', 'summarization', 'analysis', 'writing'],
        owner: '0x0000000000000000000000000000000000000002',
        isActive: true,
        totalRequests: 0,
        rating: 4.6
    },
    {
        id: 'agent-3',
        name: 'Data Analyst',
        description: 'AI agent for data analysis and visualization',
        model: 'gpt-4',
        pricing: { basic: '2', advanced: '15' },
        capabilities: ['data-analysis', 'visualization', 'statistics', 'forecasting'],
        owner: '0x0000000000000000000000000000000000000003',
        isActive: true,
        totalRequests: 0,
        rating: 4.5
    }
];
// Initialize demo agents
demoAgents.forEach(agent => agents.set(agent.id, agent));
class AIBridgeService {
    constructor() {
        this.requestCounter = 0;
    }
    generateRequestId() {
        return `req-${Date.now()}-${++this.requestCounter}`;
    }
    async createRequest(input) {
        const agent = agents.get(input.agentId);
        if (!agent) {
            throw new Error('Agent not found');
        }
        if (!agent.isActive) {
            throw new Error('Agent is not active');
        }
        // Get pricing based on tier
        const estimatedCost = agent.pricing[input.tier];
        // Create request
        const request = {
            id: this.generateRequestId(),
            userAddress: input.userAddress.toLowerCase(),
            agentId: input.agentId,
            prompt: input.prompt,
            tier: input.tier,
            maxTokens: input.maxTokens,
            status: 'pending',
            estimatedCost,
            createdAt: Date.now()
        };
        requests.set(request.id, request);
        // Track user's requests
        const userReqs = userRequests.get(input.userAddress.toLowerCase()) || [];
        userReqs.push(request.id);
        userRequests.set(input.userAddress.toLowerCase(), userReqs);
        // Simulate async processing
        this.processRequest(request.id);
        return request;
    }
    async processRequest(requestId) {
        const request = requests.get(requestId);
        if (!request)
            return;
        // Simulate processing delay
        setTimeout(async () => {
            const currentRequest = requests.get(requestId);
            if (!currentRequest || currentRequest.status === 'cancelled')
                return;
            // Update status to processing
            currentRequest.status = 'processing';
            requests.set(requestId, currentRequest);
            // Simulate AI processing
            try {
                // In production, this would call actual AI API
                const result = await this.simulateAIResponse(currentRequest);
                currentRequest.status = 'completed';
                currentRequest.result = result;
                currentRequest.actualCost = currentRequest.estimatedCost;
                currentRequest.completedAt = Date.now();
                // Update agent stats
                const agent = agents.get(currentRequest.agentId);
                if (agent) {
                    agent.totalRequests++;
                }
            }
            catch (error) {
                currentRequest.status = 'failed';
                currentRequest.error = error instanceof Error ? error.message : 'Unknown error';
                currentRequest.completedAt = Date.now();
            }
            requests.set(requestId, currentRequest);
        }, 2000 + Math.random() * 3000); // 2-5 second delay
    }
    async simulateAIResponse(request) {
        // Simulated AI response based on prompt
        const responses = {
            basic: `Processed your request with ${request.maxTokens} tokens. This is a simulated response for demonstration purposes.`,
            advanced: `Advanced AI processing complete. Generated response with high complexity analysis. Tokens used: ${Math.floor(request.maxTokens * 0.8)}`
        };
        return responses[request.tier] || responses.basic;
    }
    async getRequest(requestId) {
        return requests.get(requestId);
    }
    async getUserRequests(userAddress) {
        const requestIds = userRequests.get(userAddress.toLowerCase()) || [];
        return requestIds.map(id => requests.get(id)).filter((r) => r !== undefined);
    }
    async getAgents() {
        return Array.from(agents.values()).filter(a => a.isActive);
    }
    async getAgent(agentId) {
        return agents.get(agentId);
    }
    async registerAgent(input) {
        const agent = {
            id: `agent-${Date.now()}`,
            name: input.name || 'New Agent',
            description: input.description || '',
            model: input.model || 'gpt-4',
            pricing: input.pricing || { basic: '1', advanced: '10' },
            capabilities: input.capabilities || [],
            owner: input.owner || '',
            isActive: true,
            totalRequests: 0,
            rating: 0
        };
        agents.set(agent.id, agent);
        return agent;
    }
    async cancelRequest(requestId) {
        const request = requests.get(requestId);
        if (!request)
            return false;
        if (request.status !== 'pending' && request.status !== 'processing') {
            return false;
        }
        request.status = 'cancelled';
        request.completedAt = Date.now();
        requests.set(requestId, request);
        return true;
    }
    async getRequestHistory(limit = 50) {
        return Array.from(requests.values())
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, limit);
    }
    async getAgentStats(agentId) {
        const agentRequests = Array.from(requests.values()).filter(r => r.agentId === agentId);
        const completed = agentRequests.filter(r => r.status === 'completed');
        const failed = agentRequests.filter(r => r.status === 'failed');
        const responseTimes = agentRequests
            .filter(r => r.completedAt)
            .map(r => r.completedAt - r.createdAt);
        return {
            totalRequests: agentRequests.length,
            successRate: agentRequests.length > 0 ? completed.length / agentRequests.length : 0,
            avgResponseTime: responseTimes.length > 0
                ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
                : 0
        };
    }
}
exports.aiBridgeService = new AIBridgeService();
//# sourceMappingURL=ai-bridge.js.map