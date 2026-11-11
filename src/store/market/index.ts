import { create } from 'zustand';
import { Asset, AssetId, AssetTick } from '../../interfaces/market';

interface MarketStore {
  // Treated as immutable: every write builds a new Map, since zustand only notifies on a new reference.
  assets: ReadonlyMap<AssetId, Asset>;
  // Row order from the snapshot; ticks never add or remove assets, so it only changes there.
  ids: AssetId[];
  applySnapshot: (assets: Asset[]) => void;
  applyTicks: (ticks: AssetTick[]) => void;
}

export const useMarketStore = create<MarketStore>()((set) => ({
  assets: new Map(),
  ids: [],

  applySnapshot: (snapshot) => set({
    assets: new Map(snapshot.map((asset) => [asset.id, asset])),
    ids: snapshot.map((asset) => asset.id),
  }),

  // Only ticked assets get a new reference; selectors on untouched ones keep their value.
  applyTicks: (ticks) => set((state) => {
    const assets = new Map(state.assets);
    for (const tick of ticks) {
      const current = assets.get(tick.id);
      if (current) assets.set(tick.id, { ...current, ...tick });
    }
    return { assets };
  }),
}));
