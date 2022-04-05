import { useState, useEffect } from 'react';

import { useLedger } from '../ledger';

type QueryLedgerProps = {
  queryType: 'bank' | 'ecocredit' | 'basket';
  queryCallback: ({ client, args }: any) => Promise<any>;
  queryParams?: any;
};

export default function useQueryLedger({
  queryType,
  queryCallback,
  queryParams,
}: QueryLedgerProps): any | undefined {
  const { queryClients } = useLedger();
  const [data, setData] = useState<any | undefined>();
  // const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    if (!queryClients) return;

    queryCallback({
      client: queryClients[queryType],
      ...queryParams,
    }).then(setData);
  }, [queryClients, queryType, queryCallback, queryParams]);

  return data;
}
