export type AIRequestStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export interface AIRequest {
    id: string;
    userAddress: string;
    agentId: string;
    prompt: string;
    tier: 'basic' | 'advanced';
    maxTokens: number;
    status: AIRequestStatus;
    result?: string;
    error?: string;
    estimatedCost: string;
    actualCost?: string;
    createdAt: number;
    completedAt?: number;
}
export interface AIAgent {
    id: string;
    name: string;
    description: string;
    model: string;
    pricing: {
        basic: string;
        advanced: string;
    };
    capabilities: string[];
    owner: string;
    isActive: boolean;
    totalRequests: number;
    rating: number;
}
export interface CreateAIRequestInput {
    userAddress: string;
    agentId: string;
    prompt: string;
    tier: 'basic' | 'advanced';
    maxTokens: number;
}
declare class AIBridgeService {
    private requestCounter;
    generateRequestId(): string;
    createRequest(input: CreateAIRequestInput): Promise<AIRequest>;
    private processRequest;
    private simulateAIResponse;
    getRequest(requestId: string): Promise<AIRequest | undefined>;
    getUserRequests(userAddress: string): Promise<AIRequest[]>;
    getAgents(): Promise<AIAgent[]>;
    getAgent(agentId: string): Promise<AIAgent | undefined>;
    registerAgent(input: Partial<AIAgent>): Promise<AIAgent>;
    cancelRequest(requestId: string): Promise<boolean>;
    getRequestHistory(limit?: number): Promise<AIRequest[]>;
    getAgentStats(agentId: string): Promise<{
        totalRequests: number;
        successRate: number;
        avgResponseTime: number;
    }>;
}
export declare const aiBridgeService: AIBridgeService;
export {};
//# sourceMappingURL=ai-bridge.d.ts.map