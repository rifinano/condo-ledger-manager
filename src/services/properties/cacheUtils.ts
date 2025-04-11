
/**
 * Cache mechanism for frequently accessed property data
 */
export interface PropertyCache {
  blocks: any[] | null;
  apartments: Record<string, any[]>;
  residents: Record<string, any>;
  lastFetch: {
    blocks: number;
    apartments: Record<string, number>;
    residents: Record<string, number>;
  };
}

// Cache expiration time (5 minutes)
export const CACHE_EXPIRATION = 5 * 60 * 1000;

// Initialize the cache
export const createCache = (): PropertyCache => ({
  blocks: null,
  apartments: {},
  residents: {},
  lastFetch: {
    blocks: 0,
    apartments: {},
    residents: {}
  }
});

// Create a global cache instance
export const cache = createCache();

// Function to check if cached data is still valid
export const isCacheValid = (timestamp: number): boolean => {
  const now = Date.now();
  return timestamp > 0 && (now - timestamp) < CACHE_EXPIRATION;
};

// Function to clear all cache
export const clearCache = (): void => {
  if (typeof window !== 'undefined') {
    const propertiesServiceCache = (window as any).__propertiesCache;
    if (propertiesServiceCache) {
      // Reset all cache properties
      Object.keys(propertiesServiceCache).forEach(key => {
        if (typeof propertiesServiceCache[key] === 'object' && propertiesServiceCache[key] !== null) {
          if (Array.isArray(propertiesServiceCache[key])) {
            propertiesServiceCache[key] = [];
          } else {
            propertiesServiceCache[key] = {};
          }
        } else {
          propertiesServiceCache[key] = null;
        }
      });
    }
  }
  
  // Reset our local cache
  cache.blocks = null;
  cache.apartments = {};
  cache.residents = {};
  cache.lastFetch.blocks = 0;
  cache.lastFetch.apartments = {};
  cache.lastFetch.residents = {};
};

// Expose cache as a global for window access
if (typeof window !== 'undefined') {
  (window as any).__propertiesCache = cache;
}
