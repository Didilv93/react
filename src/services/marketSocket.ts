import { useMarketStore } from '../store/market';
import {
  MARKET_WORKER_NAME,
  WORKER_COMMAND,
  WORKER_EVENT,
  type WorkerCommand,
  type WorkerEvent,
} from './marketWorker/protocol';

const MARKET_WS_URL = 'ws://localhost:8090';

class MarketSocketService {
  private static instance: MarketSocketService;
  private worker: Worker | null = null;
  private constructor() { }

  connect(url: string = MARKET_WS_URL): void {
    if (this.worker) return;

    const worker = new Worker(new URL('./marketWorker/worker.ts', import.meta.url), {
      type: 'module',
      name: MARKET_WORKER_NAME,
    });
    this.worker = worker;

    // Events already queued by a terminated worker must not write to the store.
    worker.onmessage = (event: MessageEvent<WorkerEvent>) => {
      if (this.worker === worker) this.handleEvent(event.data);
    };
    this.send({ type: WORKER_COMMAND.CONNECT, url });
  }

  // Terminating the worker also closes the socket it owns.
  disconnect(): void {
    this.worker?.terminate();
    this.worker = null;
  }

  private send(command: WorkerCommand): void {
    this.worker?.postMessage(command);
  }

  private handleEvent(event: WorkerEvent): void {
    const { applySnapshot, applyTicks } = useMarketStore.getState();
    switch (event.type) {
      case WORKER_EVENT.SNAPSHOT:
        applySnapshot(event.assets);
        break;
      case WORKER_EVENT.TICKS:
        applyTicks(event.ticks);
        break;
      case WORKER_EVENT.CLOSED:
        this.disconnect();
        break;
    }
  }

  static getInstance(): MarketSocketService {
    if (!MarketSocketService.instance) {
      MarketSocketService.instance = new MarketSocketService();
    }
    return MarketSocketService.instance;
  }
}

export default MarketSocketService.getInstance();
