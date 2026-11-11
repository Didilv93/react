import { useEffect } from 'react';
import marketSocket from '../services/marketSocket';

export default (url?: string): void => {
  useEffect(() => {
    marketSocket.connect(url);
    return () => marketSocket.disconnect();
  }, [url]);
};
