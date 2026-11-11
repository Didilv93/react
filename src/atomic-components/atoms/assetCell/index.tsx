import type { ICellRendererParams } from 'ag-grid-community';
import { memo } from 'react';
import { useAssetField } from '../../../hooks/useMarket';
import { Asset, AssetId } from '../../../interfaces/market';

export interface AssetRow {
  id: AssetId;
}

export type AssetCellProps = ICellRendererParams<AssetRow> & { field: keyof Asset };

const AssetCell = ({ data, field }: AssetCellProps): React.JSX.Element | null => {
  const value = useAssetField(data?.id ?? '', field);
  return value === undefined ? null : <>{value}</>;
};

// The grid hands a new params object on its own refreshes; the cell only depends on id + field.
export default memo(AssetCell, (prev, next) => prev.data?.id === next.data?.id && prev.field === next.field);
