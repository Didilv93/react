import { ServerMessage } from '../interfaces/market';
import { useMarketStore } from '../store/market';

const MARKET_WS_URL = 'ws://localhost:8090';

class MarketSocketService {
  private static instance: MarketSocketService;
  private socket: WebSocket | null = null;
  private constructor() { }

  connect(url: string = MARKET_WS_URL): void {
    if (this.socket) return;

    const socket = new WebSocket(url);
    this.socket = socket;

    // A socket replaced by a newer connection must not write to the store.
    socket.onmessage = (event: MessageEvent<string>) => {
      if (this.socket === socket) this.handleMessage(JSON.parse(event.data) as ServerMessage);
    };
    socket.onclose = () => {
      if (this.socket === socket) this.socket = null;
    };
  }

  disconnect(): void {
    this.socket?.close();
    this.socket = null;
  }

  private handleMessage(message: ServerMessage): void {
    const { applySnapshot, applyTicks } = useMarketStore.getState();
    switch (message.type) {
      case 'snapshot':
        applySnapshot(message.assets);
        break;
      case 'ticks':
        applyTicks(message.ticks);
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
