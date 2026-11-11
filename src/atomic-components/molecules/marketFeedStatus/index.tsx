import { AgGridReact } from "ag-grid-react";
import type { ColDef, GetRowIdParams } from "ag-grid-community";
import { useMemo } from "react";
import AssetCell, { AssetRow } from "../../atoms/assetCell";
import { useAssetIds } from '../../../hooks/useMarket';
import { Asset } from "../../../interfaces/market";
import { useMarketStore } from "../../../store/market";

const defaultColDef = {
  flex: 1,
};

const COLUMNS: { field: keyof Asset; headerName: string }[] = [
  { field: 'id', headerName: 'Code' },
  { field: 'symbol', headerName: 'Symbol' },
  { field: 'name', headerName: 'Name' },
  { field: 'assetClass', headerName: 'Asset Class' },
  { field: 'exchange', headerName: 'Exchange' },
  { field: 'currency', headerName: 'Currency' },
  { field: 'price', headerName: 'Price' },
  { field: 'bid', headerName: 'Bid' },
  { field: 'ask', headerName: 'Ask' },
  { field: 'open', headerName: 'Open' },
  { field: 'high', headerName: 'High' },
  { field: 'low', headerName: 'Low' },
  { field: 'previousClose', headerName: 'Previous Close' },
  { field: 'change', headerName: 'Change' },
  { field: 'changePercent', headerName: 'Change Percent' },
  { field: 'volume', headerName: 'Volume' },
  { field: 'updatedAt', headerName: 'Updated At' },
];

// Rows carry only the id; each cell reads its own field from the store.
// valueGetter reads the store at call time so sort/filter work, but the grid
// does not re-sort on ticks — it only sees new values when it asks again.
const columnDefs: ColDef<AssetRow>[] = COLUMNS.map(({ field, headerName }) => ({
  colId: field,
  headerName,
  cellRenderer: AssetCell,
  cellRendererParams: { field },
  valueGetter: ({ data }) => (data ? useMarketStore.getState().assets.get(data.id)?.[field] : undefined),
}));

const getRowId = ({ data }: GetRowIdParams<AssetRow>): string => data.id;

export default (): React.JSX.Element => {
  const ids = useAssetIds();
  const rowData = useMemo<AssetRow[]>(() => ids.map((id) => ({ id })), [ids]);

  return (
    <AgGridReact<AssetRow>
      rowData={rowData}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      getRowId={getRowId}
    />
  );
};
