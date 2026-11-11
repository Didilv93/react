import type { ServerMessage } from '../../interfaces/market';
import { WORKER_COMMAND, WORKER_EVENT, type WorkerCommand, type WorkerEvent } from './protocol';
import TickBuffer from './tickBuffer';

const FLUSH_INTERVAL_MS = 500;

interface WorkerScope {
  onmessage: ((event: MessageEvent<WorkerCommand>) => void) | null;
  postMessage(event: WorkerEvent): void;
}

const scope = self as unknown as WorkerScope;
const tickBuffer = new TickBuffer();

function post(event: WorkerEvent): void {
  scope.postMessage(event);
}

function flush(): void {
  if (tickBuffer.size === 0) return;
  post({ type: WORKER_EVENT.TICKS, ticks: tickBuffer.drain() });
}

function handleServerMessage(message: ServerMessage): void {
  switch (message.type) {
    case 'snapshot':
      tickBuffer.clear();
      post({ type: WORKER_EVENT.SNAPSHOT, assets: message.assets });
      break;
    case 'ticks':
      tickBuffer.add(message.ticks);
      break;
  }
}

function connect(url: string): void {
  const socket = new WebSocket(url);
  const timer = setInterval(flush, FLUSH_INTERVAL_MS);

  socket.onmessage = (event: MessageEvent<string>) => {
    handleServerMessage(JSON.parse(event.data) as ServerMessage);
  };
  socket.onclose = () => {
    clearInterval(timer);
    flush();
    post({ type: WORKER_EVENT.CLOSED });
  };
}

scope.onmessage = (event) => {
  const command = event.data;
  switch (command.type) {
    case WORKER_COMMAND.CONNECT:
      connect(command.url);
      break;
  }
};
