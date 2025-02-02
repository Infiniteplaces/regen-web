import {
  QueryClientImpl,
  QueryDenomTraceResponse,
  QueryDenomTracesResponse,
} from '@regen-network/api/lib/generated/ibc/applications/transfer/v1/query';
import { DenomTrace } from '@regen-network/api/lib/generated/ibc/applications/transfer/v1/transfer';

import { connect as connectToApi } from '../../../ledger';

const getQueryClient = async (): Promise<QueryClientImpl> => {
  const api = await connectToApi();
  if (!api || !api?.queryClient) return Promise.reject();
  return new QueryClientImpl(api.queryClient);
};

export const queryDenomTrace = async (
  hash: string,
): Promise<QueryDenomTraceResponse> => {
  const client = await getQueryClient();
  try {
    return client.DenomTrace({ hash });
  } catch (err) {
    throw new Error(
      `Error fetching denom trace with hash: ${hash}, err: ${err}`,
    );
  }
};

export const queryDenomTraces = async (): Promise<QueryDenomTracesResponse> => {
  const client = await getQueryClient();
  try {
    return client.DenomTraces({});
  } catch (err) {
    throw new Error(`Error fetching denom traces, err: ${err}`);
  }
};

type QueryDenomTraceByHashesParams = {
  hashes: string[];
};
type DenomTraceWithHash = DenomTrace & { hash: string };

export const queryDenomTraceByHashes = async ({
  hashes,
}: QueryDenomTraceByHashesParams): Promise<DenomTraceWithHash[]> => {
  const denomTraces = await Promise.all(
    hashes.map(async hash => {
      const { denomTrace } = await queryDenomTrace(hash);

      return denomTrace ? { ...denomTrace, hash } : undefined;
    }),
  );

  return denomTraces
    .flat()
    .filter((trace): trace is DenomTraceWithHash => trace !== undefined);
};
