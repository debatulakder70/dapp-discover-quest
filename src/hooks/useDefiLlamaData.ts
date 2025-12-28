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
  uniswap: 'uniswap',
  '1inch': '1inch-network',
  jupiter: 'jupiter',
  pancakeswap: 'pancakeswap',
  sushiswap: 'sushiswap',
  aave: 'aave',
  compound: 'compound-finance',
  makerdao: 'makerdao',
  lido: 'lido',
  curve: 'curve-dex',
  convex: 'convex-finance',
  yearn: 'yearn-finance',
  gmx: 'gmx',
  dydx: 'dydx',
  hyperliquid: 'hyperliquid',
  stargate: 'stargate',
  hop: 'hop-protocol',
  across: 'across',
  synthetix: 'synthetix',
  frax: 'frax',
  balancer: 'balancer',
  instadapp: 'instadapp',
  euler: 'euler',
  morpho: 'morpho',
  radiant: 'radiant',
  pendle: 'pendle',
  eigenlayer: 'eigenlayer',
  rocketpool: 'rocket-pool',
  etherfi: 'ether.fi',
  'axie-infinity': 'axie-infinity',
  sandbox: 'the-sandbox',
  decentraland: 'decentraland',
  opensea: 'opensea',
  blur: 'blur',
  chainlink: 'chainlink',
  thegraph: 'the-graph',
  filecoin: 'filecoin',
  arweave: 'arweave',
  nexusmutual: 'nexus-mutual',
  insurace: 'insurace',
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
