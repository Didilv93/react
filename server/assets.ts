import type { Asset, AssetClass, AssetTick, Currency } from '../src/interfaces/market';

interface ClassProfile {
  exchange: string;
  currency: Currency;
  minPrice: number;
  maxPrice: number;
  volatility: number;
}

const PROFILES: Record<AssetClass, ClassProfile> = {
  stock: { exchange: 'B3', currency: 'BRL', minPrice: 2, maxPrice: 120, volatility: 0.002 },
  etf: { exchange: 'NYSE', currency: 'USD', minPrice: 20, maxPrice: 600, volatility: 0.001 },
  crypto: { exchange: 'BINANCE', currency: 'USD', minPrice: 0.05, maxPrice: 90000, volatility: 0.006 },
  fx: { exchange: 'FX', currency: 'BRL', minPrice: 0.5, maxPrice: 7, volatility: 0.0005 },
  commodity: { exchange: 'CME', currency: 'USD', minPrice: 2, maxPrice: 2500, volatility: 0.0015 },
};

const CLASSES = Object.keys(PROFILES) as AssetClass[];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const randomBetween = (min: number, max: number): number => min + Math.random() * (max - min);
const round = (value: number, digits = 4): number => Number(value.toFixed(digits));

const buildSymbol = (index: number): string => {
  let n = index;
  let symbol = '';
  for (let i = 0; i < 4; i++) {
    symbol = LETTERS[n % 26] + symbol;
    n = Math.floor(n / 26);
  }
  return symbol;
};

export const generateAssets = (count: number): Asset[] => {
  const now = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const assetClass = CLASSES[index % CLASSES.length];
    const profile = PROFILES[assetClass];
    const previousClose = round(randomBetween(profile.minPrice, profile.maxPrice));
    const symbol = buildSymbol(index);
    const spread = previousClose * 0.0005;

    return {
      id: `${assetClass}-${symbol}`,
      symbol,
      name: `${symbol} ${assetClass.toUpperCase()}`,
      assetClass,
      exchange: profile.exchange,
      currency: profile.currency,
      price: previousClose,
      bid: round(previousClose - spread),
      ask: round(previousClose + spread),
      open: previousClose,
      high: previousClose,
      low: previousClose,
      previousClose,
      change: 0,
      changePercent: 0,
      volume: 0,
      updatedAt: now,
    };
  });
};

// Mutates the asset in place: the server is the source of truth and only ships the delta.
export const nextTick = (asset: Asset, now: number): AssetTick => {
  const { volatility } = PROFILES[asset.assetClass];
  const price = round(Math.max(asset.price * (1 + randomBetween(-volatility, volatility)), 0.0001));
  const spread = price * randomBetween(0.0002, 0.001);

  asset.price = price;
  asset.bid = round(price - spread);
  asset.ask = round(price + spread);
  asset.high = Math.max(asset.high, price);
  asset.low = Math.min(asset.low, price);
  asset.change = round(price - asset.previousClose);
  asset.changePercent = round((asset.change / asset.previousClose) * 100, 2);
  asset.volume += Math.floor(randomBetween(1, 1000));
  asset.updatedAt = now;

  const { id, bid, ask, high, low, change, changePercent, volume, updatedAt } = asset;
  return { id, price, bid, ask, high, low, change, changePercent, volume, updatedAt };
};

export const pickRandom = <T>(items: T[], amount: number): T[] => {
  const picked = new Set<T>();
  const target = Math.min(amount, items.length);
  while (picked.size < target) {
    picked.add(items[Math.floor(Math.random() * items.length)]);
  }
  return [...picked];
};
