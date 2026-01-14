import NodeCache from 'node-cache';
import { logger } from '../utils/logger';

export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 600, // 10 minutes default
      checkperiod: 120, // Check for expired keys every 2 minutes
      useClones: false,
    });

    this.cache.on('expired', (key: string, value: any) => {
      logger.debug(`Cache key expired: ${key}`);
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = this.cache.get<T>(key);
    return value || null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    return this.cache.set(key, value, ttl || 600);
  }

  async del(key: string): Promise<number> {
    return this.cache.del(key);
  }

  async clear(): Promise<void> {
    this.cache.flushAll();
  }

  async getStats(): Promise<{
    hits: number;
    misses: number;
    keys: number;
  }> {
    const stats = this.cache.getStats();
    return {
      hits: stats.hits,
      misses: stats.misses,
      keys: this.cache.keys().length,
    };
  }
}