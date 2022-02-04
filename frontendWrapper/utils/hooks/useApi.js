import { useState } from 'react';
import useDeepEffect from './useDeepEffect';
import request from '../request';

const useApi = (config, searchParams) => {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = () => request({
    ...config,
    searchParams,
    callback: (status, response) => {
      if (status === 'ok') {
        setData(response.data)
      } else {
        setFetchError(response.message)
      }

      setLoading(false);
    },
  });

  useDeepEffect(() => {
    setLoading(true);
    fetchData();
  }, [config, searchParams]);

  return { loading, data, fetchError, refetch: fetchData }
};

export default useApi;
