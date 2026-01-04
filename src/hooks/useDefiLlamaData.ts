import { useState, useEffect, useCallback } from 'react';

interface ProtocolData {
  tvl: number;
  change_1d: number;
  change_7d: number;
  volume24h?: number;
}

interface DefiLlamaCache {
  [key: string]: {
    data: ProtocolData;
    timestamp: number;
  };
}

// Protocol name mappings to DeFiLlama slugs
const protocolMappings: Record<string, string> = {
  // SWAP
  '1inch': '1inch-network',
  'jupiter': 'jupiter-aggregator',
  'uniswap-swap': 'uniswap',
  'pancakeswap-swap': 'pancakeswap',
  'lifi': 'li.fi',
  'rango': 'rango',
  'paraswap': 'paraswap',
  'sushixswap': 'sushiswap',
  'curve-swap': 'curve-dex',
  'raydium-swap': 'raydium',
  'aerodrome-swap': 'aerodrome',
  'stargate-swap': 'stargate',
  'orbiter-swap': 'orbiter-finance',
  'cow-swap': 'cow-swap',
  'kyberswap': 'kyberswap',
  
  // DEX
  'uniswap-dex': 'uniswap',
  'sushiswap-dex': 'sushiswap',
  'pancakeswap-dex': 'pancakeswap',
  'curve-dex': 'curve-dex',
  'raydium-dex': 'raydium',
  'orca-dex': 'orca',
  'dydx-dex': 'dydx',
  'aerodrome-dex': 'aerodrome',
  'meteora': 'meteora',
  'balancer-dex': 'balancer-v2',
  'trader-joe-dex': 'trader-joe',
  'syncswap': 'syncswap',
  'hyperliquid-dex': 'hyperliquid',
  'jupiter-dex': 'jupiter-aggregator',
  'camelot': 'camelot',
  
  // BRIDGE
  'stargate': 'stargate',
  'debridge': 'debridge',
  'across': 'across',
  'wormhole': 'wormhole',
  'synapse': 'synapse',
  'hop': 'hop-protocol',
  'layerswap': 'layerswap',
  'rhino': 'rhino.fi',
  'mayan': 'mayan-finance',
  'celer': 'celer',
  'orbiter': 'orbiter-finance',
  
  // DEFI
  'uniswap-defi': 'uniswap',
  'aave': 'aave',
  'makerdao': 'makerdao',
  'curve-defi': 'curve-dex',
  'lido': 'lido',
  'compound': 'compound-finance',
  'gmx': 'gmx',
  'rocket-pool': 'rocket-pool',
  'pendle': 'pendle',
  'ethena': 'ethena',
  
  // CROSS-CHAIN
  'layerzero': 'layerzero',
  'axelar': 'axelar',
  'chainlink-ccip': 'chainlink-ccip',
  'thorchain': 'thorchain',
  'maya': 'maya-protocol',
  'squid': 'squid',
  
  // PERPETUALS
  'hyperliquid-perp': 'hyperliquid',
  'dydx-perp': 'dydx',
  'gmx-perp': 'gmx',
  'jupiter-perps': 'jupiter-perps',
  'aevo': 'aevo',
  'vertex': 'vertex-protocol',
  'synthetix': 'synthetix',
  'drift': 'drift-protocol',
  'kwenta': 'kwenta',
  'bluefin': 'bluefin',
  'rabbitx': 'rabbitx',
  'level': 'level-finance',
  'mux': 'mux-protocol',
  'zeta': 'zeta',
  'gains': 'gains-network',
  
  // NFT
  'blur': 'blur',
  'opensea': 'opensea',
  'magic-eden': 'magic-eden',
  'tensor': 'tensor',
  'looksrare': 'looksrare',
  'x2y2': 'x2y2',
  'rarible': 'rarible',
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let globalCache: DefiLlamaCache = {};

export function useDefiLlamaData(protocolId: string) {
  const [data, setData] = useState<ProtocolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const slug = protocolMappings[protocolId.toLowerCase()];
    
    if (!slug) {
      setLoading(false);
      return;
    }

    // Check cache
    const cached = globalCache[slug];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setData(cached.data);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://api.llama.fi/protocol/${slug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const json = await response.json();
      
      const protocolData: ProtocolData = {
        tvl: json.tvl || 0,
        change_1d: json.change_1d || 0,
        change_7d: json.change_7d || 0,
        volume24h: json.volume24h,
      };

      // Update cache
      globalCache[slug] = {
        data: protocolData,
        timestamp: Date.now(),
      };

      setData(protocolData);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [protocolId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
}

export function formatTVL(tvl: number): string {
  if (tvl >= 1e9) {
    return `$${(tvl / 1e9).toFixed(2)}B`;
  }
  if (tvl >= 1e6) {
    return `$${(tvl / 1e6).toFixed(2)}M`;
  }
  if (tvl >= 1e3) {
    return `$${(tvl / 1e3).toFixed(2)}K`;
  }
  return `$${tvl.toFixed(2)}`;
}

export function formatChange(change: number): { text: string; isPositive: boolean } {
  const isPositive = change >= 0;
  return {
    text: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
    isPositive,
  };
}
