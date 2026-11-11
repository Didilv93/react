import { WebSocketServer, WebSocket } from 'ws';
import type { ServerMessage } from '../src/interfaces/market';
import { generateAssets, nextTick, pickRandom } from './assets.ts';

const readNumber = (name: string, fallback: number): number => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const PORT = readNumber('PORT', 8080);
const ASSET_COUNT = readNumber('ASSET_COUNT', 5000);
const BATCH_SIZE = readNumber('BATCH_SIZE', 250);
const TICK_MS = readNumber('TICK_MS', 100);
const WARMUP_MS = readNumber('WARMUP_MS', 3000);

// One shared market ticking once for everyone; ticks carry absolute values,
// so a client that joins late only needs the snapshot to be consistent.
const assets = generateAssets(ASSET_COUNT);
const streaming = new Set<WebSocket>();
let seq = 0;

const encode = (message: ServerMessage): string => JSON.stringify(message);

const server = new WebSocketServer({ port: PORT });

server.on('connection', (socket) => {
  console.log(`client connected (${server.clients.size} total)`);
  socket.send(encode({ type: 'snapshot', serverTime: Date.now(), assets }));

  const warmup = setTimeout(() => streaming.add(socket), WARMUP_MS);

  socket.on('close', () => {
    clearTimeout(warmup);
    streaming.delete(socket);
    console.log(`client disconnected (${server.clients.size} total)`);
  });
});

setInterval(() => {
  const now = Date.now();
  const ticks = pickRandom(assets, BATCH_SIZE).map((asset) => nextTick(asset, now));
  if (streaming.size === 0) return;

  const payload = encode({ type: 'ticks', seq: ++seq, serverTime: now, ticks });
  for (const socket of streaming) {
    if (socket.readyState === WebSocket.OPEN) socket.send(payload);
  }
}, TICK_MS);

console.log(
  `market mock listening on port ${PORT} | assets=${ASSET_COUNT} batch=${BATCH_SIZE} tick=${TICK_MS}ms warmup=${WARMUP_MS}ms`,
);
