import { AllCommunityModule } from 'ag-grid-community';
import { AgGridProvider } from 'ag-grid-react';
import useMarketFeed from './hooks/useMarketFeed';
import MarketFeedStatus from './atomic-components/molecules/marketFeedStatus';

const modules = [AllCommunityModule];

export default (): React.JSX.Element => {
  useMarketFeed();

  return (
    <div style={{ height: '100vh', display: 'flex', width: '100%' }}>
      <AgGridProvider modules={modules}>
        <MarketFeedStatus />
      </AgGridProvider>
    </div>
  );
};
