import { Asset, AssetId } from '../interfaces/market';
import { useMarketStore } from '../store/market';

export const useAssetIds = (): AssetId[] => useMarketStore((state) => state.ids);

export const useAsset = (id: AssetId): Asset | undefined => useMarketStore((state) => state.assets.get(id));

// Selecting a primitive: the consumer re-renders only when this field of this asset changes.
export const useAssetField = <K extends keyof Asset>(id: AssetId, field: K): Asset[K] | undefined =>
  useMarketStore((state) => state.assets.get(id)?.[field]);
