import { Box } from '@mui/material';
import { QueryAllowedDenomsResponse } from '@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/query';
import { quantityFormatNumberOptions } from 'config/decimals';
import { floorFloatNumber } from 'utils/number/format/format';

import { Option } from 'web-components/lib/components/inputs/SelectTextField';
import { formatNumber } from 'web-components/lib/utils/format';

import { microToDenom } from 'lib/denom.utils';

import { UISellOrderInfo } from 'pages/Projects/Projects.types';
import { findDisplayDenom } from 'components/molecules/DenomLabel/DenomLabel.utils';

import { BuyCreditsProject, BuyCreditsValues } from '..';

/* sortBySellOrderId */

const sortBySellOrderId = (
  sellOrderA: UISellOrderInfo,
  sellOrderB: UISellOrderInfo,
): number => {
  if (sellOrderA.id && sellOrderB.id) {
    return Number(sellOrderA.id) < Number(sellOrderB.id) ? 1 : -1;
  }

  return 0;
};

/* getSellOrderLabel */

type GetSellOrderLabelParams = {
  sellOrder: UISellOrderInfo;
  allowedDenomsData?: QueryAllowedDenomsResponse;
};
export const getSellOrderLabel = ({
  sellOrder,
  allowedDenomsData,
}: GetSellOrderLabelParams): JSX.Element => {
  const { id, askAmount, askDenom, quantity } = {
    ...sellOrder,
  };
  const price = microToDenom(askAmount);
  const displayDenom = findDisplayDenom({
    allowedDenomsData,
    denom: askDenom,
  });
  const truncatedQuantity = floorFloatNumber(parseFloat(quantity));
  return (
    <Box sx={{ ml: 4 }}>
      <Box
        sx={{ display: 'inline', fontWeight: 700 }}
      >{`${price} ${displayDenom}/credit: `}</Box>
      <Box
        sx={{ display: 'inline', mr: 1 }}
      >{`${truncatedQuantity} credit(s) available`}</Box>
      <Box sx={{ display: 'inline', color: 'info.main' }}>{`(#${id})`}</Box>
    </Box>
  );
};

/* getSellOrdersOptions */

type GetSellOrdersOptionsParams = {
  sellOrders: UISellOrderInfo[];
  allowedDenomsData?: QueryAllowedDenomsResponse;
};
const getSellOrdersOptions = ({
  sellOrders,
  allowedDenomsData,
}: GetSellOrdersOptionsParams): Option[] => {
  return sellOrders.map(sellOrder => ({
    label: getSellOrderLabel({ sellOrder, allowedDenomsData }),
    value: sellOrder.id,
  }));
};

/* getOptions */

type GetOptionsParams = {
  project: BuyCreditsProject;
  allowedDenomsData?: QueryAllowedDenomsResponse;
};
export const getOptions = ({
  project,
  allowedDenomsData,
}: GetOptionsParams): Option[] => {
  if (!project?.sellOrders?.length) return [];

  const retirableSellOrders = project.sellOrders
    .filter(sellOrder => !sellOrder.disableAutoRetire)
    .sort(sortBySellOrderId);
  const retirableAndTradableSellOrders = project.sellOrders
    .filter(sellOrder => sellOrder.disableAutoRetire)
    .sort(sortBySellOrderId);

  const retirableOptions = getSellOrdersOptions({
    sellOrders: retirableSellOrders,
    allowedDenomsData,
  });

  const retirableAndTradableOptions = getSellOrdersOptions({
    sellOrders: retirableAndTradableSellOrders,
    allowedDenomsData,
  });

  const allOptionsLength =
    retirableOptions.length + retirableAndTradableOptions.length;

  return allOptionsLength > 1
    ? [
        {
          label: <Box sx={{ color: 'info.main' }}>{'Choose a sell order'}</Box>,
          value: '',
          disabled: true,
        },
        {
          label: <Box sx={{ fontWeight: 700 }}>{'TRADABLE AND RETIRABLE'}</Box>,
          value: '',
          disabled: true,
        },
        ...retirableAndTradableOptions,
        {
          label: <Box sx={{ fontWeight: 700 }}>{'RETIRABLE ONLY'}</Box>,
          value: '',
          disabled: true,
        },
        ...retirableOptions,
      ]
    : retirableOptions.concat(retirableAndTradableOptions);
};

/* handleBuyCreditsSubmit */

export const handleBuyCreditsSubmit = async (
  values: BuyCreditsValues,
  onSubmit?: (values: BuyCreditsValues) => Promise<void>,
  selectedSellOrder?: UISellOrderInfo,
): Promise<void> => {
  if (!onSubmit || !selectedSellOrder) {
    throw new Error('onSubmit and selectedSellOrder are required');
  }
  const { country, postalCode, stateProvince, retirementAction } = values;

  const fullValues: BuyCreditsValues = {
    ...values,
    price: Number(selectedSellOrder.askAmount),
    askDenom: selectedSellOrder.askDenom,
    batchDenom: selectedSellOrder.batchDenom,
    sellOrderId: selectedSellOrder.id,
    country: retirementAction === 'autoretire' ? country : '',
    postalCode: retirementAction === 'autoretire' ? postalCode : '',
    stateProvince: retirementAction === 'autoretire' ? stateProvince : '',
  };
  await onSubmit(fullValues);
};

/* getCreditCountValidation */

export const getCreditCountValidation =
  (creditAvailable: number) => (creditCount: number) => {
    let error;
    if (creditCount > creditAvailable) {
      error = `Must be less than or equal to the max credit(s) available (${creditAvailable}).`;
    }
    return error;
  };

/* amountToSpend */

type AmountToSpendParams = {
  creditCount: number;
  askAmount?: string;
};

export const amountToSpend = ({
  creditCount,
  askAmount,
}: AmountToSpendParams): String =>
  formatNumber({
    num: creditCount * microToDenom(askAmount),
    ...quantityFormatNumberOptions,
  }) ?? '-';
