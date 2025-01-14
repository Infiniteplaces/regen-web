import { QueryBatchesResponse } from '@regen-network/api/lib/generated/regen/ecocredit/v1/query';

import { BatchInfoWithSupply } from 'types/ledger/ecocredit';
import { AddDataToBatchParams, QueryBatchesProps } from 'lib/ecocredit/api';

/* BatchesQuery */

export type ReactQueryBatchesProps = Omit<QueryBatchesProps, 'client'> & {
  client?: QueryBatchesProps['client'];
  enabled: boolean;
};

export type ReactQueryBatchesResponse = {
  queryKey: string[];
  queryFn: () => Promise<QueryBatchesResponse | void>;
  enabled: boolean;
  keepPreviousData: boolean;
  staleTime: number;
};

/* AddDataToBatchesQuery */

export type ReactQueryAddDataToBatchParams = Omit<
  AddDataToBatchParams,
  'batches'
> & {
  batches?: AddDataToBatchParams['batches'];
} & { enabled?: boolean };

export type ReactQueryAddDataToBatchesResponse = {
  queryKey?: string[];
  queryFn: () => Promise<BatchInfoWithSupply[] | void>;
  staleTime: number;
  enabled: boolean;
};
