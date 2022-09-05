import {
  BatchInfo,
  QueryBatchResponse,
} from '@regen-network/api/lib/generated/regen/ecocredit/v1/query';

import { Item } from 'web-components/lib/components/modal/ConfirmModal';

import { NormalizedSellOrder } from './Storefront.types';

export const sortBySellOrderId = (
  sellOrderA: NormalizedSellOrder,
  sellOrderB: NormalizedSellOrder,
): number => {
  if (sellOrderA.id && sellOrderB.id) {
    return Number(sellOrderA.id) > Number(sellOrderB.id) ? 1 : -1;
  }

  return 0;
};

export const getCancelCardItems = ({
  id,
  amountAvailable,
  batchDenom,
}: NormalizedSellOrder): Item[] => [
  { label: 'sell order id:', value: { name: String(id) } },
  { label: 'quantity:', value: { name: String(amountAvailable) } },
  {
    label: 'batch denom:',
    value: {
      name: 'C01-20190101-20201010-003',
      url: `/credit-batches/${batchDenom}`,
    },
  },
];

type UpdateBatchInfosMapParams = {
  batchInfosMap: Map<string, BatchInfo>;
  batchInfoResponses?: QueryBatchResponse[] | undefined;
};

export const updateBatchInfosMap = ({
  batchInfosMap,
  batchInfoResponses,
}: UpdateBatchInfosMapParams): BatchInfo[] => {
  batchInfoResponses?.forEach(({ batch }) => {
    if (batch) {
      batchInfosMap.set(batch?.denom, batch);
    }
  });

  return Array.from(batchInfosMap?.values());
};