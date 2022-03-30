import React, { useState } from 'react';
import { useTheme, makeStyles } from '@mui/styles';
import { BasketBalance } from '@regen-network/api/lib/generated/regen/ecocredit/basket/v1/types';

import ArrowDownIcon from 'web-components/lib/components/icons/ArrowDownIcon';
import { TableActionButtons } from 'web-components/lib/components/buttons/TableActionButtons';
import {
  TakeFromBasketModal,
  TakeModalProps,
} from '../components/molecules/TakeFromBasketModal';
import { Theme } from 'web-components/lib/theme/muiTheme';
import { useWallet } from '../lib/wallet';
import { PortfolioTemplate } from '../components/templates';
// import { ReactComponent as Sell } from '../assets/svgs/sell.svg';
import { ReactComponent as PutInBasket } from '../assets/svgs/put-in-basket.svg';
import { ReactComponent as TakeFromBasket } from '../assets/svgs/take-from-basket.svg';
// import { ReactComponent as WithdrawIBC } from '../assets/svgs/withdraw-ibc.svg';
// import { ReactComponent as DepositIBC } from '../assets/svgs/deposit-ibc.svg';
import useBasketTokens, { BasketTokens } from '../hooks/useBasketTokens';
import useTakeBasketTokens from '../hooks/useTakeBasketTokens';

const useStyles = makeStyles((theme: Theme) => ({
  arrow: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
}));

export const MyEcocredits: React.FC = () => {
  const theme = useTheme();
  const styles = useStyles();
  const walletContext = useWallet();
  const { signTake } = useTakeBasketTokens();
  const [selectedBasket, setSelectedBasket] = useState<any>(null);
  const accountAddress = walletContext.wallet?.address;
  const baskets = useBasketTokens(accountAddress);

  // const takeFromBasket = (rowIndex: number): void => {
  //   if (!accountAddress) return;
  //   const selectedRow = baskets[rowIndex];
  //   console.log(selectedRow, 'accountAddress ', accountAddress);
  //   // signTake(accountAddress, selectedRow.basket.basketDenom, 11);
  // };

  const openModal = (rowIndex: number): void => {
    if (!accountAddress) return;
    const selectedRow = baskets[rowIndex];
    console.log(selectedRow, 'accountAddress ', accountAddress);
    const basket = {
      basketDenom: selectedRow?.basket?.basketDenom,
      availableTradableAmount:
        parseInt(selectedRow?.balance?.balance?.amount || '0') /
        Math.pow(10, selectedRow.basket.exponent),
    };
    setSelectedBasket(basket);
  };

  return (
    <>
      <PortfolioTemplate
        accountAddress={accountAddress}
        renderCreditActionButtons={(i: number) => (
          <TableActionButtons
            buttons={[
              // Disabling for now until the marketplace is
              // released on regen-ledger
              // {
              //   icon: <Sell />,
              //   label: 'Sell',
              //   onClick: () => `TODO sell credit ${i}`,
              // },
              {
                icon: (
                  <ArrowDownIcon
                    className={styles.arrow}
                    color={theme.palette.secondary.main}
                    direction="next"
                  />
                ),
                label: 'Send',
                onClick: () => `TODO send credit ${i}`,
              },
              {
                icon: <PutInBasket />,
                label: 'Put in basket',
                onClick: () => `TODO put in basket${i}`,
              },
              {
                icon: (
                  <ArrowDownIcon
                    className={styles.arrow}
                    color={theme.palette.secondary.main}
                    direction="down"
                  />
                ),
                label: 'Retire',
                onClick: () => `TODO retire credit ${i}`,
              },
            ]}
          />
        )}
        renderBasketActionButtons={(i: number) => (
          <TableActionButtons
            buttons={[
              {
                icon: <TakeFromBasket />,
                label: 'Take from basket',
                // onClick: () => takeFromBasket(i),
                onClick: () => openModal(i),
              },
              // This will be handled from osmosis
              // so hiding these for now
              // {
              //   icon: <WithdrawIBC />,
              //   label: 'Withdraw (IBC)',
              //   onClick: () => `TODO withdraw ${i}`,
              // },
              // {
              //   icon: <DepositIBC />,
              //   label: 'Deposit (IBC)',
              //   onClick: () => `TODO deposit ${i}`,
              // },
            ]}
          />
        )}
      />
      <TakeFromBasketModal
        open={!!selectedBasket}
        holder={accountAddress || ''}
        batchDenom={selectedBasket?.basketDenom}
        availableTradableAmount={selectedBasket?.availableTradableAmount}
        onClose={() => setSelectedBasket(null)}
      />
    </>
  );
};
