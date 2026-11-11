// Shared between the front-end and the mock server (server/). Keep it type-only:
// the server runs through Node's type stripping, which cannot emit enums.

export type AssetId = string;

export type AssetClass = 'stock' | 'etf' | 'crypto' | 'fx' | 'commodity';

export type Currency = 'BRL' | 'USD' | 'EUR';

export interface Asset {
  id: AssetId;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  exchange: string;
  currency: Currency;
  price: number;
  bid: number;
  ask: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  updatedAt: number;
}

export type AssetTick = Pick<
  Asset,
  'id' | 'price' | 'bid' | 'ask' | 'high' | 'low' | 'change' | 'changePercent' | 'volume' | 'updatedAt'
>;

export interface SnapshotMessage {
  type: 'snapshot';
  serverTime: number;
  assets: Asset[];
}

export interface TicksMessage {
  type: 'ticks';
  seq: number;
  serverTime: number;
  ticks: AssetTick[];
}

export type ServerMessage = SnapshotMessage | TicksMessage;
