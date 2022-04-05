import { useState, useEffect } from 'react';

import { QueryBasketResponse } from '@regen-network/api/lib/generated/regen/ecocredit/basket/v1/query';

import { useLedger } from '../ledger';
import { queryBasket } from '../lib/ecocredit';

export default function useQueryBasket(
  basketDenom?: string,
): QueryBasketResponse | undefined {
  const { queryClients } = useLedger();
  const [basket, setBasket] = useState<QueryBasketResponse>();

  useEffect(() => {
    if (!queryClients?.basket || !basketDenom) return;

    // eslint-disable-next-line no-console
    console.log('*** query basket');

    queryBasket({ client: queryClients.basket, basketDenom }).then(setBasket);
  }, [queryClients?.basket, basketDenom]);

  // eslint-disable-next-line no-console
  console.log('*** useQueryBasket', basket);

  return basket;
}
