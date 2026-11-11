import type { AssetId, AssetTick } from '../../interfaces/market';

class TickBuffer {
  private readonly buffer: Map<AssetId, AssetTick> = new Map();

  add(ticks: AssetTick[]): void {
    for (const tick of ticks) {
      this.buffer.set(tick.id, tick);
    }
  }
  clear(): void { this.buffer.clear(); }
  drain(): AssetTick[] {
    const ticks = Array.from(this.buffer.values());
    this.clear();
    return ticks;
  }
  get size(): number { return this.buffer.size; }
}

export default TickBuffer;