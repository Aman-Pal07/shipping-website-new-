class RateLimiter {
  private static instance: RateLimiter;
  private requestQueue: Map<string, number[]> = new Map();
  private readonly MAX_REQUESTS = 5; // Max requests
  private readonly TIME_WINDOW = 15000; // 15 seconds

  private constructor() {}

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  canMakeRequest(endpoint: string): boolean {
    const now = Date.now();
    const endpointRequests = this.requestQueue.get(endpoint) || [];
    
    // Remove requests older than TIME_WINDOW
    const recentRequests = endpointRequests.filter(
      (timestamp) => now - timestamp < this.TIME_WINDOW
    );

    if (recentRequests.length >= this.MAX_REQUESTS) {
      return false;
    }

    recentRequests.push(now);
    this.requestQueue.set(endpoint, recentRequests);
    return true;
  }

  getRemainingTime(endpoint: string): number {
    const now = Date.now();
    const endpointRequests = this.requestQueue.get(endpoint) || [];
    const oldestRequest = endpointRequests[0] || now;
    return this.TIME_WINDOW - (now - oldestRequest);
  }

  // Clear rate limit for a specific endpoint
  clearRateLimit(endpoint: string): void {
    this.requestQueue.delete(endpoint);
  }
}

export const rateLimiter = RateLimiter.getInstance();
