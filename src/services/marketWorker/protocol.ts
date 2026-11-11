import type { Asset, AssetTick } from '../../interfaces/market';

export const MARKET_WORKER_NAME = 'marketWorker';

// main thread → worker
export enum WORKER_COMMAND {
  CONNECT = 'connect',
}

export type WorkerCommand =
  | { type: WORKER_COMMAND.CONNECT; url: string };

// worker → main thread
export enum WORKER_EVENT {
  SNAPSHOT = 'snapshot',
  TICKS = 'ticks',
  CLOSED = 'closed',
}

export type WorkerEvent =
  | { type: WORKER_EVENT.SNAPSHOT; assets: Asset[] }
  | { type: WORKER_EVENT.TICKS; ticks: AssetTick[] }
  | { type: WORKER_EVENT.CLOSED };
